Session.setDefault("counter", 0);

Template.hello.helpers({
  counter: function () {
    return Session.get("counter");
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
