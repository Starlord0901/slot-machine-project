require('dotenv').config();
const express = require('express');
const { spinReels, determineOutcome } = require('./app');
const session=require('express-session');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const user=require('./model/user');
require('dotenv').config();
const flash = require('connect-flash');
{spinReels,determineOutcome}require('./app');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');



const app = express();
const port =3002;
app.use(cors());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://aryaman:Aryaman7@slotmac.sgba4xz.mongodb.net/?retryWrites=true&w=majority';

async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("Connected to server");
    }catch(error){
        console.log(error);
    }
}

connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'SESSION_SECRET', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');

app.use(flash());

const routes=require('./routes/authRoutes');
app.use('/', routes);

app.get('/',(req,res)=>{
    res.render('index',{reels:reels, visibleIndex: 2});
});


app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.post('/signup', async(req,res)=>{
    try{
        const hashedPassword=await bcrypt.hash(req.body.password);
        const newUser=new User({
            username:req.body.username,
            password:hashedPassword
        });

        await newUser.save();
        req.flash('success','Account created');
        res.redirect('/login');
    }catch(error){
        console.error(error)
        req.flash('error');
        res.redirect('/signup');
    }
});


app.post('/login',async (req,res)=>{
    const {username, password}=req.body;
    const user=await User.findOne({username:username});
    console.log("loggedin");
    if(user && await bcrypt.compare(password,user.password)){
        req.session.user=user;
        req.flash('success');
        res.redirect('/app');
        
    }else{
        req.flash('error');
        res.redirect('/login');
    }
});




// app.use(async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   console.log(req.headers.authorization);
 
//   console.log(token);
//   console.log(req.cookies.authHeader);
// // Only create the cookie if the auth header is valid and no cookie exists
// if (req.headers.authorization && req.headers.authorization.startsWith('Bearer') && !req.cookies.authHeader) {
//   res.cookie('authHeader', req.headers.authorization, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//   });
//   console.log("cookie created");
// }else{
//   console.log("cookie not created");
// }


// // Access and verify the auth header directly from the request

// if (authHeader) {
//   try {
//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, secretKey);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// } else {
//   // Handle unauthorized (no valid auth header) case
//   return res.status(401).json({ message: 'Unauthorized' });
// }
// });

app.get('/index',(req,res)=>{
    if(req.session.user){
        console.log("app is rendering");
        res.render('index');
    }else{
        console.log("error")
        req.flash('login first');
        res.redirect('/login');
    }
});

const reels = ["A", "B", "C","D","E","F"];
let balance=0;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));    

app.get('/', (req, res) => {
    res.render('index', { reels: [], result: { message: 'A' }, balance: 0 });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// app.use(async (req, res, next) => {
//   // Check for authorization header
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized' });
//     consolelog("cookie createc");
//   }else{
//     console.log("cookie not created");
//   }

//   // Verify and extract user data from JWT
//   try {
//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, secretKey);
//     req.user = decoded; // Attach user data to request object
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// });

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   // Perform authentication logic to validate credentials (replace with your logic)
//   if (username === 'valid' && password === 'password') {
//     const payload = { username }; // Include relevant user data in payload
//     const token = jwt.sign(payload, secretKey, { expiresIn: '30m' }); // Set appropriate expiration time

//     // Set the cookie with secure and httpOnly flags (remove in development if needed)
//     res.cookie('authHeader', `Bearer ${token}`, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 1000 * 60 * 30, // Set cookie maxAge to match JWT expiration
//     });

//     res.json({ message: 'Login successful' });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// });






app.get('/logout', (req, res) => {
   
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.redirect('/');
        } else {
            res.redirect('/login'); 
        }
    });
});


const updateUserBalance = async (username, balance) => {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('SlotMac');
    const usersCollection = db.collection('user');
  
    const updateResult = await usersCollection.updateOne({ _id: userId }, { $inc: { balance: amount } });
  
    client.close();
    return updateResult;
  };

app.post('/', async(req,res)=>{
    try{
        const amound=parseInt(req.body.amount);
    }catch(error){
        console.error(error);
    }
});





  

app.post('/deposit', async (req, res) => {
    try {
      const amount = parseInt(req.body.amount);
      const userId = req.user; 
      console.log(userId);
      const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db('SlotMachine');
      const usersCollection = db.collection('SlotMac');
  
      // Update user balance
      const updateResult = await usersCollection.updateOne({ _id: userId }, { $inc: { balance: amount } });
      
      if (updateResult.matchedCount === 1) {
        res.json({ message: 'Deposit successful' });
      } else {
        res.status(400).json({ message: 'User not found' });
      }
  
      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing deposit' });
    }
  });

  app.post('/', async(req,res)=>{
    try{
        const userId=req.user._id;
        const newReels=await spinReels();
        const result=await determineOutcome(newReels);
        await updateUserBalance(userId,result.amount);
        res.render('/index',{reels:newReels,result:result,balance:balance});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error processing spin' });
    }
  })