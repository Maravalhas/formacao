require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connection = require("./utilities/connection");

const app = express();
const PORT = process.env.PORT || 3001;

console.log("teste");

// Swagger
const swaggerUi = require("swagger-ui-express");

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  return res.status(200).json({ message: "API formação" });
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(require("./swagger/index"), { explorer: true })
);

app.use("/auth", require("./routes/auth.js"));
app.use("/orders", require("./routes/orders.js"));
app.use("/categories", require("./routes/categories.js"));

app.use("*", function (req, res) {
  return res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Process runing on port ${PORT}`);
  connection.authenticate().then(() => {
    console.log(`Connected to db`);
  });
});
