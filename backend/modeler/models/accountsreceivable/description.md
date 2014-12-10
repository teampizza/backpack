accounts receivable (draft)
========

your papers please

## model description

This model looks for users about to enter data into known information silos,
especially those opposed to complete account deletion (see
http://justdelete.me/). The model warns them that this kind of leak can't be
tracked well, and that there is probably no way to get it back.

### technical specification

#### backend ####

`node-pcap` for now (db collection `netdata`).

#### fields ####

Accounts Receivable checks `ip.daddr` against a list of known information silos,
then parses `ip.tcp.data` for a login URL GET request.

It would be preferable if it could specifically determine if the user was about
to submit data or login, and warn them at that point only.

#### format ####

Specifically, it needs:

    {
	  "backend": "node-pcap",
      "link": {
        "ip": {
		  daddr: IP_ADDR,
		  "tcp": ["data"]
		}
      }
    }

#### alert conditions ####

Model alerts on traffic sent to a silo blacklist containing GET requests for
login pages.

### report layout ###

Report gives an abbreviated JSON of `msg: ddomain` and `created_date` at the
moment, but will be revised with alert spec.

    {
	  "msg": ddomain,
	  "created_date": Date.now()
	}
