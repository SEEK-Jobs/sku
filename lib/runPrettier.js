const { spawn } = require('child_process');
const path = require('path');

const cwd = process.cwd();

const filePattern = 'src/**/*.js';

/*
 * Prettier must be ran from
 * command line to make use of command line output.
 * Use the bin file identified by it's package.json
 */
function getPrettierBinLocation() {
  const prettierPackageJson = require('prettier/package.json');
  return require.resolve(
    path.join('prettier', prettierPackageJson.bin.prettier)
  );
}

function runPrettier({ write, listDifferent, config }) {
  const prettierConfig = config || {};

  const prettierBinPath = getPrettierBinLocation();

  const prettierArgs = [filePattern];

  if (prettierConfig.singleQuote) {
    prettierArgs.push('--single-quote');
  }
  if (write) {
    prettierArgs.push('--write');
  }
  if (listDifferent) {
    prettierArgs.push('--list-different');
  }

  /*
   * Show Prettier output with stdio: inherit
   * The child process will use the parent process's stdin/stdout/stderr
   * See https://nodejs.org/api/child_process.html#child_process_options_stdio
   */
  const processOptions = {
    stdio: 'inherit'
  };

  const prettierProcess = spawn(prettierBinPath, prettierArgs, processOptions);

  return new Promise((resolve, reject) => {
    prettierProcess.on('exit', exitCode => {
      if (exitCode === 0) {
        resolve(exitCode);
        return;
      }
      reject(exitCode);
    });
  });
}

function write(config) {
  return runPrettier({ write: true, config });
}

function check(config) {
  return runPrettier({ listDifferent: true, config });
}

module.exports = {
  check,
  write
};
