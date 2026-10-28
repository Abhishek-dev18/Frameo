# Tighten pauses: every silence longer than MAXGAP becomes MAXGAP. Parts joined with PARTGAP.
# Prints phrase start times (seconds) in the final timeline, per part.
import subprocess, re, json, sys
MAXGAP, PARTGAP, LEAD = 0.18, 0.08, 0.06
parts = sys.argv[1:-1]; out = sys.argv[-1]
def dur(f): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f]).decode())
def sil(f):
    e = subprocess.run(["ffmpeg","-i",f,"-af","silencedetect=noise=-35dB:d=0.12","-f","null","-"],capture_output=True,text=True).stderr
    s=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",e)]; t=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",e)]
    return list(zip(s,t))
segs=[]; cues=[]; t=LEAD
for pi,f in enumerate(parts):
    D=dur(f); S=[(a,b) for a,b in sil(f) if b-a>0]
    # speech chunks between silences
    chunks=[]; cur=0.0
    for a,b in S:
        if a>cur+0.02: chunks.append([cur,a])
        cur=b
    if D>cur+0.02: chunks.append([cur,D])
    pc=[]
    for i,(a,b) in enumerate(chunks):
        if i>0:
            gap=a-chunks[i-1][1]
            g=min(gap,MAXGAP)
            # keep the gap as real audio (room tone) but shortened
            mid=chunks[i-1][1]
            segs.append((pi,mid,mid+g/2)); segs.append((pi,a-g/2,a)); t+=g
        pc.append(round(t,3)); segs.append((pi,a,b)); t+=b-a
    cues.append({"part":pi+1,"start":pc[0],"phrases":pc,"end":round(t,3)})
    t+=PARTGAP
# build with ffmpeg
inputs=[]; flt=[]
for i,f in enumerate(parts): inputs+=["-i",f]
labels=[]
for k,(pi,a,b) in enumerate(segs):
    flt.append(f"[{pi}:a]atrim={a:.4f}:{b:.4f},asetpts=PTS-STARTPTS,aresample=44100,aformat=channel_layouts=mono[s{k}]"); labels.append(f"[s{k}]")
# part gaps + lead as silence
flt2=[]; seq=[]; k=0
flt.append(f"anullsrc=r=44100:cl=mono,atrim=0:{LEAD}[lead]"); seq.append("[lead]")
last=None
for k,(pi,a,b) in enumerate(segs):
    if last is not None and pi!=last:
        flt.append(f"anullsrc=r=44100:cl=mono,atrim=0:{PARTGAP}[g{k}]"); seq.append(f"[g{k}]")
    seq.append(f"[s{k}]"); last=pi
flt.append("".join(seq)+f"concat=n={len(seq)}:v=0:a=1[v]")
subprocess.run(["ffmpeg","-y","-loglevel","error",*inputs,"-filter_complex",";".join(flt),"-map","[v]",out],check=True)
print(json.dumps(cues,indent=1)); print("total",round(t-PARTGAP,3))
