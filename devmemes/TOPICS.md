# Dev Memes (Debug Diaries · highlight "Memes")

Engine: `memes.py` (cairo, 1080x1920@30, voice-synced 3-beat reels: setup → twist → punch).
Run: `python3 memes.py <name>` from this folder → `out/<OUTNAME>.mp4`. `python3 memes.py <name> preview` → stills in `preview/`.
Voice: Sarvam `sunny_hi_reels` (`SARVAM_SPEAKER=sunny_hi_reels python3 ../scripts/audio/sarvam_tts.py memes/<name>/script.txt memes/<name>`),
then for each part: tighten.py → trim silence → `memes/<name>/p1..p3.mp3` (see the scheduled-task prompt for the exact commands).
No spoken "Follow करो Debug Diaries" at the end (the on-screen Follow pill stays).

## Done
- 01 friday — Friday 6 PM one-line deploy → 2 AM alerts → git blame: main hi tha
- 02 fivemin — "bas 5 minute ka kaam hai" → npm hell → 5 ghante, fix was cache clear
- 03 safari — pixel perfect in Chrome → client opens Safari on iPhone → naya Internet Explorer

## Backlog ideas (pick one not done, or a fresh relatable one)
- "// TODO: fix later" written years ago → git blame: you
- Tests 142 passed → prod down → tests mock the database
- "quick console.log" → 200 logs → pushed to prod with all logs
- Read the error message → 400-line stack trace → copies line 1 into ChatGPT
- Standup: "looking into it" Mon→Fri
- "It's not a bug, it's a feature" → client demo
- Naming a variable takes longer than writing the function
- Works after restart, nobody knows why
- Merge conflict on Friday evening in package-lock.json
- Regex written by you 6 months ago, unreadable today
- Production DB vs local DB: "same schema" (it wasn't)
- Code review: 2-line PR gets 40 comments, 2000-line PR gets "LGTM"
- Timezone bug that only happens at midnight IST
- Junior: "should I ask?" Senior: "kab se atke ho?" "3 din se"
- Deleting one unused line → everything breaks
