
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
    }

    res.send(
    	sampleTableData
   	);
};

