'use strict';

var dateToday = moment().valueOf();
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
  }
});

function alertReports(dateAgo) {
  var alerts = alertsCollection.find({created: {$gte: dateAgo, $lt: dateToday}}).fetch();

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
