(function(){

  'use strict';

  describe('A form with unchecked radios', function(){

    beforeEach(function () {
        var html = '' +
        	'<form id="newForm">' +
            	'<input type="radio" name="first" value="First value">' +
            	'<input type="radio" name="second" value="First value">' + 
            	'<input type="radio" name="third" value="First value">' +
            	'<input type="radio" name="third" value="Second value">' +
            	'<input type="radio" name="third" value="Third value">' +
            '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

    afterEach(function () {
      document.body.removeChild(document.getElementById('fixtures'));
    });

    it('searched by a valid element string should return false', function(){
      expect(formToObject('newForm')).toBe(false);
    });       

  });


  describe('A form with various radio elements checked', function(){

    beforeEach(function () {
        var html = '' +
        	'<form id="newForm">' +
            	'<input type="radio" name="first" value="First value from first" checked>' +
            	'<input type="radio" name="second" value="First value from second" checked="checked">' + 
            	'<input type="radio" name="third" value="First value">' +
            	'<input type="radio" name="third" value="Second value" checked>' +
            	'<input type="radio" name="third" value="Third value">' +
            	// Numeric values
            	'<input type="radio" name="fourth" value="0" checked>' +
            	'<input type="radio" name="fourth" value="1">' +
            	'<input type="radio" name="fourth" value="2">' +
            '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

    afterEach(function () {
      document.body.removeChild(document.getElementById('fixtures'));
    });

    it('searched by a valid element string should return an object with checked elements', function(){
      expect(formToObject('newForm')).toEqual({
      	'first': 'First value from first',
      	'second': 'First value from second',
      	'third': 'Second value',
      	'fourth': '0'
      });
    });

  });

})(); 