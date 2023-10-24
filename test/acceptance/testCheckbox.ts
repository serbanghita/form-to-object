(function(){

  'use strict';

  function appendFixtureToBody(htmlContent) {
    const $newForm = document.createElement('div');
    $newForm.id = 'fixtures';
    $newForm.innerHTML = htmlContent;
    document.body.appendChild($newForm);
  }

  describe('checkbox', function(){

    afterEach(function () {
      document.body.removeChild(document.getElementById('fixtures'));
    });

    it('A form with unchecked checkboxes searched by a valid element string should return false.', function() {
      const html = '' +
        '<form id="newForm">' +
        '<input type="checkbox" name="single" value="Serban">' +
        '<input type="checkbox" name="many[]" value="First">' +
        '<input type="checkbox" name="many[]" value="Second">' +
        '<input type="checkbox" name="more[first]" value="More First">' +
        '<input type="checkbox" name="more[second]" value="More Second">' +
        '</form>';
      appendFixtureToBody(html);

      expect(formToObject('newForm')).toBe(false);
    });


    it('A form with a single checkbox without value attribute should return the default value "on" as a string.', function() {
      const html = '<form id="newForm">' +
        '<input type="text" name="name" value="Serban">' +
        '<input type="text" name="age" value="99">' +
        '<input type="checkbox" name="terms" checked> I agree with the terms and conditions' +
        '</form>';
      appendFixtureToBody(html);

      expect(formToObject('newForm')).toEqual({
        name: "Serban",
        age: "99",
        terms: "on"
      });
    });

    it('A form with two checkboxes with different values attributes should return the checked element value as an array', function() {
      const html = '<form id="newForm">' +
        '<input type="checkbox" name="subscribe" value="newsletter" checked> Subscribe for newsletter' +
        '<input type="checkbox" name="subscribe" value="announcements"> Subscribe for announcements' +
        '</form>';
      appendFixtureToBody(html);

      expect(formToObject('newForm')).toEqual({
        subscribe: ["newsletter"]
      });
    });


    it('A form with various checkboxes should return the expected object.', function() {
      const html = '' +
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
        '<input type="checkbox" name="singleThird" value="Second option value" checked>' +
        '<input type="checkbox" name="singleThird" value="Third option value">' +
        '</form>';
      appendFixtureToBody(html);

      expect(formToObject('newForm')).toEqual({
        'single': 'Serban',
        'many': {
          '0': 'First' // @todo: Should be ['First']. Known bug. Don't know yet if this is worth the effort.
        },
        'more': {
          'first': 'More First',
          'second': ['More Second First', 'More Second Second', 'More Second Third']
        },
        'singleSecond': 'Single second',
        'singleThird': ['Second option value']
      });
    });

  });

})();
