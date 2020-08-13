import {evaluate} from './formula';

describe('formula', () => {

    it('concatenates two strings to represent a path', () => {
        expect(evaluate('foo || \'/\'  || bar', {foo: 'abc', bar: 'def'})).toEqual('abc/def');
    });

    it('Create sum of an array', () => {
        expect(evaluate('f(a) = a.gesamtpreis; f1(a,b) = a+b; a1 = map(f, rechnung_artikel); fold(f1,0,a1)', {a: [{size: 1, price: 2}, {size: 2, price: 5}]})).toEqual(7);
    })
})