Router.route('/', function () {
    this.render('home');
});

Router.route('/company/list', function () {
    this.render('list');
});
