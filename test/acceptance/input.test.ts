import {screen} from '@testing-library/dom'
import formToObject from "../../src";
import {readFixture} from "../helpers";

describe('input', () => {
  describe('An HTML form with a text field', () => {
    test('searched by a valid element DOM element should return an object', () => {
      document.body.innerHTML = readFixture("input/input-text.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'name':'Serban'});
    });
  });

  describe('An HTML form with a color field', () =>{
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-color.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'myColor':'#ff0000'});
    });
  });

  describe('An HTML form with a date field', () => {
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-date.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'bday':'2012-07-17'});
    });
  });

  describe('An HTML form with a datetime field', () => {
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-datetime.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'bdaytime':'2012-07-17 08:57:00'});
    });
  });

  describe('An HTML form with a datetime-local field', () => {
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-datetime-local.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'bdaytimeLocal':'2014-08-30T02:03'});
    });
  });

  describe('An HTML form with an email field', () => {
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-email.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'email':'serbanghita@gmail.com'});
    });
  });

  describe('An HTML form with a month field', () => {
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-month.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'bdaymonth':'2014-07'});
    });
  });

  describe('An HTML form with a number field', () => {
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-number.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'quantity':'4'});
    });
  });

  describe('An HTML form with a range field', () => {
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-range.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'points':'9'});
    });
  });

  describe('An HTML form with a search field', () => {
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-search.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'googlesearch':'javascript form to object'});
    });
  });

  describe('An HTML form with a tel field', ()=> {
    test('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-tel.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'yourPhoneNo':'+40.737.10.01.10'});
    });
  });

  describe('An HTML form with a time field', () =>{
    it('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-time.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'usrTime':'22:07'});
    });
  });

  describe('An HTML form with an url field', () => {
    it('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-url.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'homepage':'http://google.com.ro'});
    });
  });

  describe('An HTML form with a week field', () => {
    it('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-week.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'yearWeek':'2016-W02'});
    });
  });

  describe('An HTML from with a hidden field', () => {
    it('should return an object', () => {
      document.body.innerHTML = readFixture("input/input-hidden.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({'token':'123-456-789'});
    });
  });

  /**
   * Multiple input elements tests
   *
   */
  describe('An HTML form with multiple input fields', function(){
    it('should return an object containing all the fields names and respective values', function(){
      document.body.innerHTML = readFixture("input/input2.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form)).toEqual({
        'name':'Serban',
        'myColor':'#ff0000',
        'bday':'2012-07-17',
        'bdaytime':'2012-07-17 08:57:00',
        'bdaytimeLocal':'2014-08-30T02:03',
        'email':'serbanghita@gmail.com',
        'bdaymonth':'2014-07',
        'quantity':'4',
        'points':'9',
        'googlesearch':'javascript form to object',
        'yourPhoneNo':'+40.737.10.01.10',
        'usrTime':'22:07',
        'homepage':'http://google.com.ro',
        'yearWeek':'2016-W02'
      });
    });

  });

});
