Meteor.methods({
  feedContentResponse: function(feedId, reponse) {
    AlertsCollection.update({_id: feedId}, {$set:{"status": reponse}});
  }
});