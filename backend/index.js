const express = require("express");
const cors = require("cors");
const PORT = 9000;
const userRoute = require("./route/user.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRoute);

app.get("/", (req, res) => {
  res.send("this is auth system my boy");
});

app.listen(PORT, () => console.log(`app running in port ${PORT}`));
