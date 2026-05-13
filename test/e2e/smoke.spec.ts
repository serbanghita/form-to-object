import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('all multiple choice fields form', async ({ page }) => {
    await page.goto('/form-multiple-choice-fields.html');

    await page.locator('#multiSelect').selectOption(['option2', 'option3']);
    await page.locator('#checkboxGroup-2').check();
    await page.locator('#checkboxGroup-3').check();

    const result = await page.evaluate('formToObject("testForm")');
    expect(result).toEqual({
      checkboxGroup: ['option2', 'option3'],
      multiSelect: ['option2', 'option3'],
    });
  });

  test('all single choice fields', async ({ page }) => {
    await page.goto('/form-single-choice-fields.html');

    await page.locator('#text').fill('text field value');
    await page.locator('#password').fill('password field value');
    await page.locator('#email').fill('email@field.value');
    await page.locator('#number').fill('123456');
    await page.locator('#date').evaluate((el: HTMLInputElement) => (el.value = '2023-12-09'));
    await page.locator('#time').evaluate((el: HTMLInputElement) => (el.value = '08:16'));

    await page.locator('#range').focus();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('ArrowRight');
    }

    await page.locator('#color').evaluate((el: HTMLInputElement) => (el.value = '#703333'));
    await page.locator('#checkbox').check();
    await page.locator('#radio2').check();
    await page.locator('#textarea').fill('textarea value');
    await page.locator('#select').selectOption('option2');
    await page.locator('#hidden').evaluate((el: HTMLInputElement) => (el.value = 'hidden value'));

    const result = await page.evaluate('formToObject("testForm")');
    expect(result).toEqual({
      text: 'text field value',
      password: 'password field value',
      email: 'email@field.value',
      number: '123456',
      date: '2023-12-09',
      time: '08:16',
      range: '60',
      color: '#703333',
      checkbox: 'on',
      radio: 'option2',
      textarea: 'textarea value',
      select: 'option2',
      hidden: 'hidden value',
    });
  });
});
