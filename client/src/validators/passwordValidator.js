export default function passwordValidator(_, password) {
    const isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

    return { isValid: isValid ? null : false, message: isValid ? '' : 'Password must contain at least 6 characters, one letter and one number' };
}