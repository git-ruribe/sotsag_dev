function exporta() {
    i = 0;
    db.allDocs({
      include_docs: true,
      attachments: true,
      startkey: 'mov',
      endkey: 'mov\ufff0'
      }).then(function (result) {
          text = "";
        result.rows.forEach(element => {
            i++;
            text = text + i + ",";
            text = text + cattoemoji(element.doc.category) + ",";
            text = text + element.doc.timestamp + ",";
            text = text + element.doc.amount + ",";
            text = text + element.doc.description + ",";
            text = text + element.doc._id.split("!")[1];
            if (i < result.rows.length) {
              text = text + "\n";
            }
        });
        document.getElementById("areatxt").value = text;
        document.getElementById("areatxt").style.height= (18*i)+20 + "px";
    });
  }

  function emojitocat(cat) {

    switch(cat) {
      case "🏠":
      emotics = "house";
      break;
      case "🎓":
      emotics = "school";
      break;
      case "🚗":
      emotics = "car";
      break;
      case "😋":
      emotics = "food";
      break;
      case "👕":
      emotics = "clothes";
      break;
      case "🎉":
      emotics = "party";
      break;
      case "📱":
      emotics = "tech";
      break;
      case "🎁":
      emotics = "gifts";
      break;
      case "👩‍⚕️":
      emotics = "doctor";
      break;
      case "🤷":
      emotics = "other";
      default:
      emotics = "other";
      break;
    }
    return emotics;
  }

  function importa() {
    
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }

    newdata= document.getElementById("areatxt").value.split("\n");

    doc = cuentas;
    var i = 0;
    var ok = 0;

    newdata.forEach(row => {
        var columna = row.split(",")

        var category = emojitocat(columna[1]);
        var today = columna[2];
        var lana = (Number(columna[3]) || 0);
        var memo = columna[4];
        
        
        mov = {};
        var key = s4()+s4();
        if (typeof(columna[5])!="undefined") {
          if (columna[5]!="") {
            key = columna[5];
          }
        }
        mov._id = "mov_" + today + " !"+ key;
        // aquí se puede implementar el no duplicar usando el id del movimiento importado
        // idea : cuando hay id : leer bd por mismo id y actualizar en vez de agregar
        mov.contador = "mov_" + doc.cuantas;
        mov.timestamp = today;
        mov.description = memo;
        mov.amount = lana;
        mov.category = category;
        console.log(mov);
        db.put(mov, function(err,respuesta) {
          i++
          if (err) {
            return console.log(err);
          } else {
            ok++
            doc.total = doc.total + (Number(lana) || 0);
            doc[category] = doc[category] + lana;
            doc.cuantas = doc.cuantas + 1;
          }
          console.log(i);
          if (i == newdata.length) {
            db.put(doc, function(err,response) {
              db.get('accounts',function(err, doc) {
                if(err) {
                  console.log("Error al grabar movimiento");
                 } else {
                      cuentas = doc;
                      populateAcc();
                      app.dialog.alert('✍️ : ' + ok,'📲', function() {
                      app.router.back('/',{animate: true});
                      });
                 }
                });
            });
          }
        });
        
    })
    ga('send', 'event', 'Expense', 'Import');
  }

function gotodetail() {
  app.router.navigate("/detail/");
}