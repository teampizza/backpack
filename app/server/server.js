Meteor.methods({
  updateCount: function(count) {
    AlertsCollection.insert({
      'clicked' : count
    });
  }
});