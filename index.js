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

//Function to get current ip address
function getIp () {
    var status = new Spinner('Getting your IP, please wait...');
    status.start();

    //Request the IP address
    request('https://api.ipify.org?format=json', function (err, res, data){
         if (err) {
			console.log(err)
			return;
		}
        data = JSON.parse(data);
        status.stop();
        console.log('\nYour IP is: ' + data.ip + '\n');
        exitApp();
    });
}


//Function that starts the app
function startApp() {
    inquirer.prompt([ {
    type: 'list',
    name: 'option',
    message: 'What do you want to do?',
    choices: [
      'Check my Ip address',
      'Search for a book (e.g: Things fall apart)',
      'Search for a location (e.g: Lagos University)',
    ]
  } ]).then(function (answer) {
      
        if(answer.option === 'Check my Ip address'){
            getIp();
        };

        if(answer.option === 'Search for a book (e.g: Things fall apart)'){
            findBook();
        }

        if(answer.option === 'Search for a location (e.g: Lagos University)'){
            getLocation();
        }

    });
}

//Function that Exits the app
function exitApp() {
    inquirer.prompt([ {
    type: 'list',
    name: 'option',
    message: 'Exit?',
    choices: [
      'Yes',
      'No',
    ]
  } ]).then(function (answer) {
      
        if(answer.option === 'No') return startApp();

        if(answer.option === 'Yes') return console.log(chalk.yellow('=============Thanks for using this app!============='));

    });
}

startApp();