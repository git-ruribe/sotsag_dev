var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // Theme
  theme: 'ios',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: routes,
  // ... other parameters
});

var $$ = Dom7;

var mainView = app.views.create('.view-main');

// Utilities
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//Creating the database object
var db = new PouchDB('my_expenses');
var usuario = "";
var cuentas = {};
var presupuesto = {};

/*
//Reading the contents of a Document
db.get('user', function(err, doc) {
   if (err) {
      console.log("Sin usuario");
      //Preparing the document
      doc = {
        _id : 'user',
        data: guid()
        }
      //Inserting Document
      db.put(doc, function(err, response) {
        if (err) {
          return console.log(err);
        } else {
          usuario = doc.data;
          $$('#user').text(usuario);
        }
      });
   } else {
      usuario = doc;
      $$('#user').text(usuario);
   }
});
*/

db.get('accounts',function(err, doc) {
  if(err) {
    my_accounts = {
      _id : 'accounts',
      total : 0,
      cuantas : 0,
      house : 0,
      school : 0,
      car : 0,
      food : 0,
      clothes : 0,
      party : 0,
      tech : 0,
      gifts : 0,
      doctor : 0,
      other :0
    }
    db.put(my_accounts, function(err, response) {
      if (err) {
        return console.log(err);
      } else {
        db.get('accounts',function(err, doc) {
          if(err) {
            console.log("Error al grabar movimiento");
           } else {
                cuentas = doc;
           }
          });
          readbudget()
      }
    });
  } else {
      cuentas = doc;
      readbudget();
  }
});


$$('.panel-left').on('panel:opened', function () {
  fillbudget();
  console.log('Panel left: opened');
});

function myformat(n) {
  temp = Number(n).toFixed(2)
  if (temp * 100 % 100 == 0) {
    temp = Number(n).toFixed(0)
  }
  return temp
}

function cattoemoji(cat) {

  switch(cat) {
    case "house":
    emotics = "🏠";
    break;
    case "school":
    emotics = "🎓";
    break;
    case "car":
    emotics = "🚗";
    break;
    case "food":
    emotics = "😋";
    break;
    case "clothes":
    emotics = "👕";
    break;
    case "party":
    emotics = "🎉";
    break;
    case "tech":
    emotics = "📱";
    break;
    case "gifts":
    emotics = "🎁";
    break;
    case "doctor":
    emotics = "👩‍⚕️";
    break;
    case "other":
    emotics = "🤷";
    break;
  }
  return emotics;
}

function confirmbdgt(cat) {
  app.dialog.confirm( "💲 " + Number($$('#b'+cat).val()),"💰 " + cattoemoji(cat),  function(){
    doc=presupuesto;
    doc._id='budget';
    doc[cat] = Number($$('#b'+cat).val());
    presupuesto[cat] = doc[cat];
    db.put(doc);
    readbudget();
    ga('send', 'event', 'Budget', 'Change', cat);
  }, function(){
    console.log("Regresar valor anterior")
    $$('#b'+cat).val(presupuesto[cat])
  });
}

function fillbudget() {
  budget = presupuesto;
  $$('#bhouse').val(budget.house);
  $$('#bschool').val(budget.school);
  $$('#bcar').val(budget.car);
  $$('#bfood').val(budget.food);
  $$('#bclothes').val(budget.clothes);
  $$('#bparty').val(budget.party);
  $$('#btech').val(budget.tech);
  $$('#bgifts').val(budget.gifts);
  $$('#bdoctor').val(budget.doctor);
  $$('#bother').val(budget.other);
  totalbdgt = budget.house+budget.school+budget.car+budget.food+budget.clothes+budget.party+budget.tech+budget.gifts+budget.doctor+budget.other;
  $$('#blockppto').text(toEmoticon(totalbdgt)+ " 💰");
  $$('#blockexp').text(toEmoticon(cuentas.total)+ " 💸");
  console.log("ppt llenado");
}

function readbudget() {
  db.get('budget',function(err, doc) {
    if(err) {
      my_budget = {
        _id : 'budget',
        total : 0,
        house : 0,
        school : 0,
        car : 0,
        food : 0,
        clothes : 0,
        party : 0,
        tech : 0,
        gifts : 0,
        doctor : 0,
        other :0
      }
      db.put(my_budget, function(err, response) {
        if (err) {
          return console.log(err);
        } else {
          db.get('budget',function(err, doc) {
            if(err) {
              console.log("Error al grabar movimiento");
             } else {
                  presupuesto = doc;
                  populateAcc();
                  fillbudget();
             }
            });
        }
      });
    } else {
        presupuesto = doc;
        populateAcc();
        fillbudget();
    }
  });
};

