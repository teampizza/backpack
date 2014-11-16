AlertsCollection = new Meteor.Collection("alerts");

Meteor.publish("alerts", function(){
  return AlertsCollection.find();
});