(function (exports) {

  var getImagePath = function (relativePath) {
    return '/thirdparty/editablegrid/images/' + relativePath;
  };

  var fields = [];

  var metadata;

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

 //XXXXXXXXXXXXXXXXXXXXX

  var renderEmailCell = function(element, value) {
    var emails = value;

    var html = document.createElement('div');

    var createEmailDiv = document.createElement('div');
    createEmailDiv.classList.add('email-item');

    var createText = document.createElement('div');
    createText.classList.add('email');
    createText.textContent = '添加Email地址';
    var createIcon = document.createElement('i');
    createIcon.classList.add('email-create');
    createIcon.classList.add('icon-plus');
    createIcon.dataset.row = element.rowIndex;
    createIcon.dataset.col = element.columnIndex;
    createIcon.addEventListener('click', function() {

      var oldValue = editableGrid.getValueAt(this.dataset.row, this.dataset.col);
      var newValue = [];
      for(var t = 0; t < oldValue.length; t++) {
        newValue.push(oldValue[t]);
      }
      var rawEmail = 'xxx';
      while(rawEmail == 'xxx' || rawEmail == '') {

        console.log(rawEmail);
        rawEmail = prompt('请输入一个新的Email地址' ,'');
      }
      if(rawEmail != '' && rawEmail.length > 0) {
        var t = {};
        t.address = rawEmail;

        newValue.push(t);
        editableGrid.setValueAt(this.dataset.row, this.dataset.col, newValue);
        updateCellValue(this.dataset.row, this.dataset.col, oldValue, newValue);
      }
    });
    createEmailDiv.appendChild(createIcon);
    createEmailDiv.appendChild(createText);

    html.appendChild(createEmailDiv);

    if(emails instanceof Array) {

      for(var i in emails) {

        var email = emails[i];
        if(!email || email.length == 0) continue;

        var emailDiv = document.createElement('div');
        emailDiv.classList.add('email');
        emailDiv.textContent =  email.address;

        var removeIcon = document.createElement('i');
        removeIcon.classList.add('email-remove');
        removeIcon.classList.add('icon-remove');
        removeIcon.dataset.row = element.rowIndex;
        removeIcon.dataset.col = element.columnIndex;
        removeIcon.dataset.i = i;
        removeIcon.addEventListener('click', function() {

          var oldValue = editableGrid.getValueAt(this.dataset.row, this.dataset.col);
          var newValue = [];
          for(var t = 0; t < oldValue.length; t++) {
            if (t != removeIcon.dataset.i){
              newValue.push(oldValue[t]);
            }
          }
          editableGrid.setValueAt(this.dataset.row, this.dataset.col, newValue);
          updateCellValue(this.dataset.row, this.dataset.col, oldValue, newValue);
        });

        var emailItemDiv = document.createElement('div');
        emailItemDiv.classList.add('email-item');

        emailItemDiv.appendChild(removeIcon);
        emailItemDiv.appendChild(emailDiv);
        html.appendChild(emailItemDiv);
      }
    }
    return html;
  } ;

  var emailCellRenderer = new CellRenderer({render: function (element, value) {
    var cellElement = renderEmailCell(element, value);
    element.appendChild(cellElement);
  }});

  var renderPhoneNumberCell = function(element, value) {
    var phones = value;

    var html = document.createElement('div');
    var countryAbbr = {
      '1': 'us',
      '18': 'us',
      '41': 'ch',
      '44': 'gb',
      '81': 'jp',
      '852': 'hk',
      '853': 'mo',
      '886': 'tw',
      '86': 'cn'
    };
    var createPhoneNumberDiv = document.createElement('div');
    createPhoneNumberDiv.classList.add('phone-number-item');


    var createText = document.createElement('div');
    createText.classList.add('phone-number');
    createText.textContent = '添加电话号码';
    var createIcon = document.createElement('i');
    createIcon.classList.add('phone-number-create');
    createIcon.classList.add('icon-plus');
    createIcon.dataset.row = element.rowIndex;
    createIcon.dataset.col = element.columnIndex;
    createIcon.addEventListener('click', function() {

      var oldValue = editableGrid.getValueAt(this.dataset.row, this.dataset.col);
      var newValue = [];
      for(var t = 0; t < oldValue.length; t++) {
        newValue.push(oldValue[t]);
      }
      var rawPhone = 'xxx';
      while(rawPhone != "" && !rawPhone.match(/\(\+\d+\)\d+/)) {
        rawPhone = prompt("请输入一个新的电话号码，格式 \"(+区号)号码\" 例如：(+86)13812345678","");
      }
      if(rawPhone != "" && rawPhone.length > 0) {
        var ph = rawPhone;
        console.log(ph);
        var countryCodeMatcher = /(?:\(\+)(\d+)(?:\))/;
        var phoneNumberMatcher = /([\d\-\s]{7,15})/;
        var notesMatcher = /(?:\[)(.*)(?:\])/;

        var countryCode = ph.match(countryCodeMatcher) && ph.match(countryCodeMatcher)[1];
        var phone =  ph.match(phoneNumberMatcher)[1].replace(/\-/g,'').replace(/ /g,'');
        var notes = ph.match(notesMatcher) && ph.match(notesMatcher)[1];
        var t = {};
        t.countryCode = countryCode;
        t.phoneNumber = phone;
        t.notes = notes || '';

        newValue.push(t);
        editableGrid.setValueAt(this.dataset.row, this.dataset.col, newValue);
        updateCellValue(this.dataset.row, this.dataset.col, oldValue, newValue);
      }
    });

    createPhoneNumberDiv.appendChild(createIcon);
    createPhoneNumberDiv.appendChild(createText);
    html.appendChild(createPhoneNumberDiv);

    if(phones instanceof Array) {

      for(var i in phones) {

        var phone = phones[i];
        if(!phone || phone.length == 0) continue;

        var countryCodeDiv = document.createElement('div');
        countryCodeDiv.classList.add('country-code');
        var countryCodeDivInnerImg = document.createElement('img');
        countryCodeDivInnerImg.alt = '+(' + phone.countryCode + ')';
        var countryCodeStr = countryAbbr[phone.countryCode.toString()] || phone.countryCode.toString();
        countryCodeDivInnerImg.src = '/thirdparty/nationalflags/gosquared/flags-iso/shiny/16/'
          + countryCodeStr.toUpperCase() + '.png';
        countryCodeDiv.appendChild(countryCodeDivInnerImg);

        var phoneNumberDiv = document.createElement('div');
        phoneNumberDiv.classList.add('phone-number');
        phoneNumberDiv.textContent =  phone.phoneNumber;

        var removeIcon = document.createElement('i');
        removeIcon.classList.add('phone-number-remove');
        removeIcon.classList.add('icon-remove');
        removeIcon.dataset.row = element.rowIndex;
        removeIcon.dataset.col = element.columnIndex;
        removeIcon.dataset.i = i;
        removeIcon.addEventListener('click', function() {

          var oldValue = editableGrid.getValueAt(this.dataset.row, this.dataset.col);
          var newValue = [];
          for(var t = 0; t < oldValue.length; t++) {
            if (t != removeIcon.dataset.i){
              newValue.push(oldValue[t]);
            }
          }
          editableGrid.setValueAt(this.dataset.row, this.dataset.col, newValue);
          updateCellValue(this.dataset.row, this.dataset.col, oldValue, newValue);
        });

        var phoneNumberItemDiv = document.createElement('div');
        phoneNumberItemDiv.classList.add('phone-number-item');

        phoneNumberItemDiv.appendChild(removeIcon);
        phoneNumberItemDiv.appendChild(countryCodeDiv);
        phoneNumberItemDiv.appendChild(phoneNumberDiv);
        html.appendChild(phoneNumberItemDiv);
      }
    }
    return html;
  } ;

  var phoneNumberCellRenderer = new CellRenderer({render: function (element, value) {
    var cellElement = renderPhoneNumberCell(element, value);
    element.appendChild(cellElement);
  }});

  var loadEntireTable = function (tableData, fields) {
    editableGrid.load(tableData);

    if(fields.indexOf('action') >= 0) editableGrid.setCellRenderer('action', actionCellRenderer);
    if(fields.indexOf('auth') >= 0) editableGrid.setCellRenderer('auth', snsCellRenderer);
    _(fields).each(function(field){
      if(field.text == '电话号码'){
        editableGrid.setCellRenderer('电话号码', phoneNumberCellRenderer);
      }
    });
    _(fields).each(function(field){
      if(field.text == 'Email地址'){
        editableGrid.setCellRenderer('Email地址', emailCellRenderer);
      }
    });
    editableGrid.renderGrid('tablecontent', 'table table-bordered table-striped table-hover', 'testgrid');
    editableGrid.updatePaginator();

  };

  var updateCellValue = function (rowIndex, columnIndex, oldValue, newValue) {
    var updateValue = {};

    updateValue[editableGrid.getColumnName(columnIndex)] = newValue;
    console.log(updateValue);
    $.ajax({
      url: '/api/siyuan/put/' + editableGrid.getRowId(rowIndex),
      type: 'GET',
      dataType: 'json',
      data: updateValue,
      success: function (response) {
        // reset old value if failed then highlight row
        var success = response['result'];
        // by default, a successful response can be 'ok' or a database id

        if (!success) editableGrid.setValueAt(rowIndex, columnIndex, oldValue);

      },
      error: function (XMLHttpRequest, textStatus, exception) {
        alert('Ajax failure:' + exception + ', textStatus:' + textStatus);
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

  exports.load = function (criteria, additionalFields, cb) {
    editableGrid = new EditableGrid('PeopleTable', {
      enableSort: true,
      doubleclick: true,
      editmode: 'static',
      modelChanged: updateCellValue,
      pageSize: 40
    });
    metadata = [];
    var allFields = fields.concat(additionalFields);
    for(var i in allFields) {
      metadata.push({
        name: allFields[i].text,
        label: allFields[i].text,
        datatype: ['auth', '电话号码', 'Email地址'].indexOf(allFields[i].text) >= 0 ? 'html' : 'string',
        editable: !(['auth', '电话号码', 'Email地址'].indexOf(allFields[i].text) >= 0)
      });
    }
    console.log(metadata);
    var baseUrl =  '/api/query?';
    var collectionUrl = 'collection="SiyuanUserProfile"';
    var criteriaUrl = 'criteria=' + JSON.stringify(criteria);

    var fieldsUrl = 'fields=' + JSON.stringify(fields);
    /*var fieldsUrl = 'fields="';
    for(var i in allFields){
      fieldsUrl += allFields[i].text +' ';
    }
    fieldsUrl += '"';*/


    var url = baseUrl + '&' + collectionUrl + '&' + criteriaUrl + '&' + fieldsUrl;
    // Send request
    $.ajax({
      url: url,
      type: 'GET',
      data: null,
      dataType: 'json',
      async: true,
      success: function (rawData) {
        var tableData = {};
        tableData.metadata = metadata;
        var data = [];
        for (i in rawData) {
          data.push({id: rawData[i]._id, values: rawData[i]});
        }
        tableData.data = data;
        loadEntireTable(tableData, allFields);
        return cb();
      }
    });
    // filter when something is typed into filter
    _$('filter').onkeyup = function () {
      editableGrid.filter(_$('filter').value);
    };
  };
})(typeof exports === 'undefined' ? this['peopletable'] = {} : exports);