/*
 * Client-side logic for PeopleTable
 *
 * Copyright (c) 2013 Zainan Victor Zhou
 * Licensed under the MIT licenses
 */

// helper function to get path of a demo image
var getImagePath = function(relativePath) {
  return '/editablegrid/images/' + relativePath;
};

// declaring editableGrid
var editableGrid;

var onClickDelete = function(rowIndex) {
  console.log('onDelete!');
  if (confirm('Are you sure you want to delete this person ? ')) {

    // Send request
    $.ajax({
      url: '/api/peopletable',
      type: 'GET',
      data: {'action': 'delete', values: {
        id: editableGrid.getRowId(rowIndex)
      }},
      dataType: 'json',
      async: false,
      success: function(tableData) {
        loadEntireTable(tableData);
      }
    });
  }
};

/**
 *
 * @param {Integer} rowIndex integer representing which place to insert.
 * @param {Object} values object representing the value to create.
 */
var onClickCreate = function(rowIndex, values) {
  var values;

  console.log('onCreate!');
    // Send request
    $.ajax({
      url: '/api/peopletable',
      type: 'GET',
      data: {
        'action': 'create',
        id: editableGrid.getRowId(rowIndex)
      },
      dataType: 'json',
      async: false,
      success: function(tableData) {
        loadEntireTable(tableData);
      }
    });
};

var actionCellRenderer = new CellRenderer({render: function(cell, value) {
  var rowId = editableGrid.getRowId(cell.rowIndex);
  var deleteButton = '<a onclick=onClickDelete(' + cell.rowIndex + ') ' +
    'style=\'cursor:pointer\'>' +
    '<img src=\'' + getImagePath('delete.png') +
    '\' border=\'0\' alt=\'delete\' title=\'Delete row\'/></a>';
  var createButton = '<a onclick=onClickCreate(' + cell.rowIndex + ') ' +
    'style=\'cursor:pointer\'>&nbsp;+</a>';
  cell.innerHTML = deleteButton + createButton;
}});

var loadEntireTable = function(tableData) {
  editableGrid.load(tableData);
  editableGrid.setCellRenderer('action', actionCellRenderer);
  editableGrid.renderGrid('tablecontent', 'testgrid');
};

var updateCellValue = function(rowIndex, columnIndex, oldValue, newValue, row) {
  $.ajax({
    url: '/api/peopletable',
    type: 'GET',
    dataType: 'html',
    data: { 'action': 'update', values: {
      tablename: editableGrid.name,
      id: editableGrid.getRowId(rowIndex),
      newvalue: editableGrid.getColumnType(columnIndex) ==
        'boolean' ? (newValue ? 1 : 0) : newValue,
      colname: editableGrid.getColumnName(columnIndex),
      coltype: editableGrid.getColumnType(columnIndex)
    }},
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

$(document).ready(function() {
  editableGrid = new EditableGrid('PeopleTable', {
    enableSort: true,
    modelChanged: updateCellValue });

  // Send request
  $.ajax({
    url: '/api/peopletable',
    type: 'GET',
    data: {action: 'load', 'values': {}},
    dataType: 'json',
    async: false,
    success: function(tableData) {
      console.log('DBG: tableData: ' + JSON.stringify(tableData));
      loadEntireTable(tableData);
    }
  });
});
