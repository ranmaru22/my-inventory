const Category = require("../models/category");
const Item = require("../models/item");
const validator = require("express-validator");

exports.catList = async (req, res, next) => {
    try {
        const categories = await Category.find().exec();
        const items = await Promise.all(categories.map(category => Item.find({ category: category }).exec()));
        res.render("category_list", { title: "Categories", items: items, categories: categories });
    } catch (err) {
        return next(err);
    }
};

exports.catDetail = async (req, res, next) => {
    try {
        const allCategories = await Category.find().exec();
        const category = await Category.findById(req.params.id);
        const items = await Item.find({ category: req.params.id }).exec();
        res.render("category_details", { title: category.name, items: items, thisCategory: category, categories: allCategories });
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

exports.catDeleteGet = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        const items = await Item.find({ category: req.params.id });
        res.render("category_delete", { title: `Delete Category: ${category.name}`, items: items, category: category });
    } catch (err) {
        return next(err);
    }
};

exports.catDeletePost = async (req, res, next) => {
    try {
        const category = await Category.findById(req.body.categoryId);
        const items = await Item.find({ category: req.body.categoryId });
        if (items.length > 0) {
            res.render("category_delete", { title: `Delete Category: ${category.name}`, items: items, category: category });
        } else {
            await Category.findByIdAndRemove(req.body.categoryId);
            res.redirect("/categories");
        }
    } catch (err) {
        return next(err);
    }
};

exports.catUpdateGet = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Update category GET");
};

exports.catUpdatePost = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Update category POST");
};