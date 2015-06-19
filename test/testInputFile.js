describe('An HTML form with a file field', function(){

    beforeEach(function () {
        var html = '<form id="newForm" enctype="multipart/form-data">' +
            '<input type="file" name="photo" id="photo" value="./fixtures/test.jpg">' +
            '</form>';
        var $newForm = document.createElement('div');
        $newForm.id = 'fixtures';
        $newForm.innerHTML = html;
        document.body.appendChild($newForm);
    });

    afterEach(function () {
        document.body.removeChild(document.getElementById('fixtures'));
    });

    // Due to security reason in browsers.
    //it('should return false if empty valued option is set to false', function(){
    //    expect(formToObject('newForm', {includeEmptyValuedElements:false})).toBe(false);
    //});

    // Due to security reason in browsers.
    //it('should return an object with an empty file path if empty valued option is set to true', function(){
    //    expect(formToObject('newForm', {includeEmptyValuedElements:true})).toEqual({'photo':''});
    //});

    //it('serban test', function(){
    //    var test = formToObject('newForm');
    //    console.log(test.photo, test.photo[0], test.photo.length, document.getElementById('photo').value);
    //});

});