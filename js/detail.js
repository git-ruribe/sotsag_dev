function readdatax() {
  i = 0;
  db.allDocs({
    include_docs: true,
    attachments: true,
    startkey: 'mov',
    endkey: 'mov\ufff0'
    }).then(function (result) {
      result.rows.forEach(element => {
        element.doc.icon = cattoemoji(element.doc.category);
        element.doc.htmlid = "lin" + i;
        element.doc.amount = myformat(element.doc.amount);
        element.doc.buscar = cattoemoji(element.doc.category) + " " + element.doc.timestamp + " " + element.doc.description ;
        i++;
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
      if (items[i].doc.buscar.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
    }
    return found; //return array with mathced indexes
  },
  // List item Template7 template
  itemTemplate:
  '<li>' +
    '<a id="{{doc.htmlid}}" href="javascript:editRecord(\'{{doc.htmlid}}\',\'{{doc._id}}\',\'{{doc._rev}}\',\'{{doc.timestamp}}\',\'{{doc.amount}}\',\'{{doc.description}}\',\'{{doc.category}}\');" class="item-link item-content">' +
        '<div class="item-media" style="font-size: 24px">{{doc.icon}}</div>' +
        '<div class="item-inner">' +
          '<div class="item-header">{{doc.timestamp}}</div>' +
          '<div class="item-title-row">' +
            '$ {{doc.amount}}'+
          '</div>' +
          '<div class="item-footer">✏️ {{doc.description}}</div>' +
        '</div>' +
    '</a>' +
  '</li>',
  // Item height
  height: app.theme === 'ios' ? 70 : 73,
});
});
}

function editRecord(htmlid, id, rev, timestamp, amount, description, category){
  console.log('Click en ' + id);
       // Create dynamic Popover
  var dynamicPopover = app.popover.create({
    targetEl: '#'+htmlid,
    content: 
    '<div id="pop" class="popover">'+
                '<div class="popover-inner">'+
                      '<div class="list no-hairlines-md">'+
                        '<ul>'+
                          '<li class="item-content item-input">'+
                            '<div class="item-inner">'+
                              '<div class="item-input-wrap">'+
                                '<input id="today" type="date" >'+
                              '</div>'+
                            '</div>'+
                          '</li>'+
                          '<li class="item-content item-input">'+
                            '<div class="item-inner">'+
                              '<div class="item-input-wrap">'+
                                '<input id="lana" type="number" placeholder="💰">'+
                              '</div>'+
                            '</div>'+
                          '</li>'+
                          '<li class="item-content item-input">'+
                            '<div class="item-inner">'+
                              '<div class="item-input-wrap">'+
                                '<input id="memo" type="text" placeholder="🔤">'+
                              '</div>'+
                            '</div>'+
                          '</li>'+
                        '</ul'+
                      '/div'+
                    '/div'+
                    '<div class="block">'+
                        '<p class="row inset">'+
                            '<button class="col button button-big color-gray popover-close" style="margin-left: 5px;" onclick="actualiza(\''+id+'\', \''+rev+'\', \''+category+'\', \''+amount+'\')">✅</button>'+
                            '<button class="col button button-big color-gray link popover-close" style="margin-right: 5px;">❌</button>'+
                        '</p>'+
                        '<p class="row inset">'+
                        '<button class="col button button-big color-gray popover-close" style="margin-left: 5px;" onclick="borra(\''+id+'\', \''+rev+'\', \''+category+'\', \''+amount+'\')">🗑️</button>'+                    '</p>'+
                    '</div>'+
                '</div>'+
              '</div>',
    // Events
    on: {
      open: function (popover) {
        console.log('Popover open');
      },
      opened: function (popover) {
        console.log('Popover opened');
      },
    }
  });
  // Events also can be assigned on instance later
  dynamicPopover.on('close', function (popover) {
    console.log('Popover close');
  });
  dynamicPopover.on('closed', function (popover) {
    console.log('Popover closed');
  });
 
  dynamicPopover.open();
  document.querySelector("#today").value= timestamp;
  document.querySelector("#lana").value = amount;
  document.querySelector("#memo").value = description;
}

function actualiza(id, rev, a, lana_ant){
    doc = cuentas;
    doc[a] = doc[a] + Number($$('#lana').val()) - lana_ant;
    doc.total = doc.total + Number($$('#lana').val()) - lana_ant;
    db.put(doc);

    db.get('accounts',function(err, doc) {
      if(err) {
        console.log("Error al grabar movimiento");
       } else {
            cuentas = doc;
            populateAcc();

            mov = {};
            mov._id = id;
            mov._rev = rev;
            mov.timestamp = $$('#today').val();
            mov.description = $$('#memo').val();
            mov.amount = $$('#lana').val();
            mov.category = a;
            db.put(mov).then(function(response) {
              readdatax();
            });
       }
      });
    
    ga('send', 'event', 'Expense', 'Edit', a);
}

function borra(id, rev, a, lana_ant){
  doc = cuentas;
  doc[a] = doc[a] - lana_ant;
  doc.total = doc.total - lana_ant;
  doc.cuantas = doc.cuantas - 1;
  db.put(doc);

  db.get('accounts',function(err, doc) {
    if(err) {
      console.log("Error al grabar movimiento");
     } else {
          cuentas = doc;
          populateAcc();

          mov = {};
          mov._id = id;
          mov._rev = rev;

          app.dialog.confirm( "🗑️  ❓", "⚠️ ⚠️ ⚠️" ,  function(){
            db.remove(mov).then(function(response) {
              readdatax();
            });
          });
        }
    });
  readdatax();
  ga('send', 'event', 'Expense', 'Erase', a);
}