export default function emailValidator(_, email) {
    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

    return { isValid: isValid ? null : false, message: isValid ? '' : 'Incorrect email' };
}