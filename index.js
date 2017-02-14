'use strict';

var request = require('request'),
    clear   = require('clear'),
    figlet  = require('figlet'),
    inquirer    = require('inquirer'),
    chalk       = require('chalk'),
    Spinner     = require('clui').Spinner;

clear();
console.log(
  chalk.green(
    figlet.textSync('Welcome!', { horizontalLayout: 'full' })
  )
);