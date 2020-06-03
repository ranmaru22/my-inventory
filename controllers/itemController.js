const Item = require("../models/item");
const Category = require("../models/category");
const validator = require("express-validator");
const multer = require("multer");
const fs = require("fs");

const filePath = "public/uploads/";
const upload = multer({ dest: filePath });

const SUPER_SECRET_PASSWORD = process.env.SECRET_PASSWORD || "foobar";

exports.itemList = (req, res, next) => {
    res.redirect("/categories");
};

exports.itemDetail = async (req, res, next) => {
    try {
        const categories = await Category.find().exec();
        const item = await Item.findById(req.params.id)
            .populate("category")
            .exec();
        res.render("item_details", { title: item.name, item: item, categories: categories });
    } catch (err) {
        return next(err);
    }
};

exports.itemAddGet = async (req, res, next) => {
    try {
        const categories = await Category.find().exec();
        res.render("item_form", { title: "Add Item", categories: categories });
    } catch (err) {
        return next(err);
    }
};

exports.itemAddPost = [
    upload.single("image"),
    validator.body("name", "Item must have a name.").trim().isLength({ min: 1 }).escape(),
    validator.body("description", "Item must have a description.").trim().isLength({ min: 1 }).escape(),
    validator.body("manufacturer", "Item must have a manufacturer.").trim().isLength({ min: 1 }).escape(),
    validator.body("price", "Price must be a decimal number.").trim().isDecimal().escape(),
    validator.body("stock", "Stock must be an integer.").trim().isInt().escape(),

    async (req, res, next) => {
        const errors = validator.validationResult(req);
        console.log(errors);
        const categories = await Category.find().exec();
        const item = new Item({
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            manufacturer: req.body.manufacturer,
            price: req.body.price,
            stock: req.body.stock,
            image: req.file?.filename
        });
        if (!errors.isEmpty()) {
            res.render("item_form", { title: "Add Item", item: item, categories: categories, errors: errors.array() });
        } else {
            try {
                const result = await Item.findOne({ name: req.body.name, manufacturer: req.body.manufacturer }).exec();
                if (result) {
                    res.redirect(result.url);
                } else {
                    const newItem = await item.save();
                    res.redirect(newItem.url);
                }
            } catch (err) {
                return next(err);
            }
        }
    }
];

exports.itemDeleteGet = async (req, res, next) => {
    try {
        const categories = await Category.find().exec();
        const item = await Item.findById(req.params.id);
        res.render("item_delete", { title: `Delete Item: ${item.name}`, item: item, categories: categories });
    } catch (err) {
        return next(err);
    }
};

exports.itemDeletePost = [
    validator.body("password", "Wrong password!").notEmpty().custom(value => value === SUPER_SECRET_PASSWORD),

    async (req, res, next) => {
        try {
            if (!validator.validationResult(req).isEmpty()) {
                const categories = await Category.find().exec();
                const item = await Item.findById(req.params.id);
                res.render("item_delete", { title: `Delete Item: ${item.name}`, item: item, categories: categories, error: true });
            } else {
                const item = await Item.findById(req.body.itemId);
                if (item.image) {
                    fs.unlink(filePath + item.image, err => {
                        if (err) {
                            return next(err);
                        }
                    });
                }
                await item.remove();
                res.redirect("/");
            }
        } catch (err) {
            return next(err);
        }
    }
];

exports.itemUpdateGet = async (req, res, next) => {
    try {
        const categories = await Category.find().exec();
        const item = await Item.findById(req.params.id)
            .populate("category")
            .exec();
        res.render("item_form", { title: `Edit Item: ${item.name}`, categories: categories, item: item, edit: true });
    } catch (err) {
        return next(err);
    }
};

exports.itemUpdatePost = [
    upload.single("image"),
    validator.body("password", "Wrong password!").notEmpty().custom(value => value === SUPER_SECRET_PASSWORD),
    validator.body("name", "Item must have a name.").trim().isLength({ min: 1 }),
    validator.body("description", "Item must have a description.").trim().isLength({ min: 1 }),
    validator.body("manufacturer", "Item must have a manufacturer.").trim().isLength({ min: 1 }),
    validator.body("price", "Price must be a decimal number.").trim().isDecimal(),
    validator.body("stock", "Stock must be an integer.").trim().isInt(),
    validator.body("*").escape(),

    async (req, res, next) => {
        const errors = validator.validationResult(req);
        const categories = await Category.find().exec();
        const currentItem = await Item.findById(req.params.id);
        if (req.file && req.file.filename !== currentItem.image) {
            fs.unlink(filePath + currentItem.image, err => {
                if (err) {
                    return next(err);
                }
            });
        }
        const item = new Item({
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            manufacturer: req.body.manufacturer,
            price: req.body.price,
            stock: req.body.stock,
            _id: req.params.id,
            image: req.file?.filename || currentItem.image
        });
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlink(filePath + req.file.filename, err => {
                    if (err) {
                        return next(err);
                    }
                });
            }
            res.render("item_form", { title: `Edit Item: ${item.name}`, item: item, categories: categories, edit: true, errors: errors.array() });
        } else {
            try {
                const result = await Item.findByIdAndUpdate(req.params.id, item);
                res.redirect(result.url);
            } catch (err) {
                return next(err);
            }
        }
    }
];