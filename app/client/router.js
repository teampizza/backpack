Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('feed');
});

Router.route('/reports', function () {
  this.render('reports');
});
