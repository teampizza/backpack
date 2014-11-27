[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/teampizza/backpack)

backpack
========

identity is a payload

## outline

**backpack** is a tool for helping users understand the identity information they're presenting (and leaking) all over the internet. It provides understandable traffic introspection through readable reports and helpful alerts.

## motive

According to Pew Research, [users are struggling](http://www.pewinternet.org/2014/11/12/most-would-like-to-do-more-to-protect-their-personal-information-online/) to get a handle on what they can keep private, and how to do it. We all are.

We don't have a good grip on what identities we're carrying with us when we go from server to server, cloud to cloud, CDN to CDN. Between single sign-on, supercookies, writing analysis, deep packet inspection, and metadata tracking, it's hard to understand how identities are created, assigned, and tracked through the internet.

**backpack** aims to change this.

## key concepts

### models

There are a few user-friendly tools that provide individual users a narrow window into online identity tracking. [Ghostery](https://www.ghostery.com/) and [Privacy Badger](https://www.eff.org/privacybadger) look at cookies, beacons, and known tracking domains, providing a snap report at every page. [AdBlock](https://adblockplus.org/) and [NoScript](http://noscript.net/) work from domain-level blacklists, without analyzing specific content (how do you tell the 'good' javascript from the 'bad'?).

What makes **backpack** different is **models**. Every report and traffic alert relies on a specific model for analyzing local communications. Models can do anything with the local traffic stream, as long as they're useful. Whether it's watching for unencrypted torrent streams or warning on mixed Tor and non-Tor traffic, models define behaviors that result in loss of identity.

When a model's conditions are met, the traffic of interest is logged, summarized, and presented in an alert.

## technical

### build instructions

We'll be automating this later, but if you just want to jump in, here's the steps:

1. Clone repo
2. Install dependencies
    3. Python
    4. Node
    5. Meteor
    6. MongoDB
4. Start processes
    4. Start mongod
    3. Start Restify
    4. Start Meteor
    5. Start Python parser/network listener
6. Open browser to app page

Commands (POSIX):

	# repo
	git clone https://github.com/talexand/backpack.git
	cd backpack

	# dependencies
    ## python/listener
	sudo apt-get install python-setuptools debconf-utils
	sudo easy_install pip
	pip install pexpect
	pip install requests
	## set debconf config to create wireshark capture group
	sudo echo "wireshark-common wireshark-common/install-setuid boolean true" | debconf-set-selections
	sudo apt-get install tshark
	## add user to capture group
	sudo adduser $USER wireshark

    ## node
	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install -y nodejs
    ### should install mongojs, restify
	npm install

    ## meteor
	curl https://install.meteor.com/ | sh

	## mongodb
	sudo apt-get install mongodb

	# startup
	## mongod
	mongod --logpath ~/backpacklog

	## restify
	node backend/restifylistener/listener.js

	## meteor
	cd app/
	### fish
	set -x MONGO_URL "mongodb://127.0.0.1:27017/backpack"
	meteor &
	cd ..

	## python parser
	nano backend/parser/parser.py
    ### change tsharkinterface to "-i <your net interface>"
	python backend/parser/parser.py

	## open browser
	sensible-browser 'http://localhost:3000/'


To test, just visit a website that uses the Facebook Connect social beacon.

### backend ###

Here's a short list of the major components, from back to front.

#### TShark ####

We rely on [TShark](https://www.wireshark.org/docs/man-pages/tshark.html), the CLI to Wireshark, for the majority of our raw and 'lightly seared' data. Wireshark (and TShark) provide a nice interface for tracking and dissecting data. This data is parsed by a Python script (which also controls the TShark process) and passed along as JSON.

#### Restify+MongoDB ####

After parsing and conversion, the TShark data is picked up through local HTTP by a Restify process. This data will be made available to model threads for processing. (At the moment we're just analyzing in memory since we have so few models.)

When a model's tests pass, an alert event is triggered, and inserted into an alert database, which is read by the frontend.

### frontend ###

#### Meteor+frontend HTML ####

A Meteor process watches the alert database for changes, updating an HTML page feed with a low-intensity alert card. The user can acknowledge and snooze the alert, or mark it for followup. A click expands the card with further information and info link on how to seal the leak detected.
