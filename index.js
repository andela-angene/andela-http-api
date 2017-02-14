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

//Function to search for a book
function findBook() {
    inquirer.prompt([ {
            type: 'input',
            name: 'bookname',
            message: 'What is the name of the book you are searching for?  '
        },
        {
            type: 'input',
            name: 'author',
            message: "What is the name of the author? (can be left blank, just hit enter)  ",
        },
        ]).then(function (answer) {
            //Make book and author name web address friendly
            var bookname    = answer.bookname.split(/\s+/).join('+'),
                bookauthor  = '+inauthor:' + answer.author.split(/\s+/).join('+');
            if (bookauthor === '+') bookauthor = "";

            var link = 'https://www.googleapis.com/books/v1/volumes?q=' + bookname + bookauthor + '&key=AIzaSyAyKXkBnhznb1LtPC_y_a0PawNbIT-72vw';
            var status = new Spinner('Getting requested information, please wait...');
            status.start();
            request(link, function (err, res, data){
                if (err) return console.log(err);
                data = JSON.parse(data);
                status.stop();

                //Exit if nothing was found
                if (data.totalItems === 0) {
                    console.log('\nNothing found.\n');
                    return exitApp();
                } 

                //Display book information
                console.log('\n Total search results: ' + data.totalItems + chalk.green('\n Results (max of 10): \n'));
                data.items.forEach(function(item){
                    console.log(chalk.yellow('Title: ') + item.volumeInfo.title);
                    console.log(chalk.yellow('Author(s): ') + item.volumeInfo.authors);
                    console.log(chalk.yellow('View book: ') + chalk.green(item.volumeInfo.previewLink) + '\n');
                });
                exitApp();
            });
        }); 
}

//Function to get the Address, Longitude and Latitude of a location
function getLocation() {
    inquirer.prompt([ {
            type: 'input',
            name: 'location',
            message: 'What location are you searching for?  '
        },
        ]).then(function (answer) {
            var location    = answer.location.split(/\s+/).join('+');
            if (location === '+') {
                console.log('No argument was provided\n');
                exitApp();
            };

            var link = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&sensor=false';
            console.log(link);
            var status = new Spinner('Getting requested information, please wait...');
            status.start();
            request(link, function (err, res, data){
                if (err) return console.log(err);
                data = JSON.parse(data);
                status.stop();
                console.log(chalk.green('\n Result: \n'));

                //Exit if nothing was found
                if (data.results.length === 0) {
                    console.log('Nothing found \n')
                    return exitApp();
                };

                //Display location details
                console.log(chalk.yellow('Address: ') + data.results[0].formatted_address);
                console.log(chalk.yellow('Latitude: ') + data.results[0].geometry.location.lat);
                console.log(chalk.yellow('Longitude: ') + data.results[0].geometry.location.lng + '\n');
                exitApp();
            });
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