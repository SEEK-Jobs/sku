const spawn = require('cross-spawn');
const path = require('path');
const chalk = require('chalk');
const cwd = process.cwd();

/*
 * Prettier must be ran from
 * command line to make use of command line output.
 * Use the bin file identified by Prettier's package.json
 */
const getPrettierBinLocation = () => {
  const prettierPackageJson = require('prettier/package.json');
  const prettierBinPath =
    typeof prettierPackageJson.bin === 'string'
      ? prettierPackageJson.bin
      : prettierPackageJson.bin.prettier;
  return require.resolve(path.join('prettier', prettierBinPath));
};

const runPrettier = ({ write, listDifferent, config, filePattern }) => {
  const prettierConfig = config || {};

  const prettierBinPath = getPrettierBinLocation();

  let prettierArgs = [];

  if (prettierConfig.singleQuote) {
    prettierArgs.push('--single-quote');
  }
  if (write) {
    prettierArgs.push('--write');
  }
  if (listDifferent) {
    prettierArgs.push('--list-different');
  }

  prettierArgs = prettierArgs.concat(filePattern);

  /*
   * Show Prettier output with stdio: inherit
   * The child process will use the parent process's stdin/stdout/stderr
   * See https://nodejs.org/api/child_process.html#child_process_options_stdio
   */
  const processOptions = {
    stdio: 'inherit'
  };

  console.log(chalk.gray(`prettier ${prettierArgs.join(' ')}`));

  const prettierProcess = spawn(
    prettierBinPath,
    prettierArgs.concat(filePattern),
    processOptions
  );

  return new Promise((resolve, reject) => {
    prettierProcess.on('exit', exitCode => {
      if (exitCode === 0) {
        resolve(exitCode);
        return;
      }
      reject(exitCode);
    });
  });
};

module.exports = {
  check: (filePattern, config) =>
    runPrettier({ listDifferent: true, config, filePattern }),
  write: (filePattern, config) =>
    runPrettier({ write: true, config, filePattern })
};
