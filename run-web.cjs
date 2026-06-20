const { spawn } = require('child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const processes = [
  spawn('node', ['mock-server.cjs'], {
    cwd: __dirname,
    stdio: 'inherit'
  }),
  spawn(npmCommand, ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit'
  })
];

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(exitCode);
}

for (const child of processes) {
  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      shutdown(code || 1);
    }
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
