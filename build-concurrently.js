const concurrently = require('concurrently');

const logBlockMessage = (message, logFn = console.log) => {
  logFn('*-' + ''.padStart(message.length, '-') + '-*');
  logFn('| ' + message + ' |');
  logFn('*-' + ''.padStart(message.length, '-') + '-*');
};

const oneSecond = 1000;
const oneMinute = oneSecond * 60;

const startTime = new Date();
let endTime;

logBlockMessage(`Started running commands at ${startTime}`);

concurrently(
  [
    // Whitespaces in name of the command are used to align the output making it more readable.
    { name: 'lint prettier', command: 'npm:lint:prettier', prefixColor: 'yellowBright' },
    { name: 'eslint       ', command: 'npm:lint:eslint', prefixColor: 'redBright' },
    { name: 'lint styles  ', command: 'npm:lint:styles', prefixColor: '#09ff00' },
    { name: 'unit testing ', command: 'npm:test', prefixColor: 'cyanBright' },
    { name: 'app build    ', command: 'ng build', prefixColor: 'magentaBright' },
  ],
  {
    prefix: '{time} [{name}]',
    restartTries: 0,
  }
)
  .then(
    () => {
      endTime = new Date();
      logBlockMessage(`Finished running commands at ${endTime}`);
    },
    (error) => {
      process.exitCode = 1;

      endTime = new Date();
      logBlockMessage('The following commands failed:', console.error);

      // error also contains successful commands (exit code 0) so we need to filter them out.
      for (let process of error) {
        if (process.exitCode === 1) {
          console.error(`[${process.command.name}] ${process.command.command}`);
        }
      }
    }
  )
  .finally(() => {
    const duration = endTime.getTime() - startTime.getTime();
    const durationMilliseconds = duration % oneSecond;
    const durationSeconds = Math.floor((duration / oneSecond) % 60);
    const durationMinutes = Math.floor(duration / oneMinute);

    logBlockMessage(`Running the commands took ${durationMinutes}m ${durationSeconds}s ${durationMilliseconds}ms`);
  });
