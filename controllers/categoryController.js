const Category = require("../models/category");
const Item = require("../models/item");
const validator = require("express-validator");

const SUPER_SECRET_PASSWORD = process.env.SECRET_PASSWORD || "foobar";

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
    validator.body("name", "Name is required").trim().isLength({ min: 1 }).escape(),
    validator.body("description", "Description is required").trim().isLength({ min: 1 }).escape(),

    async (req, res, next) => {
        const errors = validator.validationResult(req);
        const categories = await Category.find().exec();
        const category = new Category({ name: req.body.name, description: req.body.description });
        if (!errors.isEmpty()) {
            res.render("category_form", { title: "Add Category", category: category, categories: categories, errors: errors.array() });
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
        const categories = await Category.find().exec();
        const category = await Category.findById(req.params.id);
        const items = await Item.find({ category: req.params.id });
        res.render("category_delete", { title: `Delete Category: ${category.name}`, items: items, category: category, categories: categories });
    } catch (err) {
        return next(err);
    }
};

exports.catDeletePost = [
    validator.body("password", "Wrong password!").notEmpty().custom(value => value === SUPER_SECRET_PASSWORD),

    async (req, res, next) => {
        try {
            const categories = await Category.find().exec();
            const category = await Category.findById(req.body.categoryId);
            const items = await Item.find({ category: req.body.categoryId });
            if (items.length > 0) {
                res.render("category_delete", { title: `Delete Category: ${category.name}`, items: items, category: category, categories: categories });
            } else if (!validator.validationResult(req).isEmpty()) {
                res.render("category_delete", { title: `Delete Category: ${category.name}`, items: items, error: true, category: category, categories: categories });
            } else {
                await Category.findByIdAndRemove(req.body.categoryId);
                res.redirect("/categories");
            }
        } catch (err) {
            return next(err);
        }
    }
];

exports.catUpdateGet = async (req, res, next) => {
    try {
        const allCategories = await Category.find().exec();
        const category = await Category.findById(req.params.id);
        res.render("category_form", { title: "Add Category", categories: allCategories, category: category, edit: true });
    } catch (err) {
        return next(err);
    }
};

exports.catUpdatePost = [
    validator.body("password", "Wrong password!").notEmpty().custom(value => value === SUPER_SECRET_PASSWORD),
    validator.body("name", "Name is required").trim().isLength({ min: 1 }).escape(),
    validator.body("description", "Description is required").trim().isLength({ min: 1 }).escape(),

    async (req, res, next) => {
        const errors = validator.validationResult(req);
        const category = new Category({ name: req.body.name, description: req.body.description, _id: req.params.id });
        if (!errors.isEmpty()) {
            res.render("category_form", { title: "Add Category", category: category, errors: errors.array(), edit: true });
        } else {
            try {
                const result = await Category.findByIdAndUpdate(req.params.id, category).exec();
                res.redirect(result.url);
            } catch (err) {
                return next(err);
            }
        }
    }
];