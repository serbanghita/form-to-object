(function(){

  'use strict';

  describe('A form with unchecked checkboxes', function(){

    beforeEach(function () {
        var html = '' +
        	'<form id="newForm">' +
            	'<input type="checkbox" name="single" value="Serban">' +
            	'<input type="checkbox" name="many[]" value="First">' + 
            	'<input type="checkbox" name="many[]" value="Second">' +
            	'<input type="checkbox" name="more[first]" value="More First">' +
            	'<input type="checkbox" name="more[second]" value="More Second">' +
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


  describe('A form with various checkboxes', function(){

    beforeEach(function () {
        var html = '' +
        	'<form id="newForm">' +
        		// Should be ignored.
            	'<input type="checkbox" name="single" value="Serban" checked>' +
            	// Not sure why you would ever have a checkbox named like that.
            	'<input type="checkbox" name="many[]" value="First" checked>' + 
            	'<input type="checkbox" name="many[]" value="Second">' +
            	// Creepy example.
            	'<input type="checkbox" name="more[first]" value="More First" checked>' +
            	'<input type="checkbox" name="more[second]" value="More Second First" checked>' +
            	'<input type="checkbox" name="more[second]" value="More Second Second" checked>' +
            	'<input type="checkbox" name="more[second]" value="More Second Third" checked>' +
            	// Checking attribute style.
            	'<input type="checkbox" name="singleSecond" value="Single second" checked="checked">' +
            	// Normal checkbox. One value checked.
            	'<input type="checkbox" name="singleThird" value="First option value">' +
            	'<input type="checkbox" name="singleThird" value="Second option value" checkbox>' +
            	'<input type="checkbox" name="singleThird" value="Third option value">' +
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

})();