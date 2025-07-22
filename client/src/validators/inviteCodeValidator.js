export default function inviteCodeValidator(_, inviteCode) {
    const isValid = /^[A-Za-z0-9]{6}$/.test(inviteCode);

    return { isValid: isValid ? null : false, message: isValid ? '' : 'Invite-code must be 6 characters and contain only letters and numbers' };
}