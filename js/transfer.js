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
            text = text + element.doc.description + "\n";
        });
        document.getElementById("areatxt").value = text;
        document.getElementById("areatxt").style.height= (16*i)+20 + "px";
    });
  }