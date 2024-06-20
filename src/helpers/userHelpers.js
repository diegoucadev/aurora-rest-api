import User from "../model/user.model.js"

export function createUser(body) {
    const { name, username, email } = body
    const { phoneNumber, whatsapp, facebook, twitter } = body
    const user = new User({
        name: name,
        username: username,
        email: email,
        rating: 0,
        contact: {
            phoneNumber: phoneNumber,
            whatsapp: whatsapp,
            facebook: facebook,
            twitter: twitter
        },
        isActive: true,
        isAdmin: false
    })

    return user
}

export function createTokenPayload(_id, username, email, isAdmin) {
    const payload = {
        _id: _id,
        username: username,
        email: email,
        isAdmin: isAdmin
    }
    return payload
}