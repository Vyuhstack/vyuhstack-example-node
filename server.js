const { execSync } = require('node:child_process');
const express = require('express');

// The commit this process was started from, so each deploy is visible.
function commit() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: __dirname }).toString().trim();
  } catch {
    return 'unknown';
  }
}

const COMMIT = commit();
const STARTED_AT = new Date().toISOString();
const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.get('/', (_req, res) => {
  res.send(`<h1>Hello from VyuhStack</h1>
<p>An Express app deployed on every push.</p>
<p>Commit <code>${COMMIT}</code>, started <code>${STARTED_AT}</code></p>`);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', commit: COMMIT, startedAt: STARTED_AT });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}, commit ${COMMIT}`);
});
