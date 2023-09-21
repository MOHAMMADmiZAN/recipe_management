const schemaValidationMiddleware = require("../middleware/schemaValidationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {addRecipe, getRecipes, updateRecipe, deleteRecipe, getRecipe} = require("../api/recipe");
const {recipeSchema, updateRecipeSchema} = require("../validators/recipeValidator");
const pathIdSchema = require("../validators/pathIdValidator");
const router = require("express").Router();





router.post("/", schemaValidationMiddleware(recipeSchema), authMiddleware,addRecipe)
router.get('/',getRecipes)
router.put("/:id",schemaValidationMiddleware(pathIdSchema,'params'), schemaValidationMiddleware(updateRecipeSchema), authMiddleware,updateRecipe)
router.delete("/:id",schemaValidationMiddleware(pathIdSchema,'params'), authMiddleware,deleteRecipe)
router.get("/:id",schemaValidationMiddleware(pathIdSchema,'params'),getRecipe)






module.exports = router;