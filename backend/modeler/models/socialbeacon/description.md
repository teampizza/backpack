social beacon (draft)
========

social butterflies to the flame

## model description

This model looks for traffic going to known social widget domains. Most of these
widgets are 'smart', in that they're logging who loads them, from where. The
user is telling the social networks what they're reading.

### technical specification

### backend ###

`node-pcap` for now (db collection `netdata`).

### fields ###

Currently Social Beacon only checks for a connection going to
`connect.facebook.com` and a `Referrer` in the `tcp.data` object.

### format ###

Specifically, it needs:

    {
	  "backend": "node-pcap",
      "link": {
        "ip": {
		  "tcp": ["data"]
		}
      }
    }

### alert conditions

Model alerts on any traffic sent to `connect.facebook.com` (currently it just
regexes `tcp.data`). If it finds it, it alerts providing the referrer (also in
`tcp.data`).

### report layout ###

Report gives an abbreviated JSON of `msg: referer` and `createdDate` at the
moment, but will be revised with alert spec.

    {
	  "msg": referer,
	  "createdDate": Date.now()
	}
