const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const sanitizeInput = require('./middleware/sanitize');
const initializeData = require('./utils/initializeData');
const { ensureParent } = require('./middleware/auth');


const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

initializeData();

const indexRoutes = require("./routes/index");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'complex_secret_here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  }
}));




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Fout',
    message: 'Er is een fout opgetreden'
  });
});

app.use(sanitizeInput);

app.use("/", indexRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});