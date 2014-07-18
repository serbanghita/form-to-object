(function(){

	'use strict';

	describe('An empty HTML form', function () {

		it('should return false if the name is empty', function(){
			expect(formToObject()).toBe(false);
		});

	});

	describe('An HTML form with one field', function () {

		beforeEach(function () {
				var html = '<form id="newForm">' +
						'<input type="text" name="name" value="Serban">' +
						'</form>';
				var $newForm = document.createElement('div');
				$newForm.id = 'fixtures';
				$newForm.innerHTML = html;
				document.body.appendChild($newForm);
			});

		afterEach(function () {
			document.body.removeChild(document.getElementById('fixtures'));
		});

		it('searched by a valid element string should return an object', function(){
			expect(formToObject('newForm')).toEqual({'name':'Serban'});
		});

		it('searched by a valid DOM element should return an object', function(){
			expect(formToObject(document.getElementById('newForm')))
						.toEqual({'name':'Serban'});
		});

	});

})();