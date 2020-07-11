const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const chalk = require('chalk');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select
} = require('./helper/hbs');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');
const methodOverride = require('method-override');

// Node env config
dotenv.config({
  path: './config/config.env'
});

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handle View Engine
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select
    },
    defaultLayout: 'main',
    extname: '.hbs'
  })
);
app.set('view engine', '.hbs');

// Session s
app.use(
  session({
    secret: 'something',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global var
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 500;

app.listen(
  PORT,
  console.log(
    chalk.cyan(
      `The server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  )
);
