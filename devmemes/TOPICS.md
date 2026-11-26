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
- 04 lgtm — 2-line PR gets 40 comments → 2000-line refactor PR → LGTM in 2 min, files viewed 0/86
- 05 mocked — 142/142 tests green, 95% coverage → prod down, ECONNREFUSED → jest.mock('./db'): sab mock tha, mera confidence bhi
- 06 standup — "looking into it" Mon→Thu standups → QA closes ticket: Cannot reproduce → Friday standup: "FIXED." (commits: 0)
- 07 unused — IDE: 'legacy' is never read → delete 1 line → 37 tests fail, checkout total: undefined → line restored with // DO NOT TOUCH: ab main bhi legacy hoon
- 08 readerror — build fails, 400-line stack trace → Ctrl+V into AI, reinstall Node / clear cache, 20 min gone → line 1 said Cannot find module './utlis': error ne bataya tha, maine padha nahi
- 09 timezone — order-date feature: local perfect, QA pass → 12:31 AM support call: aaj ke orders kal ki date pe → code sahi tha, bas server London time (UTC) pe jeeta hai
- 10 rubberduck — 3 din se bug pe atka → senior ko call, screen share, line-by-line explain... "ruko." → bug khud mil gaya, senior ke words: 0 → "thanks bhai, bahut help hui" (senior = rubber duck)
- 11 consolelog — "bas ek console.log" → here, here again, aaaaa → PR merged → client demo, CTO opens DevTools (47 logs) → top: "bhai ye chal kyu nahi raha", bottom: "kisi ko pata na chale"

## Backlog ideas (pick one not done, or a fresh relatable one)
- "// TODO: fix later" written years ago → git blame: you
- "It's not a bug, it's a feature" → client demo
- Naming a variable takes longer than writing the function
- Works after restart, nobody knows why
- Merge conflict on Friday evening in package-lock.json
- Regex written by you 6 months ago, unreadable today
- Production DB vs local DB: "same schema" (it wasn't)
