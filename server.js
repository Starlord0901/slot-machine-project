const express = require('express');
const { spinReels, determineOutcome } = require('./app');
const session=require('express-session');
const bodyParser=require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

const users=[
    {username:'user', password:'password', role:'user'},
    {username:'admin', password:'adminpassword', role:'admin'},
];

app.post('/login', (req,res)=>{
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.redirect('/app');
    } else {
        res.send('Invalid username or password');
    }
});

app.get('/reels', (req, res) => {
    const user = req.session.user;
    if (!user) {
        res.redirect('/login');
    } else {
      
        if (user.role === 'admin') {
            
            res.render('admin-reels');
        } else {
           
            res.render('user-reels');
        }
    }
});



let balance = 0; 

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
    res.render('index', { reels: [], result: { message: '' }, balance });
});

app.post('/deposit', (req, res) => {
    const amount = parseInt(req.body.amount);
    if (!isNaN(amount) && amount > 0) {
        balance += amount; 
    }
    res.redirect('/'); 
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
