const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, max: 50 },
    description: { type: String, required: true },
    manufacturer: { type: String, required: true },
    price: { type: Number, required: true, default: 0.0 },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String }
});

ItemSchema.virtual("url")
    .get(function () {
        return "/items/" + this._id;
    });

ItemSchema.virtual("imageUrl")
    .get(function () {
        return this.image ? "/uploads/" + this.image : "";
    });

module.exports = mongoose.model("Item", ItemSchema);