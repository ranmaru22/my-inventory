const Item = require("../models/item");
const Category = require("../models/category");
const validator = require("express-validator");

exports.itemList = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item list");
};

exports.itemDetail = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item detail page");
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
            return void 0;
        } else {
            await Item.findOne({ name: req.body.name, manufacturer: req.body.manufacturer })
                .exec((err, result) => {
                    if (err) {
                        return next(err);
                    }
                    if (result) {
                        res.redirect(result.url);
                    } else {
                        item.save(err => {
                            if (err) {
                                return next(err);
                            }
                            res.redirect(item.url);
                        })
                    }
                });
        }
    }
];

exports.itemDeleteGet = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Item GET");
};

exports.itemDeletePost = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Item POST");
};

exports.itemUpdateGet = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Update Item GET");
};

exports.itemUpdatePost = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Update Item POST");
};