'use strict';

Template.feed.helpers({
  alerts: function() {
    return alertsCollection.find({status: 'new'}, {sort: {created: -1}});
  }
});

Template.hello.helpers({
  status: function() {
    if (this.status == 'yes') {
      return 'green';
    } else {
      return 'red';
    }
  }
});

var alertsRead = [];

Template.hello.events({
  'click #button .checkmark': function(e, t) {
    e.preventDefault();
    var parentClass = $(e.target).parent().attr('class');
    var reponse = 'read';

    Meteor.call('feedContentResponse', this._id, reponse, function(error, result) {
      console.log(result);
    });
  },

  'click #button .xmark': function(e, t) {
    e.preventDefault();
    var $this = $(e.target);

    $this.parent().parent().next().slideToggle('fast');
  },

  'click .report': function(e, t) {
    e.preventDefault();
    $(e.target).siblings('.details').slideToggle();
    var alertId = this._id;

    if (!!alertsRead.indexOf(alertId)) {
      Meteor.call('feedContentResponse', alertId, 'read', function(error, result) {
        console.log(result);

        alertsRead.push(alertId);
      });
    }
  }
});

