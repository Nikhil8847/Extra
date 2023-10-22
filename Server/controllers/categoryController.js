const { StatusCodes } = require("http-status-codes");
const Category = require("../models/Category")


const allCategories = async (req, res) => {
    const data = await Category.find({}).select("_id title slug")

    res.status(StatusCodes.OK).json({
        data
    })
}

const createCategory = async (req, res) => {
    req.body.user = req.user._id
    const category = await Category.create(req.body);
    res.status(StatusCodes.CREATED).json({
        msg: `Category "${category.title}" created.`,
        data: category
    })
}


module.exports = {
    createCategory,
    allCategories
}