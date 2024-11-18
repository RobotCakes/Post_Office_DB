// ------------ASHLEY-------------------------------------------------
// Connecting to DB
const sql = require("mssql");
const config = {
  user: "ashley",
  password: "Jameharden4000@",
  server: "ohyeahmrpostman2.database.windows.net",
  database: "group10",
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

const pool = new sql.ConnectionPool(config);

pool
  .connect()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
  });

module.exports = pool;

const guestRouter = require("./guest.cjs");
const userRouter = require("./user.cjs");
const dataRouter = require("./data.cjs");
const emRouter = require("./employee.cjs");
const supRouter = require("./supplies.cjs");
const manaRouter = require("./manager.cjs");
const adminReportRouter = require("./admin-report.cjs");
const managerReportRouter = require("./manager-report.cjs");
const cors = require("cors");
const express = require("express");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "sHPLbKnF62nZ",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, //Set to true if using HTTPS
      maxAge: 1000 * 60 * 60, //1 hour
    },
  })
);

app.use("/guest", guestRouter);
app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/employee", emRouter);
app.use("/supplies", supRouter);
app.use("/manager", manaRouter);
app.use("/admin-report", adminReportRouter);
app.use("/manager-report", managerReportRouter);

app.listen(port, () => {
  console.log("Guest Router:", guestRouter);
  console.log("User Router:", userRouter);
  console.log(`Server running on http://localhost:${port}`);
});
// ------------ASHLEY (END)-------------------------------------------------
