import { expect, browser } from '@wdio/globals';
import { Key } from 'webdriverio';
import path from "path";

describe('smoke', () => {
  it('all multiple choice fields form', async () => {
    await browser.url(`form-multiple-choice-fields.html`);

    await $('#multiSelect').selectByAttribute('value', 'option2');
    await $('#multiSelect').selectByAttribute('value', 'option3');

    await $('#checkboxGroup-2').click();
    await $('#checkboxGroup-3').click();

    const result = await browser.executeScript('return formToObject("testForm")', []);
    await expect(result).toEqual({"checkboxGroup": ["option2", "option3"], "multiSelect": ["option2", "option3"]});

  });

  it('all single choice fields', async () => {
    await browser.url(`form-single-choice-fields.html`);

    await $('#text').setValue('text field value');
    await $('#password').setValue('password field value');
    await $('#email').setValue('email@field.value');
    await $('#number').setValue(123456);
    await $('#date').setValue('12/09/2023');
    await browser.executeScript('return document.getElementById("time").value = "08:16";', []);
    await $('#range').click();
    for (let i = 0; i < 10; i++) {
      await browser.keys([Key.ArrowRight]);
    }
    await $('#color').setValue('#703333');
    await $('#checkbox').click();
    await $('#radio2').click();
    const filePath = path.join(__dirname, 'fixtures/files/a.txt');
    const remoteFilePath = await browser.uploadFile(filePath);
    await $('#file').setValue(remoteFilePath);
    await $('#textarea').setValue('textarea value');
    await $('#select').selectByAttribute('value', 'option2');
    await browser.executeScript('return document.getElementById("hidden").value = "hidden value";', []);

    const result = await browser.executeScript('return formToObject("testForm")', []);
    await expect(result).toEqual({
      'text': 'text field value',
      'password': 'password field value',
      'email': 'email@field.value',
      'number': "123456",
      'date': '2023-12-09',
      'time': '08:16',
      'range': '60',
      'color': '#703333',
      'checkbox': 'on',
      'radio': 'option2',
      // @todo: Add file contents feature.
      // 'file': 'a.txt',
      'textarea': 'textarea value',
      'select': 'option2',
      'hidden': 'hidden value'
    });

  });

  it.skip('file field', async () => {

    // https://webdriver.io/blog/2019/06/25/file-upload/
    const $fileUpload = await $('#fileUpload');
    const filePath1 = path.join(__dirname, 'fixtures/files/a.txt');
    // const filePath2 = path.join(__dirname, 'fixtures/files/b.txt');

    const remoteFilePath = await browser.uploadFile(filePath1);
    await $fileUpload.setValue(remoteFilePath);
  });
})

