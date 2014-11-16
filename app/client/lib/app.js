Session.setDefault("counter", 0);

Template.hello.helpers({
  counter: function () {
    return Session.get("counter");
  },
  msg: function() {
    console.log(this.msg);
    return this.msg.split(',')[0];
  }
});

Template.feed.helpers({
  alerts: function () {
    return alertsCollection.find({}, {sort: {created_date: -1}});
  }

});

Template.hello.events({
  'click .update': function () {
    // increment the counter when button is clicked
    Session.set("counter", Session.get("counter") + 1);
  },

  'click .submit': function () {
    Meteor.call('updateCount', Session.get("counter"), function(error, result) {
      console.log(result);
    });
  },
});
