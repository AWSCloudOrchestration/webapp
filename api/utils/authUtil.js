/**
 * Extract hash for Basic Auth
 * @param {String} header 
 * @returns 
 */
const extractAsBasicAuth = (header) => {
    return header.split('Basic ')[1];
}

export default {
    extractAsBasicAuth
}