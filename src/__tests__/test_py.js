const { spawn } = require('child_process');

const pythonProcess = spawn('python3', ['-u', 'src/__tests__/my_script.py']);

// Handle real-time output from Python stdout
pythonProcess.stdout.setEncoding('utf8'); // Ensure the output is a string
pythonProcess.stdout.on('data', (data) => {
  data.split('\n').forEach((line) => {
    if (line.trim()) {
      console.log(`Python output: ${line}`);
    }
  });
});

// Handle real-time output from Python stderr
pythonProcess.stderr.setEncoding('utf8'); // Ensure the output is a string
pythonProcess.stderr.on('data', (data) => {
  data.split('\n').forEach((line) => {
    if (line.trim()) {
      console.error(`Python error: ${line}`);
    }
  });
});

// Handle the process close event
pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);
});
