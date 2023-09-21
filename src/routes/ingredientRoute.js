const schemaValidationMiddleware = require("../middleware/schemaValidationMiddleware");
const {ingredientSchema, updateIngredientSchema} = require("../validators/ingredientValidator");
const authMiddleware = require("../middleware/authMiddleware");
const pathIdSchema = require("../validators/pathIdValidator");
const {addIngredient, getIngredients, getIngredient, editIngredient, removeIngredient} = require("../api/ingredient");
const router = require("express").Router();


router.post("/", schemaValidationMiddleware(ingredientSchema), authMiddleware, addIngredient)
router.get("/",getIngredients)
router.get("/:id", schemaValidationMiddleware(pathIdSchema,"params"),getIngredient)
router.put("/:id", schemaValidationMiddleware(pathIdSchema,"params"), schemaValidationMiddleware(updateIngredientSchema), authMiddleware,editIngredient)
router.delete("/:id", schemaValidationMiddleware(pathIdSchema,"params"), authMiddleware,removeIngredient)


module.exports = router;