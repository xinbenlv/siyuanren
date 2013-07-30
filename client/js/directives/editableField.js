'use strict';

 var textLink = function(scope, elm, attrs) {

   // view -> model
   var e1 = $('<div contenteditable="true">' + scope.field.fieldValue + '</div>');
   e1.bind('blur', function() {
     scope.$apply(function() {
       scope.field.fieldValue = elm.html();
     });
   });

   // model -> view
   elm.append(e1);

 };

var phoneLink = function(scope, elm, attrs) {
  // TODO(zzn) assert value is phone number
  var phones = scope.field.fieldValue;

  for (var i in phones){
    var phone = phones[i];
    var eCountryCode = $('<span>' + phone.countryCode + '</span>');
    var eNumber = $('<span>' + phone.phoneNumber + '</span>');
    var eNote = $('<span class="label label-info">' + (phone.note || '') + '</span>');
    var d =  $('<div></div>');
    d.append(eCountryCode);
    d.append(eNumber);
    d.append(eNote);

    elm.append(d);
  }

  // model -> view

};

var emailLink = function(scope, elm, attrs) {
  // TODO(zzn) assert value is phone number
  var emails = scope.field.fieldValue;
  console.log(emails);
  for (var i in emails){
    var email = emails[i];
    var eAddress = $('<span>' + email.address + '</span>');
    console.log(email.notes);
    var eNote = $('<span class="label label-info">' + (email.notes || '')  + '</span>');

    var d =  $('<div></div>');

    d.append(eAddress);
    d.append(eNote);

    elm.append(d);
  }

  // model -> view

};

angular.module('angular-client-side-auth')
  .directive('editablefield', function() {
      return {
        restrict: 'E',
        scope: {
          field: '=field'
        },

        link: function(scope, elm, attrs, ctrl) {

          if(scope.field.fieldType == 'string') {
            textLink(scope, elm, attrs, ctrl);
          } else if (scope.field.fieldType == 'phone') {
            phoneLink(scope, elm, attrs, ctrl);
          } else if (scope.field.fieldType == 'email') {
            emailLink(scope, elm, attrs, ctrl);
          }
        }

      };
    });