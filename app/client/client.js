alertsCollection = new Meteor.Collection("alerts");
blacklistCollection = new Meteor.Collection("blacklist");

Meteor.subscribe("alerts");