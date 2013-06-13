(function(exports){

// helper function to get path of a demo image
  var getImagePath = function(relativePath) {
    return '/thirdparty/editablegrid/images/' + relativePath;
  };
  var currentFilter;

  var metadata = [
    { name: 'name', label: 'Name', datatype: 'string', editable: true},
    { name: 'siyuan_year', label: 'Siyuan Year',
      datatype: 'integer', editable: true},
    { name: 'email', label: 'Email', datatype: 'string', editable: true},
    { name: 'mobile_phone', label: 'Mobile Phone',
      datatype: 'string', editable: true},
    { name: 'department', label: 'Dept', datatype: 'string', editable: true},
    { name: 'job_title', label: 'Job Title', datatype: 'string', editable: true},
    { name: 'action', datatype: 'html', editable: false }];

// declaring editableGrid
  var editableGrid;

  exports.onClickDelete = function(rowIndex) {
    console.log('onDelete!');
    if (confirm('Are you sure you want to delete this person ? ')) {

      // Send request
      $.ajax({
        url: '/api/siyuan/delete/' + editableGrid.getRowId(rowIndex),
        type: 'GET',
        async: false,
        success: function(rep) {
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
  exports.onClickCreate = function(rowIndex, values) {
    var values = {name: '无名氏'};

    console.log('onCreate!');
    // Send request
    $.ajax({
      url: '/api/siyuan/post',
      type: 'GET',
      data: {newDoc: values},
      dataType: 'json',
      async: false,
      success: function(doc) {
        console.log('suc!');
        console.dir(doc);
        editableGrid.insert(rowIndex, doc._id, values, true);
      }
    });
  };

  var actionCellRenderer = new CellRenderer({render: function(cell, value) {
    var rowId = editableGrid.getRowId(cell.rowIndex);
    var deleteButton = '<a onclick=peopletable.onClickDelete(' + cell.rowIndex + ') ' +
      'style=\'cursor:pointer\'>' +
      '<i class="icon-remove icon-magenta"/></a>';
    cell.innerHTML = deleteButton;
  }});

  var loadEntireTable = function(tableData) {
    editableGrid.load(tableData);
    editableGrid.setCellRenderer('action', actionCellRenderer);
    editableGrid.renderGrid('tablecontent', 'testgrid');
  };

  var updateCellValue = function(rowIndex, columnIndex, oldValue, newValue, row) {
    var updateValue = {};
    updateValue[editableGrid.getColumnName(columnIndex)] = newValue;
    $.ajax({
      url: '/api/siyuan/put/' + editableGrid.getRowId(rowIndex),
      type: 'GET',
      dataType: 'json',
      data: updateValue,
      success: function(response) {
        // reset old value if failed then highlight row
        var success = (response == 'ok' || !isNaN(parseInt(response)));
        // by default, a successful response can be 'ok' or a database id

        if (!success) editableGrid.setValueAt(rowIndex, columnIndex, oldValue);

      },
      error: function(XMLHttpRequest, textStatus, exception) {
        alert('Ajax failure\n' + errortext);
      },
      async: true
    });
  };

  exports.load = function () {
    editableGrid = new EditableGrid('PeopleTable', {
      enableSort: true,
      modelChanged: updateCellValue
    });

    console.log('set up filter!');

    // Send request
    $.ajax({
      url: '/api/query?collection=SiyuanUserProfile',
      type: 'GET',
      data: null,
      dataType: 'json',
      async: false,
      success: function(rawData) {
        console.log('DBG: rawData: ' + JSON.stringify(rawData));
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
    _$('filter').onkeyup = function() {
      editableGrid.filter(_$('filter').value);
    };

  };
})(typeof exports === 'undefined'? this['peopletable']={}: exports);