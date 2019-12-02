const express = require('express'); // easier to work with that the HTTP module.
const path = require('path'); // works with diretories and file paths
var bodyParser = require("body-parser");
const csv = require('csv-parser');
const app = express(); // instantiate the module into a variable
var nodemailer = require('nodemailer');
const fs = require('fs');
const fileUpload = require('express-fileupload');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
//app.use(fileUpload());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// const port = 3000; // which port are you listening on?
const http = require('http');
const { parse } = require('querystring');

app.set("port", (process.env.PORT || 5000)); // sets the port to 5000


app.use(express.static(path.join(__dirname, 'public'))); // this allows js and css files to be linked to the HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/views/main.html'))); // when the root directory loads, sendthe index.html file to the client

app.post('/', (req, res) => res.sendFile(path.join(__dirname, 'public/views/main.html')));

app.get('/.well-known/brave-rewards-verification.txt', (req, res) => res.sendFile(path.join(__dirname, '.well-known/brave-rewards-verification.txt')));

app.post('/massTexter', function(req, res) {
	res.render('massTexter.ejs')});

//****CRYPTOEXCHANGE*************
//*******************************
//*******************************
app.get('/cryptoexchange', function(req, res) {
  const https = require('https');

https.get('https://blockchain.info/ticker', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data));
    let USD = JSON.parse(data).USD;
    let AUD = JSON.parse(data).AUD;
    let BRL = JSON.parse(data).BRL;
    let CAD = JSON.parse(data).CAD;
    let CHF = JSON.parse(data).CHF;
    let CLP = JSON.parse(data).CLP;
    let CNY = JSON.parse(data).CNY;
    let DKK = JSON.parse(data).DKK;
    let EUR = JSON.parse(data).EUR;
    let GBP = JSON.parse(data).GBP;
    let HKD = JSON.parse(data).HKD;
    let INR = JSON.parse(data).INR;
    let ISK = JSON.parse(data).ISK;
    let JPY = JSON.parse(data).JPY;
    let KRW = JSON.parse(data).KRW;
    let NZD = JSON.parse(data).NZD;
    let PLN = JSON.parse(data).PLN;
    let RUB = JSON.parse(data).RUB;
    let SEK = JSON.parse(data).SEK;
    let SGD = JSON.parse(data).SGD;
    let THB = JSON.parse(data).THB;
    let TWD = JSON.parse(data).TWD;
    res.render('CryptoExchange.ejs', {statusMessage:"<br><img src='../views/Bitcoin_logo.svg' width='135px' height='35px'> <br> <br>" + "USD: " + USD['15m'] + "<br>" + "AUD: " + AUD['15m'] + "<br>" + "BRL: " + BRL['15m'] + "<br>" + "CAD: " + CAD['15m'] + "<br>" + "CHF: " + CHF['15m'] + "<br>" +"CLP: " + CLP['15m'] + "<br>" + "CNY: " + CNY['15m'] + "<br>" + "DKK: " + DKK['15m'] + "<br>" + "EUR: " + EUR['15m'] + "<br>" + "GBP: " + GBP['15m'] + "<br>" + "HKD: " + HKD['15m'] + "<br>" + "INR: " + INR['15m'] + "<br>" + "ISK: " + ISK['15m'] + "<br>" + "JPY: " + JPY['15m'] + "<br>" + "KRW: " + KRW['15m'] + "<br>" + "NZD: " + NZD['15m'] + "<br>" + "PLN: " + PLN['15m'] + "<br>" + "RUB: " + RUB['15m'] + "<br>" + "SEK: " + SEK['15m'] + "<br>" + "SGD: " + SGD['15m'] + "<br>" + "THB: " + THB['15m'] + "<br>" + "TWD: " + TWD['15m'] + "<br>"});
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****END CRYPTOEXCHNAGE***************
//*************************************
//*************************************

//****FRENCH'S Financial Data MAIN**********
//******************************************
//******************************************
app.get('/frenchsFinancialData', function(req, res) {
  const https = require('https');

https.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=2XZVVF334ODD3HNT', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {

    let textTwo = "<b>Insert ticker for daily price data:</b><br><form name='form1' method='POST' action='/frenchsFinancialDataResp'><input type='text' name='ticker'><input type='submit'></form><br><b>Insert ticker to download price data CSV:</b><br><form name='form2' method='POST' action='/frenchsFinancialDataCSV'><input type='text' name='ticker'><input type='submit'></form>";
    
    res.render('frenchsFinancialData.ejs', {statusMessage: textTwo});
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****FRENCH'S Financial Data MAIN************
//********************************************
//********************************************

//****FRENCH'S Financial Data***************
//******************************************
//******************************************
app.post('/frenchsFinancialDataResp', function(req, res) {
  const https = require('https');

  console.log(req.body.ticker);
  
https.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + req.body.ticker + '&outputsize=full&apikey=2XZVVF334ODD3HNT', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
  console.log(data);

  // The whole response has been received. Print out the result.
  resp.on('end', () => {

    let text = JSON.parse(data)['Time Series (Daily)'];
    let textTwo = "";
    var x;
    let i = 0;
    console.log(text);
    var keys = Object.keys(text);
    for (x in text) {
    textTwo += keys[i] + ": " + text[x]['4. close'] + "<br>";
    i++;
    }

    console.log(textTwo);
    
    res.render('frenchsFinancialData.ejs', {statusMessage: textTwo});
    
  });

  
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****FRENCH'S Financial Data*****************
//********************************************
//********************************************

//****FRENCH'S Financial Data***************
//******************************************
//******************************************
app.get('/frenchsFinancialDataResp', function(req, res) {
  const https = require('https');

        var url = window.location.href,
            queryStart = url.indexOf("?") + 1,
            queryEnd   = url.length + 1,
            query = url.substr(queryStart + 6, queryEnd - 1);
  
    console.log(query);
  
https.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + query + '&outputsize=full&apikey=2XZVVF334ODD3HNT', (resp) => {
  let data = '';
  
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {

    let text = JSON.parse(data)['Time Series (Daily)'];
    let textTwo = "";
    var x;
    let i = 0;
    var keys = Object.keys(text);
    for (x in text) {
    textTwo += keys[i] + ": " + text[x]['4. close'] + "<br>";
    i++;
    }

    console.log(textTwo);
    
    res.render('frenchsFinancialData.ejs', {statusMessage: textTwo});
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****FRENCH'S Financial Data*****************
//********************************************
//********************************************

//****FRENCH'S Financial Data CSV***********
//******************************************
//******************************************
app.post('/frenchsFinancialDataCSV', function(req, res) {

  console.log(req.body.ticker);
    
    let textTwo = "<a href='https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + req.body.ticker + "&apikey=2XZVVF334ODD3HNT&datatype=csv'>Download " + req.body.ticker + " here.</a>";
    
    res.render('frenchsFinancialData.ejs', {statusMessage: textTwo});

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
//****FRENCH'S Financial Data CSV*************
//********************************************
//********************************************

//****FOURTHESTATE***************
//*******************************
//*******************************
app.get('/fourthEstate', function(req, res) {
  const https = require('https');

https.get('https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=220300c07f6f4660adff1337374b3861', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    
    var i;
    var text = "";
    for (i = 0; i < 6; i++) {
      text += "<br><br><img src='" + JSON.parse(data).articles[i].urlToImage + "' width='100%' height='10%'><br><br>" + "<b>Title: </b>" + JSON.parse(data).articles[i].title + "<br><b>Author: </b>" + JSON.parse(data).articles[i].author + "<br><b>Description: </b>" + JSON.parse(data).articles[i].description + "<br><b>Content: </b>" + JSON.parse(data).articles[i].content + "<br><a href='" + JSON.parse(data).articles[i].url + "'>Click here to read the full story</a>";
    }
    
    res.render('fourthEstate.ejs', {statusMessage: text});
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****END FOURTHESTATE*****************
//*************************************
//*************************************

//****FOURTHESTATE WSJ***************
//***********************************
//***********************************
app.get('/fourthEstateWSJ', function(req, res) {
  const https = require('https');

https.get('https://newsapi.org/v2/everything?domains=wsj.com&apiKey=220300c07f6f4660adff1337374b3861', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    
    var i;
    var text = "";
    for (i = 0; i < 6; i++) {
      text += "<br><br><img src='" + JSON.parse(data).articles[i].urlToImage + "' width='100%' height='10%'><br><br>" + "<b>Title: </b>" + JSON.parse(data).articles[i].title + "<br><b>Author: </b>" + JSON.parse(data).articles[i].author + "<br><b>Description: </b>" + JSON.parse(data).articles[i].description + "<br><b>Content: </b>" + JSON.parse(data).articles[i].content + "<br><a href='" + JSON.parse(data).articles[i].url + "'>Click here to read the full story</a>";
    }
    
    res.render('fourthEstate.ejs', {statusMessage: text});
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****END FOURTHESTATE WSJ*****************
//*****************************************
//*****************************************

//****FOURTHESTATE Entertainment***************
//*********************************************
//*********************************************
app.get('/fourthEstateEntertainment', function(req, res) {
  const https = require('https');

https.get('https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=220300c07f6f4660adff1337374b3861', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    
    var i;
    var text = "";
    for (i = 0; i < 6; i++) {
      text += "<br><br><img src='" + JSON.parse(data).articles[i].urlToImage + "' width='100%' height='10%'><br><br>" + "<b>Title: </b>" + JSON.parse(data).articles[i].title + "<br><b>Author: </b>" + JSON.parse(data).articles[i].author + "<br><b>Description: </b>" + JSON.parse(data).articles[i].description + "<br><b>Content: </b>" + JSON.parse(data).articles[i].content + "<br><a href='" + JSON.parse(data).articles[i].url + "'>Click here to read the full story</a>";
    }
    
    res.render('fourthEstate.ejs', {statusMessage: text});
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****END FOURTHESTATE Entertainment*****************
//***************************************************
//***************************************************

//****FOURTHESTATE Health**********************
//*********************************************
//*********************************************
app.get('/fourthEstateHealth', function(req, res) {
  const https = require('https');

https.get('https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=220300c07f6f4660adff1337374b3861', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    
    var i;
    var text = "";
    for (i = 0; i < 6; i++) {
      text += "<br><br><img src='" + JSON.parse(data).articles[i].urlToImage + "' width='100%' height='10%'><br><br>" + "<b>Title: </b>" + JSON.parse(data).articles[i].title + "<br><b>Author: </b>" + JSON.parse(data).articles[i].author + "<br><b>Description: </b>" + JSON.parse(data).articles[i].description + "<br><b>Content: </b>" + JSON.parse(data).articles[i].content + "<br><a href='" + JSON.parse(data).articles[i].url + "'>Click here to read the full story</a>";
    }
    
    res.render('fourthEstate.ejs', {statusMessage: text});
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****END FOURTHESTATE Health************************
//***************************************************
//***************************************************

//****FOURTHESTATE Science*********************
//*********************************************
//*********************************************
app.get('/fourthEstateScience', function(req, res) {
  const https = require('https');

https.get('https://newsapi.org/v2/top-headlines?country=us&category=science&apiKey=220300c07f6f4660adff1337374b3861', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    
    var i;
    var text = "";
    for (i = 0; i < 6; i++) {
      text += "<br><br><img src='" + JSON.parse(data).articles[i].urlToImage + "' width='100%' height='10%'><br><br>" + "<b>Title: </b>" + JSON.parse(data).articles[i].title + "<br><b>Author: </b>" + JSON.parse(data).articles[i].author + "<br><b>Description: </b>" + JSON.parse(data).articles[i].description + "<br><b>Content: </b>" + JSON.parse(data).articles[i].content + "<br><a href='" + JSON.parse(data).articles[i].url + "'>Click here to read the full story</a>";
    }
    
    res.render('fourthEstate.ejs', {statusMessage: text});
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****END FOURTHESTATE Science***********************
//***************************************************
//***************************************************

//****FOURTHESTATE Sports**********************
//*********************************************
//*********************************************
app.get('/fourthEstateSports', function(req, res) {
  const https = require('https');

https.get('https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=220300c07f6f4660adff1337374b3861', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    
    var i;
    var text = "";
    for (i = 0; i < 6; i++) {
      text += "<br><br><img src='" + JSON.parse(data).articles[i].urlToImage + "' width='100%' height='10%'><br><br>" + "<b>Title: </b>" + JSON.parse(data).articles[i].title + "<br><b>Author: </b>" + JSON.parse(data).articles[i].author + "<br><b>Description: </b>" + JSON.parse(data).articles[i].description + "<br><b>Content: </b>" + JSON.parse(data).articles[i].content + "<br><a href='" + JSON.parse(data).articles[i].url + "'>Click here to read the full story</a>";
    }
    
    res.render('fourthEstate.ejs', {statusMessage: text});
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****END FOURTHESTATE Sports************************
//***************************************************
//***************************************************

//****FOURTHESTATE Technology******************
//*********************************************
//*********************************************
app.get('/fourthEstateTechnology', function(req, res) {
  const https = require('https');

https.get('https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=220300c07f6f4660adff1337374b3861', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    
    var i;
    var text = "";
    for (i = 0; i < 6; i++) {
      text += "<br><br><img src='" + JSON.parse(data).articles[i].urlToImage + "' width='100%' height='10%'><br><br>" + "<b>Title: </b>" + JSON.parse(data).articles[i].title + "<br><b>Author: </b>" + JSON.parse(data).articles[i].author + "<br><b>Description: </b>" + JSON.parse(data).articles[i].description + "<br><b>Content: </b>" + JSON.parse(data).articles[i].content + "<br><a href='" + JSON.parse(data).articles[i].url + "'>Click here to read the full story</a>";
    }
    
    res.render('fourthEstate.ejs', {statusMessage: text});
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****END FOURTHESTATE Technology********************
//***************************************************
//***************************************************

app.post("/submit", function(req, res) {
	if(req.body){
			let keys = Object.keys(req.body);
			var transporter = nodemailer.createTransport({
  				service: 'gmail',
  				auth: {
    			user: req.body[keys[0]],
    			pass: req.body[keys[1]]
  						}
					});

			var i = req.body[keys[2]];
			res.render('pathOne.ejs', {statusMessage: "Congratulations! Your message was successfully sent to: " + i + "."});


var mailOptions = {
  from: req.body[keys[0]],
  to: i + '@vtext.com,' 
    + i + '@messaging.sprintpcs.com,'
    + i + '@text.att.net,'
    + i + '@tmomail.net,'
    + i + '@vmobl.com,',
  subject: '',
  text: req.body[keys[3]]
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


	}
});

//******************** massTexter ********************

app.post("/submitMassText", function(req, res) {
	//console.log(req.body);
    console.log(req.files);

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
 	let csvee = req.files.csvee;

  // Use the mv() method to place the file somewhere on your server
  csvee.mv('upload/csvee.csv', function(err) {
    if (err)
      return console.log(err);

    console.log("file moved");
  		  });

  	 if(req.body){
  						let keys = Object.keys(req.body);
			console.log(csvee.csv);
			var transporter = nodemailer.createTransport({
  				service: 'Outlook365',
  				auth: {
    			user: req.body[keys[0]] + "@byui.edu",
    			pass: req.body[keys[1]]
  						}
					});

			//var dataCSV = csvee.csv;

			var emailList = new Array();
				fs.createReadStream('upload/data2.csv')  
  				.pipe(csv())
  				.on('data', (row) => {
    			console.log('Displaying a row',row);
    			console.log("Data: ", parseInt(row.Number));
    			emailList.push(parseInt(row.Number));
  				})
  			.on('end', () => {
    			console.log('CSV file successfully processed');
    			console.log("Displaying the CSVParser:", emailList);

    		var i = 0;
    		var n = emailList.length;

do {
var mailOptions = {
  from: 'byuisupportcenter@byui.edu',
  to: emailList[i] + '@vtext.com,' 
    //+ emailList[i] + '@messaging.sprintpcs.com,'
    + emailList[i] + '@text.att.net,'
    + emailList[i] + '@tmomail.net,'
    + emailList[i] + '@vmobl.com,',
  subject: '',
  text: req.body[keys[2]]
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
i++;
	} while (i < n); 
})}
			res.render('pathOne.ejs', {statusMessage: "Congratulations! Your message was successfully sent to: " + "var/emailList" + "."});
});

app.listen(app.get("port"), function () { // listens on the port and displays a message to the console
	console.log("Now listening for connection on port: " + app.get("port"));
});