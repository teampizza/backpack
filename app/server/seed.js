// Seeds for alerts
// We need to make a factory for fake alerts

// Alerts have:
// - a name
// - a source URL
// - a status
// - a description w/ advice link

Meteor.startup(function() {
  Factory.define('alert', AlertsCollection, {
    name: function() {
      return Fake.word();
    },
    url: function() {
      return 'http://www.' + Fake.word() + Fake.word() + '.com/';
    },
    status: 'new',
    description: function() {
      return Fake.paragraph();
    },
    created: function() {
      return Date.now();
    }
  });

  // Remove all alerts before seeding
  AlertsCollection.remove({});

  // Generate 10 random alerts
  _(10).times(function(n) {
    Meteor.setTimeout(function() {
      Factory.create('alert');
    }, n * 5000);
  });

});

