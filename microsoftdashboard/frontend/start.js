const { exec } = require('child_process');

exec('npx serve -s build -l 3000', { cwd: 'E:/microsoftdashboard/microsoftdashboard/frontend', shell: true }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
