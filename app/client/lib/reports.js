'use strict';

// var dateToday = moment().endOf('day').valueOf();
var oneDayAgo = moment().subtract(1,'days').valueOf();
var oneWeekAgo = moment().subtract(1,'weeks').valueOf();
var oneMonthAgo = moment().subtract(1,'months').valueOf();

Template.reports.helpers({
  alerts: function () {
    return alertsCollection.find();
  },
  today: function() {
    return alertReports(oneDayAgo);
  },
  thisWeek: function() {
    return alertReports(oneWeekAgo);
  },
  thisMonth: function() {
    return alertReports(oneMonthAgo);
  },
  lifetime: function() {
    return alertReports();
  }
});

function alertReports(dateAgo) {
  var alerts;

  if (dateAgo) {
    alerts = alertsCollection.find({created: {$gte: dateAgo}}).fetch();
  } else {
    alerts = alertsCollection.find().fetch();
  }

  var newAlerts = _.filter(alerts, function(alert) {
        return alert.status === 'new';
      }).length;

  var readAlerts = _.filter(alerts, function(alert) {
        return alert.status === 'read';
      }).length;

  var ignoredAlerts = _.filter(alerts, function(alert) {
        return alert.status === 'ignored';
      }).length;

  return {
    'newCount': newAlerts,
    'readCount': readAlerts,
    'ignoredCount': ignoredAlerts
  };
}
