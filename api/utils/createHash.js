import bcrypt from 'bcrypt';

/**
 * Hash plaintext with salt rounds
 * @param {String} plaintext 
 * @returns {String} hash
 */
const createHash = async (plaintext) => {
    const hash = await bcrypt.hash(plaintext, 10);
    return hash;
}

export default createHash;