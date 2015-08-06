// getting-started.js
var mongoose = require('mongoose');
var	async = require('async');
var request = require('request');
var cheerio = require('cheerio');
mongoose.connect('mongodb://localhost/test');
var url = 'https://www.raise.com/buy-target-gift-cards';
var brands = [{brand:'Target',url:'https://www.raise.com/buy-target-gift-cards'},
				{brand:'WalMart',url:'https://www.raise.com/buy-walmart-gift-cards'}];
console.log(brands);
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
	var today = new Date();
	var listDate = today.getDate() + "/" + (today.getMonth() + 1)+ "/" + today.getFullYear();

var targetrebate = new Rebate({ brandname: 'Target',listingdate: listDate,rebate: '6%' });
function saveandload(myrebate, callback){

console.log(myrebate.brandname); // 'Silence'
    async.series([
        //Load user
        function(callback) {
			console.log("Part 1");
			myrebate.save(function (err, myrebate) {
			  if (err) return console.error(err);
			  console.log('Saving:' + myrebate);
              callback(null,"One");
			});
        },
        function(callback) {
			console.log("Part 2");
			Rebate.find(function (err, kittens) {
				  if (err) return console.error(err);
//				  console.log("Finding:"+ kittens);
//				  db.close();
				  callback(null,"Two");
				});
				
        }
    ], function(err) {
        if (err) return next(err);
        console.log(err);
    });
}
/*
saveandload(targetrebate,function(err,result){
	console.log("Callback....");
});
*/
var brandItem = null;
for	(index = 0; index < brands.length; index++) {
    brandItem = brands[index];
	console.log(brandItem.brand + "---------------------------") ;
request(brandItem.url, function(err, resp, body){
  $ = cheerio.load(body);
  links = $('TR'); //use your CSS selector here
  $(links).each(function(index, link){
//    console.log($(link).html() + ':\n ');
	if(6 > index){
//	console.log('Index is :' + index + ':\n ');
	tds = $(link).children("TD");
	$(tds).each(function(i,td){
		if(3==i){
//			console.log('Index is :' + i + ':\n ');
			console.log($(td).text() + ':\n ');
			var rbt = $(td).text().substr(0,$(td).text().length - 1);
			var brandrebate = new Rebate({ brandname: $("span[itemprop='title']").text().substr(14),listingdate: listDate,rebate: rbt});
			console.log(brandrebate);
			saveandload(brandrebate,function(err,result){
				console.log("Callback....");
			});
		}
	}
	);
  }
	
  });

});
}
setTimeout(function(){db.close();}, 10000);
/*
silence.save(function (err, silence) {
  if (err) return console.error(err);
  console.log('Saving:' + silence.name);
});
Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log("Finding:"+ kittens);
});
*/
//db.close();
//mongoose.disconnect();