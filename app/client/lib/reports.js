Template.reports.helpers({
  alerts: function () {
    return alertsCollection.find({status: 'new'}, {sort: {created: -1}});
  }
});

