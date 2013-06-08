

exports.query = function (req, res) {
    req.accepts(['html', 'json']);
    console.log(req);
    
    sampleTableData =  {
      "headers":["name","year","dept","job","residency city"],
      "rows": [
        ["刘备","158","卖草鞋系","蜀汉 皇帝","Zhuzhou, Hebei, China"],
        ["关羽","160","卖大枣系","蜀汉 寿亭侯","Yuncheng, Shanxi, China"],
        ["张飞","163","卖肉系","蜀汉 车骑将军","Zhuzhou, Hebei, China"]
      ]
    };

    sampleTableData["metadata"] = metadata;
    sampleTableData["data"] = data;


    res.send(
    	sampleTableData
   	);
};


var log = console.log;

var loadData = function() {
  var metadata = [
    { name: "name", label: "NAME", datatype: "string", editable: true},
    { name: "year", label: "YEAR", datatype: "integer", editable: true},
    { name: "dept", label: "DEPT", datatype: "string", editable: true},
    { name: "job", label: "JOB", datatype: "string", editable: true},
    { name: "residency city", label: "RESIDENCY CITY", datatype: "string", editable: true},
    { name: "action",datatype: "html",editable: false }
  ];

  var data = [
    { id: 1, values: {name: "刘备", year: "158", /*dept: "卖草鞋系",*/ job: "蜀汉 皇帝", "residency city": "Zhuzhou, Hebei, China" /*, action:"1"*/} },
    { id: 2, values: {name: "关羽", year: "160", dept: "卖大枣系", job: "蜀汉 寿亭侯", "residency city": "Yuncheng, Shanxi, China"/*, action:"1"*/}},
    { id: 3, values: {name: "张飞", year: "163", dept: "卖肉系", job: "蜀汉 车骑将军", "residency city": "Zhuzhou, Hebei, China"/*, action:"1"*/}}
  ];

  tableData = {};
  tableData["metadata"] = metadata;
  tableData["data"] = data;
  return tableData;
}

exports.peopletable = function (req, res) {
  req.accepts(['html', 'json']);
  if("query" in req && "tablename" in req.query) {
    log(req.query);
    res.send("ok");
  } else {
    res.send(
      loadData()
    );
  }
};



