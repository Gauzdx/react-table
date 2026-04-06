import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

let csvCaches = {
  A: null,
  B: null
};

function loadCsv(sourceFile) {
  try {
    const raw = fs.readFileSync(process.cwd() + '/' + sourceFile, 'utf-8');
    const lines = raw.trim().split('\n');
    return lines.map(line => line.split(','));
  } catch (e) {
    console.error(`Error loading ${sourceFile}`);
    return [];
  }
}

function csvApiPlugin() {
  return {
    name: 'csv-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/data')) {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const source = url.searchParams.get('source') || 'A';
          const startRow = parseInt(url.searchParams.get('startRow') || '0', 10);
          const endRow = parseInt(url.searchParams.get('endRow') || '20', 10);
          const startCol = parseInt(url.searchParams.get('startCol') || '0', 10);
          const endCol = parseInt(url.searchParams.get('endCol') || '20', 10);

          if (!csvCaches[source]) {
            console.log(`Loading data${source}.csv into memory...`);
            csvCaches[source] = loadCsv(`data${source}.csv`);
          }

          const cache = csvCaches[source];
          const responseData = [];
          for (let r = startRow; r < endRow; r++) {
            if (!cache[r]) break;
            responseData.push(cache[r].slice(startCol, endCol));
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(responseData));
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), csvApiPlugin()],
})
