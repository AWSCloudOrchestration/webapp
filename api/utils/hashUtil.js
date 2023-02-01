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

/**
 * Compare pass with hash saved in db
 * @param {String} userSentPass 
 * @param {String} password 
 * @returns {Boolean}
 */
const checkHash = async (userSentPass, password) => {
    const match = await bcrypt.compare(userSentPass, password);
    if (match) return true;
    return false;
}

export {
    createHash,
    checkHash
};