const {Router} = require("express");
const router = Router();


// handle Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running'
    });
});


// handle Auth routes
router.use("/api/v1/auth", require("./authRoute"));
// handle User routes
router.use("/api/v1/users", require("./userRoute"));
// handle Ingredient routes
router.use("/api/v1/ingredients", require("./ingredientRoute"));
// handle Recipe routes
router.use("/api/v1/recipes", require("./recipeRoute"));



// handle router 404 error
router.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});


module.exports = router;