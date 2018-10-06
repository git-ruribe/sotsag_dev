var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'home',
  },
  {
    path: '/detail/',
    url: './detail.html',
    on: {
      pageBeforeIn: function (event, page) {
        // do something before page gets into the view
        readdatax();
      }
    }
  }
];