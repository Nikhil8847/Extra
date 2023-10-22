const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const alreadyExistsInDatabase = async (email) => {
    const emailAlreadyExists = await User.findOne({ email: email });
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError("Email already exists");
    }
};

const register = async (req, res) => {
    const { username, email, password, firstname, lastname } = req.body;

    await alreadyExistsInDatabase(email);

    const user = await User.create({ username, email, password, firstname, lastname });

    const tokenUser = createTokenUser(user)

    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({ tokenUser });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError.BadRequestError(
            "please provide email and password"
        );
    }
    
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    
    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
        throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ tokenUser });
};

const logout = (req, res) => {
    res.cookie("token", "logout", { 
        httpOnly: true,
        expires: new Date(Date.now()) 
    });

    res.status(StatusCodes.OK).send({mas: "user logged out"})
};
module.exports = { register, login, logout };