function calcpct(cat) {
  cuentax = cuentas[cat];
  presupuestox = presupuesto[cat]; 
  pct = {};
  pct.color = "Red";
  pct.back = "Red";
  pct.value = 0;
  if (presupuestox > 0) {
    pct.value = cuentax / presupuestox;
    if (pct.value>1) {
      pct.value = 1;
    } else {
      pct.color = "Green";
      pct.back = "#aaaaaa";
      if (cuentax == 0) {
        pct.back = "Green";
      }
    }
  } else {
    if (cuentax <=0 ) {
      pct.color = "Green";
      pct.back = "#aaaaaa";
    }
  }
  app.gauge.get('#'+cat).update({value:pct.value, borderColor:pct.color, borderBgColor:pct.back, labelText: '$ '+myformat(cuentax).toString() +'/ $ '+myformat(presupuestox).toString() });

}

function populateAcc() {
  $$('#total').text(toEmoticon(cuentas.total));
  $$('#cuantas').text("📝 : " +cuentas.cuantas);
  calcpct('house');
  calcpct('school');
  calcpct('car');
  calcpct('food');
  calcpct('clothes');
  calcpct('party');
  calcpct('tech');
  calcpct('gifts');
  calcpct('doctor');
  calcpct('other');
};

function graba(a){

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  if (a=='money') {
  var lana = toEmoticon($$('#lana').val());
  console.log($$('#pop'));
  $$('#total').text(lana);
  } else {
    doc = cuentas;
    doc[a] = doc[a] + Number($$('#lana').val());
    doc.total = doc.total + Number($$('#lana').val());
    doc.cuantas = doc.cuantas + 1;
    db.put(doc);

    db.get('accounts',function(err, doc) {
      if(err) {
        console.log("Error al grabar movimiento");
       } else {
            cuentas = doc;
            populateAcc();

            mov = {};
            mov._id = "mov_" + $$('#today').val() + " !"+ s4()+s4();
            mov.contador = "mov_" + Number(cuentas.cuantas);
            mov.timestamp = $$('#today').val();
            mov.description = $$('#memo').val();
            mov.amount = $$('#lana').val();
            mov.category = a;
            db.put(mov);
            ga('send', 'event', 'Expense', 'New', a);
       }
      });
  }
}

function toEmoticon(a){
  const temp_num = Math.round(a*100);
  const temp_txt = temp_num.toString();
  var emotics = "";
  if (temp_txt.length==1) {emotics = "0️⃣.0️⃣";}
  if (temp_txt.length==2) {emotics = "0️⃣";}

  for (var i = 0; i < temp_txt.length; i++) {
    if ((temp_txt.length - i) == 2) {
      emotics = emotics + ".";
    }
    if ( (temp_txt.length - i - 2)%3 == 0 && (temp_txt.length - i - 2) >0 && i>0) {
      emotics = emotics + ",";
    }

    switch(temp_txt.charAt(i)) {
      case "0":
      emotics = emotics + "0️⃣";
      break;
      case "1":
      emotics = emotics + "1️⃣";
      break;
      case "2":
      emotics = emotics + "2️⃣";
      break;
      case "3":
      emotics = emotics + "3️⃣";
      break;
      case "4":
      emotics = emotics + "4️⃣";
      break;
      case "5":
      emotics = emotics + "5️⃣";
      break;
      case "6":
      emotics = emotics + "6️⃣";
      break;
      case "7":
      emotics = emotics + "7️⃣";
      break;
      case "8":
      emotics = emotics + "8️⃣";
      break;
      case "9":
      emotics = emotics + "9️⃣";
      break;
    }
  }
  emotics = "💲  "+emotics;
  if (temp_num%100 == 0) {emotics = emotics.substring(0,emotics.length-7)}

  //console.log(emotics);
  return emotics;
}

function doSomething(a){
  console.log('Click en ' + a);
       // Create dynamic Popover
  var dynamicPopover = app.popover.create({
    targetEl: '#'+a,
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
                            '<button class="col button button-big color-gray popover-close" style="margin-left: 5px;" onclick="graba(\''+a+'\')">✅</button>'+
                            '<button class="col button button-big color-gray link popover-close" style="margin-right: 5px;">❌</button>'+
                        '</p>'+
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
  console.log('Ahora a es: ' + a);
  // Events also can be assigned on instance later
  dynamicPopover.on('close', function (popover) {
    console.log('Popover close');
  });
  dynamicPopover.on('closed', function (popover) {
    console.log('Popover closed');
  });
 
  dynamicPopover.open();
  d= new Date()
  document.querySelector("#today").valueAsDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
}

function eraseAccts() {

  app.dialog.confirm( "💸  ↘️    🗄️", "⚠️ ⚠️ ⚠️" ,  function(){
    my_accounts = {
      _id : 'accounts',
      total : 0,
      house : 0,
      school : 0,
      car : 0,
      food : 0,
      clothes : 0,
      party : 0,
      tech : 0,
      gifts : 0,
      doctor : 0,
      other :0
    };
    my_accounts._rev = cuentas._rev;
    db.put(my_accounts);
    db.get('accounts',function(err, doc) {
      if(err) {
        console.log("Error al grabar movimiento");
       } else {
            cuentas = doc;
            populateAcc();
            fillbudget();
            ga('send', 'event', 'Expense', 'Reset');
       }
      });
  }, function(){
    console.log("NO borrar")
  });

  
  

}
