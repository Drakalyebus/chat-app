export default function usernameValidator(_, username) {
    const isValid = /^[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{3,20}$/.test(username);

    return { isValid: isValid ? null : false, message: isValid ? '' : 'Username must be between 3 and 20 characters and contain only letters, numbers and special characters' };
}