import { expect } from 'chai';
import base64Util from '../../api/utils/base64.js'

/**
 * Base64 Util tests
 */
describe('base64 util tests', () => {
    it('encode base64 test', async () => {
        const plaintext = 'tests';
        const result = base64Util.encode(plaintext);
        expect(result).to.be.string;
        expect(result).equal('dGVzdHM=');
    })

    it('encode base64 test where input is not string', async () => {
        const plaintext = 1234;
        try {
            base64Util.encode(plaintext)
        } catch (err) {
            expect(err.name).to.be.equal('TypeError');
        }
    })

    it('decode base64 test', async () => {
        const plaintext = 'tests';
        const encoded = 'dGVzdHM=';
        const result = base64Util.decode(encoded);
        expect(result).to.be.string;
        expect(result).equal(plaintext);
    })

    it('decode base64 test where input is not string', async () => {
        const encoded = 1234;
        try {
            base64Util.encode(encoded)
        } catch (err) {
            expect(err.name).to.be.equal('TypeError');
        }
    })
})