const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

const Category = require("../models/category");
const Item = require("../models/item");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find().exec();
    res.render("index", { title: "Ranmaru's Keyboard Store", categories: categories });
  } catch (err) {
    return next(err);
  }
});

router.get("/categories/add", categoryController.catAddGet);
router.post("/categories/add", categoryController.catAddPost);
router.get("/categories/:id/update", categoryController.catUpdateGet);
router.post("/categories/:id/update", categoryController.catUpdatePost);
router.get("/categories/:id/delete", categoryController.catDeleteGet);
router.post("/categories/:id/delete", categoryController.catDeletePost);
router.get("/categories/:id", categoryController.catDetail);
router.get("/categories", categoryController.catList);

router.get("/items/add", itemController.itemAddGet);
router.post("/items/add", itemController.itemAddPost);
router.get("/items/:id/update", itemController.itemUpdateGet);
router.post("/items/:id/update", itemController.itemUpdatePost);
router.get("/items/:id/delete", itemController.itemDeleteGet);
router.post("/items/:id/delete", itemController.itemDeletePost);
router.get("/items/:id", itemController.itemDetail);
router.get("/items", itemController.itemList);

module.exports = router;
