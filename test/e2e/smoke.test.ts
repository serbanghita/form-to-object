import { expect, browser } from '@wdio/globals'
import path from "path";

describe('smoke', () => {
  it('multiple choice fields form', async () => {
    await browser.url(`form-multiple-choice-fields.html`);

    // await $('#testForm').waitForDisplayed();
    // const $formEl = await $('#testForm');

    await $('#multiSelect').selectByAttribute('value', 'option2');
    await $('#multiSelect').selectByAttribute('value', 'option3');

    await $('#checkboxGroup-2').click();
    await $('#checkboxGroup-3').click();

    // https://webdriver.io/blog/2019/06/25/file-upload/
    const $fileUpload = await $('#fileUpload');
    const filePath1 = path.join(__dirname, 'fixtures/files/a.txt');
    // const filePath2 = path.join(__dirname, 'fixtures/files/b.txt');

    const remoteFilePath = await browser.uploadFile(filePath1);
    $fileUpload.setValue(remoteFilePath);



    const result = await browser.executeScript('return formToObject("testForm")', []);
    // await browser.debug(9999);


    await expect(result).toBe(false);

  })
})

