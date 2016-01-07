(function(){

  'use strict';

  /**
   * Select elements test.
   */
  describe('An HTML form with a select element and one valid selected option', function(){

    beforeEach(function () {
        var html = '<form id="newForm">' +
            '<select name="country">' +
            '<option value="RO">Romania</option>' +
            '<option value="MC" selected>Monaco</option>' +
            '<option value="US">United States of America</option>' +
            '</select>' +
            '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

    afterEach(function () {
      document.body.removeChild(document.getElementById('fixtures'));
    });

    it('should return an object', function(){
      expect(formToObject('newForm')).toEqual({'country':'MC'});
    });

  });

  describe('An HTML form with a select element and no selected options', function(){

    beforeEach(function () {
        var html = '<form id="newForm">' +
            '<select name="country">' +
              '<option value="RO">Romania</option>' +
              '<option value="MC">Monaco</option>' +
              '<option value="US">United States of America</option>' +
            '</select>' +
            '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

    afterEach(function () {
      document.body.removeChild(document.getElementById('fixtures'));
    });

    it('should return the first option value', function(){
      expect(formToObject('newForm')).toEqual({'country':'RO'});
    });

  });

  describe('An HTML form with a select element and no selected options', function(){

    beforeEach(function () {
        var html = '<form id="newForm">' +
            '<select name="country">' +
            '<option value="">--select--</option>' +
            '<option value="RO">Romania</option>' +
            '<option value="MC">Monaco</option>' +
            '<option value="US">United States of America</option>' +
            '</select>' +
            '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

    afterEach(function () {
      document.body.removeChild(document.getElementById('fixtures'));
    });

    it('should return false if the first option is empty', function(){
      expect(formToObject('newForm')).toBe(false);
    });

    it('should return the first option if empty values option is set to true', function(){
      expect(formToObject('newForm', {includeEmptyValuedElements: true})).toEqual({'country':''});
    });

  });

  describe('An HTML form with a multiple select element', function(){

    beforeEach(function () {
        var html = '<form id="newForm">' +
            '<select name="countries" id="countries" multiple>' +
            '<option value="">--select--</option>' +
            '<option value="RO">Romania</option>' +
            '<option value="MC">Monaco</option>' +
            '<option value="US">United States of America</option>' +
            '</select>' +
            '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

    afterEach(function () {
      document.body.removeChild(document.getElementById('fixtures'));
    });

     it('should return false when no options are selected', function(){
      expect(formToObject('newForm')).toBe(false);
    });   

    it('should return an empty array when no options are selected and include empty values option is true', function(){
      expect(formToObject('newForm', {includeEmptyValuedElements: true})).toEqual({'countries':[]});
    });

    it('should return an array with two elements when two options are selected', function(){
      var $countries = document.getElementById('countries');
      $countries.options[1].setAttribute('selected', true);
      $countries.options[2].setAttribute('selected', true);

      expect(formToObject('newForm')).toEqual({'countries':['RO', 'MC']});
    });

  });


  describe('An HTML form with a select element and options dont have value attribute', function(){

    beforeEach(function () {
        var html = '<form id="newForm">' +
            '<select name="countries" id="countries">' +
            '<option>Romania</option>' +
            '<option>Monaco</option>' +
            '<option>United States of America</option>' +
            '</select>' +
            '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

    afterEach(function () {
      document.body.removeChild(document.getElementById('fixtures'));
    });

    it('should return the label of the first option element', function(){
      expect(formToObject('newForm')).toEqual({'countries': 'Romania'});
    });


  });

})();