import {FormToObject} from "../../src/FormToObject";

describe('input', () => {
  describe('text field', () => {
    it('searched by a valid DOM element should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="text" name="text" value="value" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'text':'value'});
    });
  });

  describe('color field', () =>{
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="color" name="color" value="#ff0000" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'color':'#ff0000'});
    });
  });

  describe('date field', () => {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="date" name="date" value="2012-07-17" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'date':'2012-07-17'});
    });
  });

  describe('datetime field', () => {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="datetime" name="datetime" value="2012-07-17 08:57:00" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'datetime':'2012-07-17 08:57:00'});
    });
  });

  describe('datetime-local field', () => {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="datetime-local" name="datetimeLocal" value="2014-08-30T02:03" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'datetimeLocal':'2014-08-30T02:03'});
    });
  });

  describe('email field', () => {
    test('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="email" name="email" value="test@gmail.com" placeholder="you@email.com" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'email':'test@gmail.com'});
    });
  });

  describe('month field', () => {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="month" name="month" value="2014-07" placeholder="July, 2014" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'month':'2014-07'});
    });
  });

  describe('number field', () => {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="number" name="number" min="1" max="5" value="4" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'number':'4'});
    });
  });

  describe('range field', () => {
    test('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="range" name="range" min="1" max="10" value="9" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'range':'9'});
    });
  });

  describe('search field', () => {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="search" name="search" value="value" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'search':'value'});
    });
  });

  describe('tel field', ()=> {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="tel" name="tel" value="+40.737.10.01.10" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'tel':'+40.737.10.01.10'});
    });
  });

  describe('time field', () =>{
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="time" name="time" value="22:07" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'time':'22:07'});
    });
  });

  describe('url field', () => {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="url" name="url" value="http://google.com" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'url':'http://google.com'});
    });
  });

  describe('week field', () => {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="week" name="week" value="2016-W02" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'week':'2016-W02'});
    });
  });

  describe('hidden field', () => {
    it('should return an object', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
          <input type="hidden" name="hidden" value="value" />
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({'hidden':'value'});
    });
  });

});
