      console.log("sdf");
    var createTable = function (tableData) {
      console.log(tableData);
      var doc = document;
      var table = doc.createElement("table");
      table.id="resultTable";
      table.classList.add("sortable");
      table.classList.add("table");
      table.classList.add("table-bordered");
      table.classList.add("table-hover");
      table.classList.add("table-striped");
      var thead = doc.createElement("thead");
      var tr = doc.createElement("tr");
      for (i in tableData["headers"]) { //array
        var header = tableData["headers"][i];
        var th = doc.createElement("th");
        th.appendChild(doc.createTextNode(header))
        tr.appendChild(th)
      }
      thead.appendChild(tr);
      table.appendChild(thead)
      var tbody = doc.createElement("tbody");
      for (i in tableData["rows"]) { // array
        var tr = doc.createElement("tr");
        var row = tableData["rows"][i]
        for (j in row) { // array
          var col = row[j]
          var td = doc.createElement("td");
          td.appendChild(doc.createTextNode(col));
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      var element = document.getElementById("result");
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(table);
     
      markers = [];
      for (i in tableData["rows"]) {
        markers.push({
          address: tableData["rows"][i][4],
          html: tableData["rows"][i][0],
          popup: false
        });
      }
      $('#googleMap').gMap({
        address: "Beijing, China",
        zoom: 2,
        "markers": markers,
        controls: {
          panControl: false,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          overviewMapControl: false
        }
      });
      console.log(markers);
    }

    var sampleTable = {
      "headers":["name","year","dept","job","residency city"],
      "rows": [
        ["刘备","158","卖草鞋系","蜀汉 CEO 董事长","Zhuzhou, Hebei, China"],
        ["关羽","160","卖大枣系","蜀汉 寿亭侯","Yuncheng, Shanxi, China"],
        ["张飞","163","卖肉系","蜀汉 车骑将军","Zhuzhou, Hebei, China"],
        ["曹操","155","无业系","曹魏 CEO 董事长","Haozhou, Anhui, China"],
        ["孙权","182","贵族系","东吴 CEO 董事长","Fuyang, Zhejiang, China"],
      ]
    }
    
    $('#queryBtn').click(function (e) {
      queryData = $("form#queryBox").serializeObject();
      console.log(queryData);
      // Ajax Query send to the back end
      
      $.ajax({
        url: "/api/query",
        type: "POST",
        data: queryData,
        dataType: 'json',
        async: false,
        success: function(tableData) {
            createTable(tableData);
        }
      });
    });
      
    $(document).ready(function() {
      createTable(sampleTable);
    });