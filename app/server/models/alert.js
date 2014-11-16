AlertCollection = new Meteor.Collection("alert");

Meteor.publish("alerts", function(){
  return AlertCollection.find();
});