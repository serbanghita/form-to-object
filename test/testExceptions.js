(function(){

  'use strict';

  /**
   * Empty tests.
   *
   */
  describe('An empty HTML form', function () {

    beforeEach(function () {
        var html = '<form id="newForm"></form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
      });

    afterEach(function () {
      document.body.removeChild(document.getElementById('fixtures'));
    });

    it('should return false if null is passed as argument', function(){
      expect(formToObject(null)).toBe(false);
    });

    it('should return false if an empty string is passed as argument', function(){
      expect(formToObject('')).toBe(false);
    });

    it('should return false if undefined object is passed', function(){
      expect(formToObject(undefined)).toBe(false);
    });

    it('should return false if the argument passed is invalid', function(){
      expect(formToObject('newFormUndefined')).toBe(false);
    });

    it('should return false if the form has no elements', function(){
      expect(formToObject('newForm')).toBe(false);
    });

  });

});