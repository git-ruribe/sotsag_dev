function readdatax() {
  db.allDocs({
    include_docs: true,
    attachments: true,
    startkey: 'mov',
    endkey: 'mov\ufff0'
    }).then(function (result) {
      result.rows.forEach(element => {
        element.doc.icon = cattoemoji(element.doc.category)
      });
var virtualList = app.virtualList.create({
  // List Element
  el: '.virtual-list',
  // Pass array with items
  items: result.rows,
  // Custom search function for searchbar
  searchAll: function (query, items) {
    var found = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
    }
    return found; //return array with mathced indexes
  },
  // List item Template7 template
  itemTemplate:
  '<li>' +
  '<a href="#" class="item-link item-content">' +
      '<div class="item-media">{{doc.icon}}</div>' +
      '<div class="item-inner">' +
      '<div class="item-title">' +
        '<div class="item-header">{{doc.timestamp}}</div>' +
        '{{doc.amount}}'+
        '<div class="item-footer">{{doc.description}}</div>' +
      '</div>' +
    '</div>' +
  '</a>' +
'</li>',
  // Item height
  height: app.theme === 'ios' ? 63 : 73,
});
});
}