const express = require('express');
const bodyParser = require('body-parser');
const { getUsers } = require('./db');
const cookieParser = require('cookie-parser')
const { engine }= require('express-handlebars');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

const fs = require('fs');

app.engine('handlebars', engine());
app.set('views', './views')
app.set('view engine', 'handlebars');

// Middleware to check if user is authorized
const checkAuth = (req, res, next) => {
  // Skip authentication for login page and static assets
  if (req.path === '/login') {
    return next();
  }

  const userId = req.cookies.user;

  console.log('User ID from cookie:', userId);
  
  if (!userId) {
    console.log('No user ID found in cookies');
    return res.redirect('/login');
  }
  
  const user = getUsers().find(user => user.id === Number(userId));
  
  if (!user) {
    console.log(`User ${userId} not found in database`);
    res.clearCookie('user');
    return res.redirect('/login');
  }

  req.user = user; // Attach user to request object for later use
  
  // User is authenticated, proceed to the next middleware
  next();
};

// Apply the authentication middleware
app.use(checkAuth);

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = getUsers().find(user => user.email === email);

  if (!user) {
    return res.status(401).send('User not found');
  }

  if (user.password !== password) {
    return res.status(401).send('Wrong password');
  }

  res.cookie('user', user.id, {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true
  });

  res.redirect('/');
})

// Любницький

app.get('/', (req, res) => {
  res.render('index', {
    email: req.user.email,
    name: req.user.fullName,
  });
})

app.use(express.static('public', {
  extensions: ['html']
}));

// app.get('/:page', (req, res) => {
//   res.send(req.params.page)
// })

//Труфанов
app.get('/test_trufanov', (req, res) => {
  res.send('<h2>Всем привет, я страничка!</h2>');
})

//kulaha
app.get("/test_kulaha_pages", (req, res) => {
  res.send("<h1>Привіт, Express!</h1>");
});

// Babiichuk Volodymyr
app.get('/news', (req, res) => {
  res.send('Новини дня, погода -4');
})

app.listen(9020, () => {
  console.log('Server is running on port http://127.0.0.1:9020');
})

//Tkachenko Polina
app.get('/test_polina', (req, res) => {
  res.send('Останні новини дня!');
})


// http://127.0.0.1:9020