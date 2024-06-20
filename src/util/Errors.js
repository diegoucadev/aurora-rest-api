export class InvalidCredentialsError extends Error {
    constructor(message) {
        super(message)
        this.name = "InvalidCredentialsError"
    }
}

export class InvalidUsername extends Error {
    constructor(message) {
        super(message)
        this.name = "InvalidUsernameError"
    }
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message)
        this.name = "Unauthorized"
    }
}

export class UserNotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = "UserNotFoundError"
    }
}

export class AccessDeniedError extends Error {
    constructor(message) {
        super(message)
        this.name = "AccessDeniedError"
    }
}

export class EmailTakenError extends Error {
    constructor(message) {
        super(message)
        this.name = "EmailTakenError"
    }
}

export class UserAlreadyBannedError extends Error {
    constructor(message) {
        super(message) 
        this.name = "UserAlreadyBannedError"
    }
}

export class userNotBannedError extends Error {
    constructor(message) {
        super(message)
        this.name = "userNotBannedError"
    }
}

export class postNotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = "userNotBannedError"
    }
}