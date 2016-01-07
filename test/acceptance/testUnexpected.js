 (function() {

   'use strict';

   /**
    * Unexpected situations tests.
    *
    */
   describe('An HTML form with two duplicate elements', function() {

     beforeEach(function() {
        var html = '<form id="newForm">' +
        '<input type="text" name="firstName" value="Serban">' +
        '<input type="text" name="firstName" value="Ghita">' +
        '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

     afterEach(function() {
      document.body.removeChild(document.getElementById('fixtures'));
    });

     it('should return only one key with the last value', function() {
      expect(formToObject('newForm')).toEqual({ firstName:'Ghita' });
    });

   });

   describe('An HTML form with one input element without name attribute', function() {

     beforeEach(function() {
        var html = '<form id="newForm">' +
        '<input type="text" value="4111111111111111">' +
        '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

     afterEach(function() {
      document.body.removeChild(document.getElementById('fixtures'));
    });

     it('should return an empty object', function() {
      expect(formToObject('newForm')).toBe(false);
    });

   });

   describe('An HTML form that contains one field without name attribute', function() {

     beforeEach(function() {
        var html = '<form id="newForm">' +
        '<input type="text" name="name" value="Serban">' +
        '<input type="text" value="4111111111111111">' +
        '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

     afterEach(function() {
      document.body.removeChild(document.getElementById('fixtures'));
    });

     it('should return the non empty valid keys and values', function() {
      expect(formToObject('newForm')).toEqual({ name:'Serban' });
    });

   });

 })();
