Meteor.methods({
  feedContentResponse: function(feedId, reponse) {
    console.log(feedId, reponse);
    AlertsCollection.update({_id: feedId}, {$set:{"status": reponse}});
    console.log("Done");
  }
});