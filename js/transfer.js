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
            text = text + element.doc._id.split("!")[1] + "\n";
        });
        document.getElementById("areatxt").value = text;
        document.getElementById("areatxt").style.height= (16*i)+20 + "px";
    });
  }

  function emojitocat(cat) {

    switch(cat) {
      case "🏠":
      emotics = "house";
      break;
      case "🎓school":
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

    newdata.forEach(row => {
        var columna = row.split(",")
        doc.cuantas = doc.cuantas + 1;

        var category = emojitocat(columna[1]);
        var today = columna[2];
        var lana = (Number(columna[3]) || 0);
        var memo = columna[4];

        doc.total = doc.total + (Number(lana) || 0);
        doc[category] = doc[category] + lana;
        
        mov = {};
        mov._id = "mov_" + today + " !"+ s4()+s4();
        // aquí se puede implementar el no duplicar usando el id del movimiento importado
        // idea : cuando hay id : leer bd por mismo id y actualizar en vez de agregar
        mov.contador = "mov_" + doc.cuantas;
        mov.timestamp = today;
        mov.description = memo;
        mov.amount = lana;
        mov.category = category;
        console.log(mov);
        db.put(mov);
        
    })
    ga('send', 'event', 'Expense', 'Import');
  
    db.put(doc);
    populateAcc();

  }