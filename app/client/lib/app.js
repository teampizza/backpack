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
  'click #button a': function (e, t) {
    e.preventDefault();
    var parentClass = $(e.target).parent().attr('class');
    var reponse = 'no';

    if (parentClass == 'checkmark') {
      reponse = 'yes';
    }


    Meteor.call('feedContentResponse', this._id, reponse, function(error, result) {
      console.log(result);
    });
  },
});
