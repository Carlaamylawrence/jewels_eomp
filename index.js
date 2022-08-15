const express = require("express");
const cors = require("cors");
const app = express();
app.set("port", process.env.PORT || 8081);
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to jewels" });
});

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productsRoute");

app.use("/users", userRoute);
app.use("/products", productRoute);

app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});

module.exports = {
  devServer: {
    Proxy: "*",
  },
};
