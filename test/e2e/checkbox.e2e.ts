import { expect, browser, $ } from '@wdio/globals'
import formToObject from "../../src";

describe('checkbox', () => {
  it('A form with unchecked checkboxes searched by a valid element string should return false.', async () => {
    await browser.url(`checkbox/checkbox1.html`);

    await $('#testForm').waitForDisplayed();
    const $form = await browser.execute(() => document.getElementById('testForm'));
    // await browser.debug(9999);
    const result = formToObject($form as unknown as HTMLFormElement);

    await expect(result).toBe(false);

  })
})

