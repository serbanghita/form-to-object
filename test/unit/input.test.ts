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

    it('field containing dot', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
        <input type="text" name="a.b" value="b">
        <input type="text" name="a.bb.c" value="c">
        `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({
        'a': {
          'b': 'b',
          'bb': {
            'c': 'c'
          }
        },
      });
    });

    it('field containing dot with overlapping names', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
        <input type="text" name="a.b" value="b">
        <input type="text" name="a.b.c" value="c">
        `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({
        'a': {
          'b': {
            'c': 'c'
          }
        },
      });
    });

    it('multi-level fields containing brackets []', () => {
      const $form = document.createElement('form');
      $form.innerHTML = `
        <input type="text" name="matrix_one" value="a">

        <input type="text" name="matrix_two[]" value="a">
        <input type="text" name="matrix_two[]" value="b">
        <input type="text" name="matrix_two[]" value="c">
        <input type="text" name="matrix_two[]" value="d">

        <input type="text" name="matrix_three[x][a]" value="xa">
        <input type="text" name="matrix_three[x][b]" value="xb">
        <input type="text" name="matrix_three[x][c]" value="xc">
        <input type="text" name="matrix_three[x][d]" value="xd">
        <input type="text" name="matrix_three[y][a]" value="ya">
        <input type="text" name="matrix_three[y][b]" value="yb">

        <input type="text" name="matrix[a][]" value="a0">
        <input type="text" name="matrix[a][]" value="a1">
        <input type="text" name="matrix[a][]" value="a2">
        <input type="text" name="matrix[a][]" value="a3">

        <input type="text" name="matrix[b][]" value="b0">
        <input type="text" name="matrix[b][]" value="b1">
        <input type="text" name="matrix[b][]" value="b2">
        <input type="text" name="matrix[b][]" value="b3">

        <input type="text" name="matrix[c][]" value="c0">
        <input type="text" name="matrix[c][]" value="c1">
        <input type="text" name="matrix[c][]" value="c2">
        <input type="text" name="matrix[c][]" value="c3">

        <input type="text" name="matrix[d][]" value="d0">
        <input type="text" name="matrix[d][]" value="d1">
        <input type="text" name="matrix[d][]" value="d2">
        <input type="text" name="matrix[d][]" value="d3">

        <input type="text" name="matrix_loose[][]" value="00">
        <input type="text" name="matrix_loose[][]" value="10">
        <input type="text" name="matrix_loose[][]" value="20">
    `;
      const formToObject = new FormToObject($form);

      expect(formToObject.convertToObj()).toEqual({
        'matrix_one': 'a',
        'matrix_two': {
          0: 'a',
          1: 'b',
          2: 'c',
          3: 'd'
        },
        'matrix_three': {
          'x': {
            'a': 'xa',
            'b': 'xb',
            'c': 'xc',
            'd': 'xd'
          },
          'y': {
            'a': 'ya',
            'b': 'yb'
          }
        },
        'matrix': {
          'a': {
            0: 'a0',
            1: 'a1',
            2: 'a2',
            3: 'a3'
          },
          'b': {
            0: 'b0',
            1: 'b1',
            2: 'b2',
            3: 'b3'
          },
          'c': {
            0: 'c0',
            1: 'c1',
            2: 'c2',
            3: 'c3'
          },
          'd': {
            0: 'd0',
            1: 'd1',
            2: 'd2',
            3: 'd3'
          }
        },
        'matrix_loose': {
          0: {
            0: '00'
          },
          1: {
            0: '10'
          },
          2: {
            0: '20'
          }
        }
      });
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
