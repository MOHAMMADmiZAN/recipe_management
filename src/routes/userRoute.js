const {getUserData, updateUser, updateUserPassword, deleteUser} = require("../api/user/controller");
const schemaValidationMiddleware = require("../middleware/schemaValidationMiddleware");
const pathIdSchema = require("../validators/pathIdValidator");
const authMiddleware = require("../middleware/authMiddleware");
const {updateUserSchema} = require("../validators/userValidator");
const changePasswordSchema = require("../validators/changePasswordValidator");
const router = require("express").Router();


router.get("/:id", schemaValidationMiddleware(pathIdSchema, 'params'), getUserData)
router.put("/:id", schemaValidationMiddleware(pathIdSchema, 'params'), schemaValidationMiddleware(updateUserSchema), authMiddleware, updateUser)
router.patch("/:id/password", schemaValidationMiddleware(pathIdSchema, 'params'), schemaValidationMiddleware(changePasswordSchema), authMiddleware, updateUserPassword)
router.delete("/:id", schemaValidationMiddleware(pathIdSchema, 'params'), authMiddleware,deleteUser)


module.exports = router;