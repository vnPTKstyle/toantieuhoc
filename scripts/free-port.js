/**
 * Giải phóng cổng TCP (Windows: netstat + taskkill). Dùng trước npm run watch / start.
 */
const { execSync } = require('child_process');
const os = require('os');

function parseListeningPids(netstatOut, port) {
  const pids = new Set();
  const portToken = `:${port}`;
  for (const line of netstatOut.split(/\r?\n/)) {
    if (!line.includes('LISTENING')) continue;
    if (!line.includes(portToken)) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
  }
  return pids;
}

function isNodeProcess(pid) {
  try {
    if (os.platform() === 'win32') {
      const out = execSync(`tasklist /FI "PID eq ${pid}" /NH`, { encoding: 'utf8' });
      return /node\.exe/i.test(out);
    }
    const out = execSync(`ps -p ${pid} -o comm=`, { encoding: 'utf8' });
    return /node/i.test(out);
  } catch {
    return false;
  }
}

function killPid(pid) {
  if (os.platform() === 'win32') {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
  } else {
    execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
  }
}

/**
 * @param {number} port
 * @param {{ exceptPids?: Set<number|string>, nodeOnly?: boolean }} [opts]
 * @returns {number[]} PIDs đã dừng
 */
function freePort(port, opts = {}) {
  const except = new Set([process.pid, ...(opts.exceptPids || [])].map(String));
  let out = '';
  try {
    if (os.platform() === 'win32') {
      out = execSync('netstat -ano', { encoding: 'utf8' });
    } else {
      out = execSync(`lsof -i :${port} -sTCP:LISTEN -t 2>/dev/null || true`, { encoding: 'utf8' });
      const pids = out
        .split(/\s+/)
        .filter(Boolean)
        .filter((p) => !except.has(p));
      const killed = [];
      for (const pid of pids) {
        if (opts.nodeOnly !== false && !isNodeProcess(pid)) continue;
        killPid(pid);
        killed.push(Number(pid));
      }
      return killed;
    }
  } catch {
    return [];
  }

  const killed = [];
  for (const pid of parseListeningPids(out, port)) {
    if (except.has(String(pid))) continue;
    if (opts.nodeOnly !== false && !isNodeProcess(pid)) continue;
    try {
      killPid(pid);
      killed.push(Number(pid));
    } catch {
      /* ignore */
    }
  }
  return killed;
}

module.exports = { freePort };
