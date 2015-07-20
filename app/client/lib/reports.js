'use strict';

var dateToday = moment().valueOf();
var oneDayAgo = moment().subtract(1,'days').valueOf();

Template.reports.helpers({
  alerts: function () {
    return alertsCollection.find();
  },
  today: function() {
    var alerts = alertsCollection.find({created: {$gte: oneDayAgo, $lt: dateToday}}).fetch();
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
      'todayNewCount': newAlerts,
      'todayReadCount': readAlerts,
      'todayIgnoredCount': ignoredAlerts
    };
  }
});

