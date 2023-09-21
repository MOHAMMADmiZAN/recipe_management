const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const router = require("./routes");
const errorMiddleware = require("./middleware/errorHandleMiddleware");
const swaggerDocument = YAML.load("./schema.yaml");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use("/docs/v1/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);
app.use(errorMiddleware);

module.exports = app;