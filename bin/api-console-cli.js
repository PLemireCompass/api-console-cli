#!/usr/bin/env node
'use strict';
process.title = 'api-console';
const semver = require('semver');
// Early exit if the user's node version is too low.
if (!semver.satisfies(process.version, '>=6.4')) {
  const colors = require('colors/safe');
  console.log(colors.red(
    '\n' +
    'API Console CLI requires at least Node v6.4.0. ' +
    'You have ' + process.version + '.' +
    '\n'));
  process.exit(1);
}

const isCi = require('../lib/is-ci');
const {GaHelper} = require('../lib/ga-helper');
class ApiConsoleCli {
  /**
   * Tests if Google Analytics should not be allowed when running the command.
   * This includes GA question.
   * @return {Boolean} True when GA command cannot run.
   */
  get noGa() {
    return process.argv.indexOf('--no-ga') !== -1 || process.argv.indexOf('--help') !== -1;
  }
  /**
   * Runs the CLI command.
   *
   * @return {Promise}
   */
  runCommand() {
    if (this.running) {
      return;
    }
    this.running = true;
    require('./run');
    return Promise.resolve();
  }
  /**
   * Initializes the library.
   * @return {Promise}
   */
  init() {
    if (this.noGa || isCi) {
      return this.runCommand();
    }
    return this._initGa();
  }
  /**
   * Initializes GA configuration.
   * Asks the user to allows GA when configuration is missing.
   * @return {Promise}
   */
  _initGa() {
    this.helper = new GaHelper();
    return this.helper.init()
    .then((gaFirstInit) => this._processGaAllowed(gaFirstInit));
  }
  /**
   * Runs instructions after reading the configuration.
   * @param {?Boolean} gaFirstInit
   * @return {Promise}
   */
  _processGaAllowed(gaFirstInit) {
    if (gaFirstInit) {
      return this._askUser();
    }
    return this.runCommand();
  }
  /**
   * Asks the user to enable GA, saves the answer, and runs the command.
   * The question is dissmissed after about 10s.
   *
   * @return {Promise}
   */
  _askUser() {
    this.queryTimeout = setTimeout(() => {
      this.queryTimeout = undefined;
      this.runCommand();
      return;
    }, 10000);
    return this._getAnswer()
    .then((answer) => this._processAnswer(answer))
    .then(() => this.runCommand())
    .catch(() => {});
  }

  _getAnswer() {
    const inquirer = require('inquirer');
    return inquirer
    .prompt([{
      type: 'confirm',
      name: 'gaEnabled',
      message: 'Allow anonymous usage statistics to help improve our CLI tools?',
      default: true
    }]);
  }

  _processAnswer(answer) {
    if (!this.queryTimeout) {
      throw new Error('Timed out');
    }
    clearTimeout(this.queryTimeout);
    this.queryTimeout = undefined;
    return this.helper.updatePermissions(answer.gaEnabled);
  }
}

const cli = new ApiConsoleCli();
cli.init();
