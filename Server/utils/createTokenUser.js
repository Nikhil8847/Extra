

const createTokenUser = (user) => {
    const tokenUser = {
        name: user.fullname,
        username: user.username,
        _id: user._id,
        role: user.role
    }

    return tokenUser
}

module.exports = createTokenUser