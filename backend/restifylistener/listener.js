var restify = require('restify');
var mongojs = require('mongojs');

var db = mongojs.connect('localhost:27017/backpack');
var alerts = db.collection('alerts');

var server = restify.createServer({
		name: 'backpacklistener',
});

server.listen(3001);

server.post('/netdata', function create(req, res, next) {

		var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
				// simple search for bad domain connect.facebook.net
				// nslookup: 23.73.127.228
				var stringbody = body.toString();
				var facedetect = stringbody.indexOf("facebook");
				if (facedetect != -1) { // we found facebook
						// find where it came from
						var regpattern = /www\.(.*)\.com/;
						var result = stringbody.match(regpattern);
						// store alert's result domain
						console.log(result[0]);
						alerts.save(JSON.parse(result[0]),
													function (err, data) {
															console.log(err);
															console.log(data);
													});
													 
				}
				
				// TODO DB storage and non-crazy searching
				// db.netdata.save(product,
  			// 								function (err, data) {
  			// 										res.writeHead(200, {
  			// 												'Content-Type': 'application/json; charset=utf-8'
  			// 										});
  			// 										res.end(JSON.stringify(data));
  			// 								});
    });
		res.end('AAAAAAAAAAAAA');
});
