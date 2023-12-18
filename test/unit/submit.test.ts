import {FormToObject} from "../../src/FormToObject";

describe('submit', () => {
    it('input with includeSubmitButton: true', () => {
        const $form = document.createElement('form');
        $form.innerHTML = `
          <input type="submit" name="submit" value="go">
        `;
        const formToObject = new FormToObject($form, {includeSubmitButton: true});

        expect(formToObject.convertToObj()).toEqual({'submit':'go'});
    });

    it('input with includeSubmitButton: false (default)', () => {
        const $form = document.createElement('form');
        $form.innerHTML = `
          <input type="submit" name="submit" value="go">
        `;
        const formToObject = new FormToObject($form);

        expect(formToObject.convertToObj()).toEqual({});
    });

    // Currently we don't support <button>. Should we?
    it('button', () => {
        expect(() => {
            const $form = document.createElement('form');
            $form.innerHTML = `
              <button type="submit" name="submit">go</button>
            `;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            new FormToObject($form);
        }).toThrowError('No <form> DOM elements were found. Form is empty.');
    });
});
