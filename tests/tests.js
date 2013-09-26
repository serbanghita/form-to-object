QUnit.test( 'basic functionality tests', function() {

	var form = new formToObject('nonExistentElementId');
	equal( form === false, false, 'Method returns false on a non existent DOM element.' );

	form = new formToObject('emptyForm');
	equal( form === false, false, 'Method returns false on an empty DOM element.');

	form = new formToObject('testForm');
	equal( typeof form === 'object', true, 'Method returns an object on an existent DOM form using DOM id string in the constructor.' );

	form = new formToObject(document.getElementById(testForm));
	equal( typeof form === 'object', true, 'Method returns an object on an existent DOM form using a DOM object in the constructor.');

});