// index.js

var fs = require("fs");

const { csvFormat } = require('d3-dsv');
const Nightmare = require('nightmare');
const { readFileSync, writeFileSync } = require('fs');
const numbers = readFileSync('./tesco-title-numbers.csv', 
  {encoding: 'utf8'}).trim().split('\n');
const START = 'http://cme-fedwatch-prod.aws.barchart.com/static/index.html';			// 'https://eservices.landregistry.gov.uk/wps/portal/Property_Search';
const getAddress = async id => {
  console.log(`Now checking ` + START);
  const nightmare = new Nightmare({ show: false });
	// Go to initial start page, navigate to Detail search
	
		try {
			var selector = [];
			for (var i=0; i < 8; i++) {
				selector[i] = [ '#table' + i + ' tr:nth-child(2) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(3) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(4) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(5) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(6) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(7) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(8) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(9) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(10) td:nth-child(2)'
				];
			}
			
			await nightmare
			.goto(START)
			// .wait('.bodylinkcopy:first-child')
			.wait('#table0')
			.wait(1000)
			// .click('.bodylinkcopy:first-child');
			.evaluate(function (selector) {
				// now we're executing inside the browser scope.
					var querySelectorString = "";
					for (var i = 0; i < selector.length; i++) {
						for (var j = 0; j < selector[i].length; j++) {		// 1-based loop because the first 
							try {
								querySelectorString += document.querySelector( selector[i][j].replace( "td:nth-child(2)", "td:nth-child(1)" ) ).innerText + ": ";
								querySelectorString += document.querySelector(selector[i][j]).innerText + ", ";
							}
							catch(e) {
							}
						}
						querySelectorString = querySelectorString.substring(0, querySelectorString.length - 2);		// remove the extra comma and space that gets put on the end
						querySelectorString += '\n';		// line break to make everything look pretty
					}
					return querySelectorString;
				}, selector) // <-- that's how you pass parameters from Node scope to browser scope
			.then(function(text) {
				if (text != undefined) {
					fs.readFile( __dirname + "/" + "rateData.txt", 'utf8', function (err, data) {
						var d = new Date();
						var dateString = (d.getMonth()+1).pad(2) + "-" + d.getDate().pad(2) + "-" + d.getFullYear() + " " + d.getHours().pad(2) + ":" + d.getMinutes().pad(2) + ":" + d.getSeconds().pad(2);
						// res.end( "data received - " + text);	// this is essential to make sure that the client doesn't freak out because it didn't get a response
						fs.writeFile( __dirname + "/" + "rateData.txt", "Timestamp - " + dateString + " Futures price - " + " \n" + text + "\n" + data, function(err) {
							if(err) {
								return console.log(err);
							}
						});
					});
					console.log(text);
				}
			})
		} catch(e) {
			console.error(e);
		}
		
		/*
		try {
			var selector = [];
			var i=0;
			//for (var i = 0; i < 1; i++) {
				selector += [, '#table' + i + ' tr:nth-child(2) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(3) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(4) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(5) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(6) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(7) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(8) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(9) td:nth-child(2)',
					'#table' + i + ' tr:nth-child(10) td:nth-child(2)'
				];
			//}
			await nightmare
			.goto(START)
			// .wait('.bodylinkcopy:first-child')
			.wait('#table0')
			// .click('.bodylinkcopy:first-child');
			.evaluate(function (selector) {
				// now we're executing inside the browser scope.
					var querySelectorString = "";
					for (var j = 1; j < selector.length; j++) {		// 1-based loop because the first 
						try {
							querySelectorString += document.querySelector(selector[j]).innerText + ", ";
						}
						catch(e) {
						}
					}
					return querySelectorString;
				}, selector) // <-- that's how you pass parameters from Node scope to browser scope
			.then(function(text) {
				console.log(text);
			})
		} catch(e) {
			console.error(e);
		}
		*/
	
	/*
	// Type the title number into the appropriate box; click submit
	try {
		await nightmare
		.wait('input[name="titleNo"]')
		.type('input[name="titleNo"]', id)
		.click('input[value="Search »"]');
	} catch(e) {
		console.error(e);
	}
	
	// we should now be at the results page, this will extract the proper data from the page
	try {
		const result = await nightmare
		.wait('.w80p')
		.evaluate(() => {
		return [...document.querySelectorAll('.w80p')]
			.map(el => el.innerText);
		})
		.end();
		return { id, address: result[0], lease: result[1] };
	} catch(e) {
		console.error(e);
		return undefined;
	}
	*/
}

Number.prototype.pad = function (len) {
    return (new Array(len+1).join("0") + this).slice(-len);
}

getAddress(numbers[0])
  .then(a => console.dir(a))
  .catch(e => console.error(e));

