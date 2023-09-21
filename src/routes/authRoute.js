const router = require("express").Router();
const {register, login} = require("../api/authentication");
const loginSchema = require("../validators/loginValidator");
const schemaValidationMiddleware = require("../middleware/schemaValidationMiddleware");
const {userSchema} = require("../validators/userValidator");




router.post("/signup",schemaValidationMiddleware(userSchema), register);
router.post("/signin", schemaValidationMiddleware(loginSchema), login);


module.exports = router;





