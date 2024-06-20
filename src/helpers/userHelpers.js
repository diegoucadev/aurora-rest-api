export function createTokenPayload(_id, username, email, isAdmin) {
    const payload = {
        _id: _id,
        username: username,
        email: email,
        isAdmin: isAdmin
    }
    return payload
}