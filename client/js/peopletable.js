(function (exports) {

// helper function to get path of a demo image
  var getImagePath = function (relativePath) {
    return '/thirdparty/editablegrid/images/' + relativePath;
  };
  var currentFilter;

  var metadata = [
    { name: '姓名', label: '姓名', datatype: 'string', editable: true},
    { name: '思源学员期数', label: '思源学员期数',
      datatype: 'string', editable: true},
    { name: '常用邮箱', label: '常用邮箱', datatype: 'string', editable: true},
    { name: '国内手机', label: '国内手机',
      datatype: 'string', editable: true},
    { name: '所在院系', label: '所在院系', datatype: 'string', editable: true},
    { name: '目前职位', label: '目前职位', datatype: 'string', editable: true},
    { name: 'auth', label:'社交网站账户', datatype: 'html', editable: false },
    { name: 'action', datatype: 'html', editable: false }
  ];

// declaring editableGrid
  var editableGrid;

  exports.onClickDelete = function (rowIndex) {
    if (confirm('Are you sure you want to delete this person ? ')) {

      // Send request
      $.ajax({
        url: '/api/siyuan/delete/' + editableGrid.getRowId(rowIndex),
        type: 'GET',
        async: false,
        success: function (rep) {
          console.log('removed! rowIndex = ' + rowIndex);
          editableGrid.remove(rowIndex);
        }
      });
    }
  };

  /**
   *
   * @param {Integer} rowIndex integer representing which place to insert.
   * @param {Object} values object representing the value to create.
   */
  exports.onClickCreate = function (rowIndex, values) {
    var values = {'姓名': '无名氏'};
    // Send request
    $.ajax({
      url: '/api/siyuan/post',
      type: 'GET',
      data: {newDoc: values},
      dataType: 'json',
      async: false,
      success: function (doc) {
        console.log('suc!');
        console.dir(doc);
        editableGrid.insert(rowIndex, doc._id, values, true);
      }
    });
  };

  var actionCellRenderer = new CellRenderer({render: function (cell, value) {
    var rowId = editableGrid.getRowId(cell.rowIndex);
    var deleteButton = '<a onclick=peopletable.onClickDelete(' + cell.rowIndex + ') ' +
      'style=\'cursor:pointer\'>' +
      '<i class="icon-remove icon-magenta"/></a>';
    cell.innerHTML = deleteButton;
  }});

  var snsCellRenderer = new CellRenderer({render: function (cell, value) {
    var html = '';

    if(value instanceof Array) {
      for(var i in value) {
        var authMethod = value[i];
        var provider = authMethod.provider;
        var url = authMethod.url;
        html += '<a href="#"><i class="icon-' + provider + '">' + '</i></a>';
      }
    }
    cell.innerHTML = html;
  }});

  var loadEntireTable = function (tableData) {
    editableGrid.load(tableData);

    editableGrid.setCellRenderer('action', actionCellRenderer);
    editableGrid.setCellRenderer('auth', snsCellRenderer);

    editableGrid.renderGrid('tablecontent', 'table table-bordered table-striped table-hover', 'testgrid');
    editableGrid.updatePaginator();

  };

  var updateCellValue = function (rowIndex, columnIndex, oldValue, newValue, row) {
    var updateValue = {};
    updateValue[editableGrid.getColumnName(columnIndex)] = newValue;
    $.ajax({
      url: '/api/siyuan/put/' + editableGrid.getRowId(rowIndex),
      type: 'GET',
      dataType: 'json',
      data: updateValue,
      success: function (response) {
        // reset old value if failed then highlight row
        var success = (response == 'ok' || !isNaN(parseInt(response)));
        // by default, a successful response can be 'ok' or a database id

        if (!success) editableGrid.setValueAt(rowIndex, columnIndex, oldValue);

      },
      error: function (XMLHttpRequest, textStatus, exception) {
        alert('Ajax failure\n' + errortext);
      },
      async: true
    });
  };

  EditableGrid.prototype.tableRendered = function () {
    this.updatePaginator();
  };

  EditableGrid.prototype.updatePaginator = function () {
    var paginator = $("#paginator").empty();

    // get interval
    var interval = this.getSlidingPageInterval(20);
    if (interval == null) return;

    // get pages in interval (with links except for the current page)
    var pages = this.getPagesInInterval(interval, function (pageIndex, isCurrent) {
      if (isCurrent) return "" + (pageIndex + 1);
      return $("<a>").css("cursor", "pointer").html(pageIndex + 1).click(function (event) {
        editableGrid.setPageIndex(parseInt($(this).html()) - 1);
      });
    });

    var link;

    // "prev" link
    link = $("<a>").html("<i class='icon-arrow-left' />");
    if (!this.canGoBack()) link.css({ opacity: 0.4, filter: "alpha(opacity=40)" });
    else link.css("cursor", "pointer").click(function () {
      editableGrid.prevPage();
    });
    paginator.append(link);

    // pages
    for (p = 0; p < pages.length; p++) paginator.append(pages[p]).append(" | ");

    // "next" link
    link = $("<a>").html("<i class='icon-arrow-right' />");
    if (!this.canGoForward()) link.css({ opacity: 0.4, filter: "alpha(opacity=40)" });
    else link.css("cursor", "pointer").click(function () {
      editableGrid.nextPage();
    });
    paginator.append(link);

  };

  exports.load = function () {
    editableGrid = new EditableGrid('PeopleTable', {
      enableSort: true,
      doubleclick: true,
      editmode: 'static',
      modelChanged: updateCellValue,
      pageSize: 16
    });

    // Send request
    $.ajax({
      url: '/api/query?collection=SiyuanUserProfile',
      type: 'GET',
      data: null,
      dataType: 'json',
      async: false,
      success: function (rawData) {
        var tableData = {};
        tableData.metadata = metadata;
        var data = [];
        for (i in rawData) {
          data.push({id: rawData[i]._id, values: rawData[i]});
        }
        tableData.data = data;

        loadEntireTable(tableData);
      }
    });

    // filter when something is typed into filter
    _$('filter').onkeyup = function () {
      editableGrid.filter(_$('filter').value);
    };

  };
})(typeof exports === 'undefined' ? this['peopletable'] = {} : exports);