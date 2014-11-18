BlacklistCollection = new Meteor.Collection("blacklist");

Meteor.publish("blacklist", function(){
  return BlacklistCollection.find();
});