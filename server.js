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



//const csv = require('csv-parser'); //for parsing the phone number csv's
//const fs = require('fs');

//var upload = require("express-fileupload"); //file upload module
//app.use(upload())

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
  let keys = Object.keys(JSON.parse(data))
  resp.on('end', () => {
    console.log(JSON.parse(data));
    res.render('CryptoExchange.ejs', {statusMessage: "Congratulations! Your message was successfully sent to: " + data[keys[0]] + "."});
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
//****END CRYPTOEXCHNAGE***************
//*************************************
//*************************************

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
	/*res.send("success!");
	if(req.files){
		var file = req.files.filename,
		filename = file.name;
		file.mv("./upload/"+filename,function(err){
			if(err){
					console.log(err)
					res.send("error occurred")
				}
				else{
						res.send("failure")
				}
		})
	}*/
});

//******************** massTexter ********************

app.post("/submitMassText", function(req, res) {
	//console.log(req.body);
    console.log(req.files);


  /* if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  } */

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

/*app.get("/submit", function(req, res) {
	if(req.body){
			res.send(body);
	}
	/*if(req.files){
		//var file = req.files.filename,
		//filename = file.name;
		 var emailList = new Array();
			fs.createReadStream("./upload/"+filename)  
  			.pipe(csv())
  			.on('data', (row) => {
    			console.log('Displaying a row',row);
    			console.log("Data: ", parseInt(row.Number));
    			emailList.push(parseInt(row.Number));
  								})
  		.on('end', () => {
    		console.log('CSV file successfully processed');
    		console.log("Displaying the CSVParser:",emailList);

		var n = emailList.length;
		var i = 0; 

		res.send("Success! Length: " + n);
		});

  }
});*/

app.listen(app.get("port"), function () { // listens on the port and displays a message to the console
	console.log("Now listening for connection on port: " + app.get("port"));
});

// ****************************************************
// ******************** nodeMailer ********************
// ****************************************************

/* var nodemailer = require('nodemailer');
const csv = require('csv-parser');
const fs = require('fs');
var transporter = nodemailer.createTransport({
  service: 'Outlook365',
  auth: {
    user: 'trevorfrench@byui.edu',
    pass: 'xxx'
  }
});
 
var emailList = new Array();
  function sendText() {
fs.createReadStream('data.csv')  
  .pipe(csv())
  .on('data', (row) => {
    console.log('Displaying a row',row);
    console.log("Data: ", parseInt(row.Number));
    emailList.push(parseInt(row.Number));
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    console.log("Displaying the CSVParser:",emailList);

var n = emailList.length;
var i = 0;

do {
var mailOptions = {
  from: 'byuisupportcenter@byui.edu',
  to: emailList[i] + '@vtext.com,' 
    + emailList[i] + '@messaging.sprintpcs.com,'
    + emailList[i] + '@text.att.net,'
    + emailList[i] + '@tmomail.net,'
    + emailList[i] + '@vmobl.com,',
  subject: '',
  text: 'This is a reminder that Monday is a holiday and the BSC will not be open.'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
console.log(emailList[i] + '@vtext.com'); 
i++;
} while (i < n);
  });
}

// **************************************************
// ******************** nodeIMAP ********************
// **************************************************

/*    inspect = require('util').inspect;

var imap = new Imap({
  user: 'trevorf96@gmail.com',
  password: 'xxx',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('1:3', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect(); */
