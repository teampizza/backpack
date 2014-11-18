var restify = require('restify');
var mongojs = require('mongojs');

var db = mongojs.connect('localhost:27017/backpack', ['alerts']);
// var alerts = db.collection('alerts');

var server = restify.createServer({
		name: 'backpacklistener',
});

server.listen(3002);

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
						var regpattern = new RegExp("[htps:]*//([a-zA-Z0-9\\-\\.]*\\.[a-zA-Z]{2,3})", "gi");
						var result = stringbody.match(regpattern);
						// store alert's result domain
            if (result) {
              console.log(result[0]);
              db.alerts.save({
                msg: result[0],
                created_date: Date.now()
              });
            }
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
