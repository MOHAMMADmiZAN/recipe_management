const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,

  },
  category: {
    type: String,
    enum: ["Vegetable", "Fruit", "Protein", "Grain", "Dairy", "Other"],
    default: "Other",
  },
}, { timestamps: true });

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
