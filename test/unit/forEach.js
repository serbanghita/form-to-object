describe('forEach', function() {
    it('applies the callback on each of the array values', function() {
        var data = [1, 2, 3];
        forEach(data, function(value, index) {
            data[index] = ++value;
        });
        expect(data[0]).toBe(2);
        expect(data[1]).toBe(3);
        expect(data[2]).toBe(4);
    });

    describe('polyfill', function() {
        var forEachCopy;
        beforeEach(function() {
            forEachCopy = Array.prototype.forEach;
            Array.prototype.forEach = null;
        });
        afterEach(function(){
            Array.prototype.forEach = forEachCopy;
        });
        it('applies the callback en each of the array values', function() {
            var data = [1, 2, 3];
            forEach(data, function(value, index) {
                data[index] = ++value;
            });
            expect(data[0]).toBe(2);
            expect(data[1]).toBe(3);
            expect(data[2]).toBe(4);
        });
    });
});