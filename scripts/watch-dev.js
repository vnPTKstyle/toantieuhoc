/**
 * Dev watch: restart server khi backend đổi; build reader-js khi nguồn đổi; build PDF khi file sách đổi.
 * npm run watch
 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { freePort } = require('./free-port');

const root = path.join(__dirname, '..');
const PDF_NAME = 'Tập đánh vần tiếng việt 4 - 6 tuổi.pdf';
const PORT = Number(process.env.PORT) || 3000;

function log(msg) {
  console.log(`[watch] ${msg}`);
}

function runNpmScript(name) {
  execSync(`npm run ${name}`, { cwd: root, stdio: 'inherit' });
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function watchFile(relPath, onChange) {
  const full = path.join(root, relPath);
  if (!fs.existsSync(full)) return;
  try {
    fs.watch(full, { persistent: true }, debounce(() => {
      log(`đổi: ${relPath}`);
      onChange();
    }, 400));
  } catch (e) {
    log(`không watch được ${relPath}: ${e.message}`);
  }
}

function ensurePortFree() {
  const killed = freePort(PORT, { exceptPids: new Set([process.pid]) });
  if (killed.length) {
    log(`đã dừng Node cũ trên cổng ${PORT}: PID ${killed.join(', ')}`);
  }
}

function startServer() {
  ensurePortFree();
  log(`server: node --watch server.js (http://localhost:${PORT})`);
  const child = spawn(process.execPath, ['--watch', 'server.js'], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  child.on('exit', (code, signal) => {
    if (signal) log(`server dừng (${signal})`);
    else if (code !== 0 && code != null) process.exitCode = code;
  });
  return child;
}

const buildReader = debounce(() => {
  try {
    log('build:reader-js…');
    runNpmScript('build:reader-js');
    log('build:reader-js xong — F5 trình duyệt nếu đang mở sách');
  } catch (e) {
    log(`build:reader-js lỗi: ${e.message}`);
  }
}, 300);

const buildDanhVan = debounce(() => {
  try {
    log('build:danh-van… (126 trang, có thể lâu)');
    runNpmScript('build:danh-van');
    log('build:danh-van xong — server sẽ tự restart nếu manifest đổi');
  } catch (e) {
    log(`build:danh-van lỗi: ${e.message}`);
  }
}, 3000);

log('build ban đầu: reader-js');
try {
  runNpmScript('build:reader-js');
} catch (e) {
  log(`build:reader-js lỗi: ${e.message}`);
}

startServer();

watchFile('public/js/dv-speech.js', buildReader);
watchFile('public/js/danh-van-pdf.js', buildReader);
watchFile('scripts/build-danh-van-pages.js', buildDanhVan);
watchFile(PDF_NAME, buildDanhVan);

log('đang theo dõi: server.js + data/* (node --watch), dv-speech, danh-van-pdf, PDF sách');
