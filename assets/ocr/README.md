# Optional offline OCR pack

These files are downloaded only when the user prepares or invokes screenshot recognition. They are not part of the initial PWA app-shell cache. The original licenses are included next to the files.

| File | Source | Version |
| --- | --- | --- |
| `tesseract.min.js`, `worker.min.js` | [`tesseract.js`](https://github.com/naptha/tesseract.js) npm package | 6.0.1 |
| `tesseract-core-lstm.wasm.js`, `tesseract-core-lstm.wasm` | [`tesseract.js-core`](https://github.com/naptha/tesseract.js-core) npm package | 6.0.0 |
| `chi_sim.traineddata.gz` | [Project Naptha Tesseract fast language data](https://tessdata.projectnaptha.com/4.0.0_fast/chi_sim.traineddata.gz), derived from [`tessdata_fast`](https://github.com/tesseract-ocr/tessdata_fast) | Tesseract 4 fast |

Recognition runs locally in the browser. Images are not sent to a server. Before updating stock, the user can review/edit names and quantities; screenshot overlaps are merged and a full-bag import is checked against the bag total when readable.
