backpack
========

identity is a payload

## outline

backpack is a tool for helping users understand the identity information they're presenting (and leaking) all over the internet. It provides understandable traffic introspection through readable reports and helpful alerts.

## motive

According to Pew Research, [users are struggling](http://www.pewinternet.org/2014/11/12/most-would-like-to-do-more-to-protect-their-personal-information-online/) to get a handle on what and how they can keep private. We all are.

We don't have a good grip on what identities we're carrying with us when we go from server to server, cloud to cloud, CDN to CDN. Between single sign-on, supercookies, writing analysis, deep packet inspection, and metadata tracking, it's hard to understand how identities are created, assigned, and tracked through the internet.

backpack aims to change this.

## key concepts

### models

There are a few user-friendly tools that provide individual users a narrow window into online identity tracking. Ghostery and Privacy Badger look at cookies, beacons, and known tracking domains, providing a snap report at every page. AdBlock and NoScript work from domain-level blacklists, without analyzing specific content.

What makes backpack different is **models**. Every report and traffic alert relies on a specific model for analyzing local communications. Models can do anything with the local traffic stream, as long as they're useful. Whether it's watching for unencrypted torrent streams or warning on mixed Tor and non-Tor traffic, models define behaviors that result in loss of identity.

When a model's conditions are met, the traffic of interest is logged, summarized, and presented in an alert.

## backend

### TShark

We'll probably rely on TShark, the CLI to Wireshark, for the majority of our raw and 'lightly seared' data. Wireshark (and TShark) provide a nice interface for tracking and dissecting data. Our job is to help users understand what it means.

## frontend

### browser

The initial reporting frontend will be browser-based for compatibility.
