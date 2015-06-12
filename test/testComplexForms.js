(function(){

  'use strict';

	/**
	 * Complex forms tests
	 */
	describe('A complex multi-level form', function(){

		beforeEach(function(done) {
			jasmine.getFixtures().fixturesPath = 'fixtures';
			loadFixtures('complex_form1.html');
			done();
		});

		it('should return a normal object when first level elements container is selected', function(done){

			expect(formToObject('firstLevelElements')).toEqual({
				'name': 'Serban',
				'address': 'Place du Casino, 98000 Monaco'
			});

			done();

		});

		it('should return an object with two levels of elements when second level elements container is selected', function(done){

			expect(formToObject('secondLevelElements')).toEqual({
				'settings': {
					'eyesColor': 'brown',
					'hairColor': 'blond',
					'gender': 'male',
					'age': '100'
				}
			});

			done();

		});

		it('should return an object with three levels of elements when third level elements container is selected', function(done){

			expect(formToObject('thirdLevelElements')).toEqual({
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

			done();

		});

	});


	describe('A complex matrix form', function(){

		beforeEach(function(done) {
			jasmine.getFixtures().fixturesPath = 'fixtures';
			loadFixtures('complex_form2.html');
			done();
		});	

		it('should return a multi-level object when the form container is selected', function(done){
			expect(formToObject('matrixForm')).toEqual({
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

			done();
			
		});

	});

	describe('The Facebook signup form', function(){

		beforeEach(function(done) {
			jasmine.getFixtures().fixturesPath = 'fixtures';
			loadFixtures('facebook_signup.html');
			done();
		});

		it('should return a multi-level object when the form container is selected', function(done){

			expect(formToObject('reg', {includeEmptyValuedElements: true})).toEqual({
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

			done();

		});

	});


})();