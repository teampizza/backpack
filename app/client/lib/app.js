Template.feed.helpers({
  alerts: function () {
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

  'click .report': function(e, t) {
    e.preventDefault();
    $(e.target).siblings('.details').slideToggle();
  }
});
