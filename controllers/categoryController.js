const Category = require("../models/category");
const Item = require("../models/item");
const validator = require("express-validator");

exports.catList = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category list");
};

exports.catDetail = async (req, res, next) => {
    try {
        const allCategories = await Category.find().exec();
        const category = await Category.findById(req.params.id);
        const items = await Item.find({ category: req.params.id }).exec();
        res.render("category_details", { title: category.name, items: items, categories: allCategories });
    } catch (err) {
        return next(err);
    }
};

exports.catAddGet = async (req, res, next) => {
    try {
        const categories = await Category.find().exec();
        res.render("category_form", { title: "Add Category", categories: categories });
    } catch (err) {
        return next(err);
    }
};

exports.catAddPost = [
    validator.body("name").trim().isLength({ min: 1 }),
    validator.body("description").trim().isLength({ min: 1 }),
    validator.body("*").escape(),

    async (req, res, next) => {
        const errors = validator.validationResult(req);
        const category = new Category({ name: req.body.name, description: req.body.description });
        if (!errors.isEmpty) {
            res.render("category_form", { title: "Add Category", category: category, errors: errors.array() });
            return void 0;
        } else {
            try {
                const result = await Category.findOne({ name: req.body.name }).exec();
                if (result) {
                    res.redirect(result.url);
                } else {
                    const newCategory = await category.save();
                    res.redirect(newCategory.url);
                }
            } catch (err) {
                return next(err);
            }
        }
    }
];

exports.catDeleteGet = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete category GET");
};

exports.catDeletePost = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete category POST");
};

exports.catUpdateGet = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Update category GET");
};

exports.catUpdatePost = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Update category POST");
};