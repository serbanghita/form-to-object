(function(){

  'use strict';

  /**
   * Textarea elements test.
   */

  describe('An HTML form with a textarea element', function(){

    beforeEach(function () {
        var html = '<form id="newForm">' +
            '<textarea name="address">Place du Casino, 98000 Monaco</textarea>' +
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
      expect(formToObject('newForm')).toEqual({'address':'Place du Casino, 98000 Monaco'});
    });

  });

})();