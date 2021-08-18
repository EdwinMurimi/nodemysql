const express = require("express");
const cors = require("cors")
require("dotenv").config();

const usersRoute = require("./routes/users");
const connection = require("./database/db");

connection.connect((error) => {
  if (error) throw error;
  console.log("database connected successfully");
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({origin: true, credentials: true}));

app.get("/", (req,res)=>{
  res.send("Welcome hme")
})

app.use("/users", usersRoute);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
