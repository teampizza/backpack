'use strict';

Template.feed.helpers({
  alerts: function() {
    return alertsCollection.find({status: 'new'}, {sort: {created: -1}});
  }
});

Template.hello.helpers({
  status: function() {
    if (this.status === 'read') {
      return 'green';
    } else {
      return 'red';
    }
  }
});

var alertsRead = [];

Template.hello.events({
  'click #button .checkmark': function(e) {
    e.preventDefault();
    var $this = $(e.target);
    var reponse = 'read';

    Meteor.call('feedContentResponse', this._id, reponse);
  },

  'click #button .xmark': function(e) {
    e.preventDefault();
    var $this = $(e.target);

    $this.parent().parent().next().slideToggle('fast');
  },

  'click .report': function(e) {
    e.preventDefault();
    $(e.target).siblings('.details').slideToggle();
    var $this = $(e.target);
    var alertId = this._id;

    if (!!alertsRead.indexOf(alertId)) {
      Meteor.call('feedContentResponse', alertId, 'read', function(error, result) {
        alertsRead.push(alertId);
      });
    }
  }
});

