[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/teampizza/backpack)

backpack
========

identity is a payload

## outline

**backpack** is a tool for helping users understand the identity information
they're presenting (and leaking) all over the internet. It provides
understandable traffic introspection through readable reports and helpful
alerts.

## motive

According to Pew Research,
[users are struggling](http://www.pewinternet.org/2014/11/12/most-would-like-to-do-more-to-protect-their-personal-information-online/)
to get a handle on what they can keep private, and how to do it. We all are.

We don't have a good grip on what identities we're carrying with us when we go
from server to server, cloud to cloud, CDN to CDN. Between single sign-on,
supercookies, writing analysis, deep packet inspection, and metadata tracking,
it's hard to understand how identities are created, assigned, and tracked
through the internet.

**backpack** aims to change this.

## key concepts

### models

There are a few user-friendly tools that provide individual users a narrow
window into online identity tracking. [Ghostery](https://www.ghostery.com/) and
[Privacy Badger](https://www.eff.org/privacybadger) look at cookies, beacons,
and known tracking domains, providing a snap report at every
page. [AdBlock](https://adblockplus.org/) and [NoScript](http://noscript.net/)
work from domain-level blacklists, without analyzing specific content (how do
you tell the 'good' javascript from the 'bad'?).

What makes **backpack** different is **models**. Every report and traffic alert
relies on a specific model for analyzing local communications. Models can do
anything with the local traffic stream, as long as they're useful. Whether it's
watching for unencrypted torrent streams or warning on mixed Tor and non-Tor
traffic, models define behaviors that result in loss of identity.

When a model's conditions are met, the traffic of interest is stored,
summarized, and presented in an alert.

## technical

### build instructions

1. Clone repo
2. Install dependencies
    4. Node
    5. Meteor
    6. MongoDB
7. Configuration
    8. Set `NET_INTERFACE` to your network interface name
    9. Run gulp task to grant network listening permission
4. Start processes
    5. Run gulp default task
6. Open browser to app page

Commands (POSIX):

	# repo
	git clone https://github.com/talexand/backpack.git
	cd backpack

	# dependencies
    ## node
	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install -y nodejs
    ### install other dependencies
	npm install

    ## meteor
	curl https://install.meteor.com/ | sh

	## mongodb
	sudo apt-get install mongodb

	# startup
	## mongod
	mongod --logpath ~/backpacklog
	cd app/

	## env vars
	nano gulpfile.js
	### change process.env.NET_INTERFACE to your iface name

	## network permissions
	gulp setcap

	## run
	gulp
	
	## open browser
	sensible-browser 'http://localhost:3000/'


To test, just visit a website that uses the Facebook Connect social beacon, such
as <http://www.socialmediatoday.com>.

### backend ###

Here's a short list of the major components, from back to front.

#### node_pcap ####

We rely on [node_pcap](https://github.com/mranney/node_pcap) for capturing and
parsing network traffic.

#### MongoDB ####

After parsing, the data is inserted into a MongoDB collection as a document
containing fields of interest. This data will be made available to model threads
for processing in
[v0.2](https://github.com/teampizza/backpack/milestones/v0.2%20second%20alpha).

When a model's tests pass, an alert event is triggered, and inserted into an
alert database, which is read by the frontend.

### frontend ###

#### Meteor+frontend HTML ####

A Meteor process watches the alert database for changes, updating an HTML page
feed with a low-intensity alert card. The user can acknowledge and snooze the
alert, or mark it for followup. A click expands the card with further
information and info link on how to seal the leak detected.
