import {readIntegrationFixture} from "../helpers";
import {screen} from "@testing-library/dom";
import formToObject from "../../src";

describe('complex forms', () => {

  describe('A complex multi-level form', ()=> {

    test('should return a normal object when first level elements container is selected', () => {
      document.body.innerHTML = readIntegrationFixture("other/complex_form1.html");
      const $form = screen.queryByTestId('firstLevelElements') as HTMLFormElement;

      expect(formToObject($form)).toEqual({
          'name': 'Serban',
          'address': 'Place du Casino, 98000 Monaco'
      });
    });

    test('should return an object with two levels of elements when second level elements container is selected', () => {
      document.body.innerHTML = readIntegrationFixture("other/complex_form1.html");
      const $form = screen.queryByTestId('secondLevelElements') as HTMLFormElement;

        expect(formToObject($form)).toEqual({
            'settings': {
                'eyesColor': 'brown',
                'hairColor': 'blond',
                'gender': 'male',
                'age': '100'
            }
        });
    });

    test('should return an object with three levels of elements when third level elements container is selected', () => {
      document.body.innerHTML = readIntegrationFixture("other/complex_form1.html");
      const $form = screen.queryByTestId('thirdLevelElements') as HTMLFormElement;

      expect(formToObject($form)).toEqual({
          'preferences': {
              'input': {
                  'devices': ['mouse', 'keyboard']
              },
              'game': {
                  'difficulty': 'hard',
                  'upgrades': ['free_amo', 'infinite_life']
              }
          }
      });
    });

  });

  describe('The Facebook signup form', () => {

    it('should return a multi-level object when the form container is selected', () => {
      document.body.innerHTML = readIntegrationFixture("other/facebook_signup.html");
      const $form = screen.queryByTestId('testForm') as HTMLFormElement;

      expect(formToObject($form, {includeEmptyValuedElements: true})).toEqual({
          'lsd': 'AVo2i6Gx',
          'firstname': 'Serban',
          'lastname': 'Ghita',
          'reg_email__': 'serbanghita@gmail.com',
          'reg_email_confirmation__': 'serbanghita@gmail.com',
          'reg_passwd__': "^`'like'`'a'`'bawz'`!?^",
          'birthday_month': '11',
          'birthday_day': '1',
          'birthday_year': '1936',
          'sex': '1',
          'referrer': '',
          'asked_to_login': '0',
          'terms': 'on',
          'contactpoint_label': 'email_only',
          'locale': 'en_US',
          'ab_test_data': '',
          'abtest_registration_group': '1',
          'reg_instance': 'pOstU6ORTCPzOOzD7OtlT0zZ',
          'qsstamp': 'W1tbMyw0OCw1MSw1Myw2MSw5NSwxMDMsMTEzLDE1NiwxNjUsMTgzLDIxOSwyNDcsMjU2LDI1NywyNjMsMjY4LDI3MywyOTksMzIyLDM1NiwzNTcsMzg3LDM5Myw0MDksNDM0LDQzNSw0NDQsNDQ5LDQ1Nyw0NTksNDgxLDQ5MSw0OTksNTE2LDUyMCw1MzUsNTU3LDU4MCw2NTQsNzMwLDc4NF1dLCJBWm5SbnhfZTBJX3JLV1VXQTB1bmFMUzU2Q1pQSHV3SlFGc1k1dV9Ub0poY2ZQaEd5MEJhZXRZTDE5Y0ZlMnN1LWFCb3ZGcDBQLWNtTjkybXMxZWYwVEJET1FUVFE5b3NaWWRLams4M3I1OGR6OUpHbTFUYjA2LXYxcDhXWEVFSEJpTWNYNUhndmhDX1dpZjBmZkFLdlNpWjdHdVZ0Uk9lV1d2S3BTdzhYaDBkbkJOMFpnakNsQkRYY3Q5SDNxNEhMSmx2NDE5TDc5WEhUVWU0Znh6RG1TQ3ROR05FNWFpN3lSWlMwRDRzbU5zT0J3Il0='
      });
    });
  });

});
