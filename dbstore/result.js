// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Connection open');
});
db.on('close', function (callback) {
  console.log('Connection closed');
});
db.on('disconnected', function (callback) {
  console.log('Connection disconnected');
});
var rebateSchema = mongoose.Schema({
    brandname: String,
	listingdate: String,
	rebate: String
});
var Rebate = mongoose.model('Rebate', rebateSchema);
			Rebate.find(function (err, kittens) {
				  if (err) return console.error(err);
				  console.log("Finding:"+ kittens);
				  db.close();
		  });
