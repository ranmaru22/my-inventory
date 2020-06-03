const Item = require("../models/item");
const Category = require("../models/category");
const validator = require("express-validator");

exports.itemList = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item list");
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
    validator.check("name", "Item must have a name.").trim().isLength({ min: 1 }),
    validator.check("description", "Item must have a description.").trim().isLength({ min: 1 }),
    validator.check("manufacturer", "Item must have a manufacturer.").trim().isLength({ min: 1 }),
    validator.check("price", "Price must be a decimal number.").trim().isDecimal(),
    validator.check("stock", "Stock must be an integer.").trim().isInt(),
    validator.body("*").escape(),

    async (req, res, next) => {
        const errors = validator.validationResult(req);
        const categories = await Category.find().exec();
        const item = new Item({
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            manufacturer: req.body.manufacturer,
            price: req.body.price,
            stock: req.body.stock
        });
        if (!errors.isEmpty) {
            res.render("item_form", { title: "Add Item", item: item, errors: errors.array() });
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

exports.itemDeletePost = async (req, res, next) => {
    try {
        await Item.findByIdAndRemove(req.body.itemId);
        res.redirect("/");
    } catch (err) {
        return next(err);
    }
};

exports.itemUpdateGet = async (req, res, next) => {
    try {
        const categories = await Category.find().exec();
        const item = await Item.findById(req.params.id)
            .populate("category")
            .exec();
        res.render("item_form", { title: `Edit Item: ${item.name}`, categories: categories, item: item });
    } catch (err) {
        return next(err);
    }
};

exports.itemUpdatePost = [
    validator.check("name", "Item must have a name.").trim().isLength({ min: 1 }),
    validator.check("description", "Item must have a description.").trim().isLength({ min: 1 }),
    validator.check("manufacturer", "Item must have a manufacturer.").trim().isLength({ min: 1 }),
    validator.check("price", "Price must be a decimal number.").trim().isDecimal(),
    validator.check("stock", "Stock must be an integer.").trim().isInt(),
    validator.body("*").escape(),

    async (req, res, next) => {
        const errors = validator.validationResult(req);
        const item = new Item({
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            manufacturer: req.body.manufacturer,
            price: req.body.price,
            stock: req.body.stock,
            _id: req.params.id
        });
        if (!errors.isEmpty) {
            res.render("item_form", { title: "Add Item", item: item, errors: errors.array() });
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