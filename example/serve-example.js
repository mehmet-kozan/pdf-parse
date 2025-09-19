import express from 'express';
import path from 'path';
import fs from 'fs/promises';

const PORT = process.env.PORT || 5173;
const ROOT = path.resolve(process.cwd(), 'example', 'browser');
const PROJECT_ROOT = path.resolve(process.cwd());

const app = express();

// Serve static files from the browser example first
app.use(express.static(ROOT, { extensions: ['html'] }));

// Also serve project root so imports like /node_modules/... and /dist/... resolve
app.use(express.static(PROJECT_ROOT));


// 404 / fallback handler — if a static file is not found, show helpful file listing
app.use(async (req, res) => {
  try {
    const requested = decodeURIComponent(req.path || '/');
    const safe = path.normalize(requested).replace(/^[/\\]+/, '');
    const candidates = [
      path.join(ROOT, safe),
      path.join(PROJECT_ROOT, safe)
    ];

    // If requested path maps to an existing file or directory, serve or list it
    for (const candidate of candidates) {
      try {
        const st = await fs.stat(candidate);
        if (st.isFile()) {
          return res.sendFile(candidate);
        }
        if (st.isDirectory()) {
          const entries = await fs.readdir(candidate);
          const lines = [
            `Directory listing for ${candidate}:`,
            '',
            ...entries.map(e =>  `<li><a href=".\\${e}">${e}</a></li>`)
          ];
          res.type('text/html; charset=utf-8').status(200).send(lines.join('\n'));
          return;
        }
      } catch {
        // not present — try next candidate
      }
    }
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Example server running at http://localhost:${PORT}/`);
  console.log(`Serving: ${ROOT}`);
  console.log(`Also serving project root: ${PROJECT_ROOT}`);
});