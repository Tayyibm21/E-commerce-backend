require("dotenv").config();
const express = require("express");

const sequelize = require("./config/connection");

const routes = require("./routes");

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const init = async () => {
  try {
    await sequelize.sync({ force: false });

    app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
  } catch (error) {
    console.log(`[ERROR]: Connection to DB failed - ${error.message}`);
  }
};

init();