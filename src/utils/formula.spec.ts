import {evaluate} from './formula';

describe('formula', () => {

    it('concatenates two strings to represent a path', () => {
        expect(evaluate('foo || \'/\'  || bar', {foo: 'abc', bar: 'def'})).toEqual('abc/def');
    });

})