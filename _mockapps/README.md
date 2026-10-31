# Mock project screenshots

The six sample projects (#07–#12) use real browser screenshots of small static
mock apps built here — not AI images. Each page is plain HTML/CSS + Chart.js,
rendered in headless Chrome and saved as `public/picture/mock-<slug>-real-N.png`
(1600x1000; mobile screens are grouped 3-up on a 1600x1000 board).

## Regenerate

```powershell
cd _mockapps
npm install
$env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
node src/build.mjs apps ..\public\picture          # all projects
node src/build.mjs apps ..\public\picture pulse-analytics   # one project
node sheet.mjs   # optional: contact-sheet.png of ./out (edit path inside if needed)
```

- Page content lives in `src/<app>.mjs` (`pages` + `shots` order = image order).
- Shared UI kit: `src/kit.mjs`. Photos: `photos/big` (Unsplash via picsum.photos).
- If you change the number of shots, update `imageCount`/`images` in
  `src/data/mockProjects.ts` and `image_count` in
  `tmrw-backend/app/services/mock_projects.py`, and bump `MOCK_IMAGES_KEY`
  in `tmrw-backend/app/services/content.py` so existing DB rows get refreshed.
- Thai text needs a Thai font installed (Leelawadee UI on Windows is used automatically).
