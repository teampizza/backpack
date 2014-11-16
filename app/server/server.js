Meteor.methods({
  updateCount: function(count) {
    AlertCollection.insert({
      'clicked' : count
    });
  }
});