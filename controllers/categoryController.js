const Category = require("../models/category");
const validator = require("express-validator");

exports.catList = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category list");
};

exports.catDetail = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category detail page");
};

exports.catAddGet = (req, res, next) => {
    res.render("category_form", { title: "Add Category" });
};

exports.catAddPost = [
    validator.check("name").trim().isLength({ min: 1 }),
    validator.check("description").trim().isLength({ min: 1 }),
    validator.body("name").escape(),
    validator.body("description").escape(),

    async (req, res, next) => {
        const errors = validator.validationResult(req);
        const category = new Category({ name: req.body.name, description: req.body.description });
        if (!errors.isEmpty) {
            res.render("category_form", { title: "Add Category", category: category, errors: errors.array() });
            return void 0;
        } else {
            await Category.findOne({ name: req.body.name })
                .exec((err, result) => {
                    if (err) {
                        return next(err);
                    }
                    if (result) {
                        res.redirect(result.url);
                    } else {
                        category.save(err => {
                            if (err) {
                                return next(err);
                            }
                            res.redirect(category.url);
                        })
                    }
                });
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