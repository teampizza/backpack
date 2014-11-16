AlertsCollection = new Meteor.Collection("alerts");

Meteor.publish("alerts", function(){
  return AlertsCollection.find();
});


AlertsCollection.allow({
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  }
});