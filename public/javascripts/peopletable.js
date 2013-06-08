/*
 * Client-side logic for PeopleTable
 *
 * Copyright (c) 2013 Zainan Victor Zhou
 * Licensed under the MIT licenses
 */

// helper function to get path of a demo image
var getImagePath = function(relativePath) {
  return "/editablegrid/images/" + relativePath;
}

// declaring editableGrid
var editableGrid;

var actionCellRenderer = new CellRenderer({render: function(cell, value) {
  console.log("render!");
  // this action will remove the row, so first find the ID of the row containing this cell 
  var rowId = editableGrid.getRowId(cell.rowIndex);

  cell.innerHTML = "<a onclick=\"if (confirm('Are you sure you want to delete this person ? ')) { editableGrid.remove(" + cell.rowIndex + "); } \" style=\"cursor:pointer\">" + 
  "<img src=\"" + getImagePath("delete.png") + "\" border=\"0\" alt=\"delete\" title=\"Delete row\"/></a>";
}});

var loadEntireTable = function(tableData) {
  editableGrid.load(tableData);
  editableGrid.setCellRenderer("action", actionCellRenderer);
  editableGrid.renderGrid("tablecontent", "testgrid");
}

var updateCellValue =function(rowIndex, columnIndex, oldValue, newValue, row) {
  $.ajax({
    url: '/api/peopletable',
    type: 'GET',
    dataType: "html",
    data: {
      tablename : editableGrid.name,
      id: editableGrid.getRowId(rowIndex), 
      newvalue: editableGrid.getColumnType(columnIndex) == "boolean" ? (newValue ? 1 : 0) : newValue, 
      colname: editableGrid.getColumnName(columnIndex),
      coltype: editableGrid.getColumnType(columnIndex)      
    },
    success: function (response) { 
      // reset old value if failed then highlight row
      var success = (response == "ok" || !isNaN(parseInt(response))); // by default, a sucessfull reponse can be "ok" or a database id 
      if (!success) editableGrid.setValueAt(rowIndex, columnIndex, oldValue);

    },
    error: function(XMLHttpRequest, textStatus, exception) { alert("Ajax failure\n" + errortext); },
    async: true
  });
};

$(document).ready(function() {
  editableGrid = new EditableGrid( "PeopleTable", {
    enableSort: true,
    modelChanged: updateCellValue });

  // Send request
  $.ajax({
    url: "/api/peopletable",
    type: "GET",
    data: null,
    dataType: 'json',
    async: false,
    success: function(tableData) {
      loadEntireTable(tableData);
    }
  });

});