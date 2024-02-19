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
const{createTokens}=require('./JWT');



const app = express();
const port = 3000;
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


const symbols = [
  "7️⃣", "❌", "🍓", "🍋", "🍉", "🍒", "💵", "🍊", "🍎"
];



const routes=require('./routes/authRoutes');
const { render } = require('ejs');
app.use('/', routes);

app.get('/',(req,res)=>{
    res.render('index',{symbols:symbols, visibleIndex: 2, balance});
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


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await newUser.findOne({ where: { username: username } });

  if (!user) res.status(400).json({ error: "User Doesn't Exist" });

  const dbPassword = user.password;
  bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong Username and Password Combination!" });
    } else {
      const accessToken = createTokens(user);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });

      res.json("LOGGED IN");
    }
  });
});

app.post('/spin', (req, res) => {
  
  const newReels = Array.from({ length: 3}, () => symbols[Math.floor(Math.random() * symbols.length)]);
  console.log("entering this part of code")
  async function spin() {

   
    for (const symbol of symbols) {
        // Simulate querying for boxes
        const symbols = { style: { transitionDuration: '1000ms' } }; // Simulate the boxes object
        
        // Determine the duration
        const duration = determineDuration(boxes);
        
        // Simulate setting the transform property
        console.log("Setting transform property for door:", door);
        
        // Simulate waiting for the specified duration
        await delay(duration * 100);
        
    }
}
  

  const result = determineOutcome(newReels);

  res.json({ reels: newReels, result });
});



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






let balance=0;


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));    



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

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
    const client = await MongoClient.connect(uri, {useUnifiedTopology: true });
    const db = client.db('SlotMac');
    const usersCollection = db.collection('user');
  
    const updateResult = await usersCollection.updateOne({ _id: userId }, { $inc: { balance: amount } });
  
    client.close();
    return updateResult;
  };

// app.post('/', async(req,res)=>{
//     try{
//         const amound=parseInt(req.body.amount);
//     }catch(error){
//         console.error(error);
//     }
// });

app.post('/deposit', async (req, res) => {
  console.log(uri)
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
    

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    

    const database = client.db('test'); 
    
    // console.log(database)
    const usersCollection = database.collection('users'); 
    const username = 'asdfg'; 
    const user = await usersCollection.findOne({ username: username } );

    console.log(user)
    // console.log(usersCollection)

    if (user) {
        console.log('User found:', username);
        const amount = Number(req.body.amount);
        
        const updateResult = await usersCollection.updateOne({ username: username }, { $inc: { balance: amount } });

          if (updateResult.matchedCount === 1) {
            // Fetch updated balance from database for accuracy
            const updatedUser = await usersCollection.findOne({ _id: user._id });
            // const updatedBalance = updatedUser.balance;
            const updatedBalance = updatedUser.balance||0;
            console.log(updatedBalance)  
            
            res.render('./index',{symbols:symbols, visibleIndex: 2, balance:updatedBalance});
          // });
            // res.json({ message: 'Deposit successful', balance: updatedBalance }); // Send back updated balance
          } else {
            res.status(400).json({ message: 'User not found' });
          }
      
          
        
    } else {
        console.log('User not found');
        return null;
    }
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return null;
} finally {
    await client.close();
}


  
});

async function handleDeposit() {
   // Get amount from input field
  try {
    const response = await axios.post('/deposit', { amount });
    // Update balance display
    console.log('Deposit successful:', response.data);
    console.log(updatedBalance)
  } catch (error) {
    console.error('Deposit error:', error);
    // Handle error messages or notifications
  }
}

  // app.post('/', async(req,res)=>{
  //   try{
  //       const userId=req.user._id;
  //       const newReels=await spinReels();
  //       const result=await determineOutcome(newReels);
  //       await updateUserBalance(userId,result.amount);
  //       res.render('/index',{reels:newReels,result:result,balance:balance});
  //       console.log(userId)
  //   }catch(error){
  //       console.error(error);
  //       res.status(500).json({ message: 'Error processing spin' });
  //   }
  // })














  


//   const { JSDOM } = require('jsdom');

// (async () => {
//     const dom = await JSDOM.fromFile('yourHTMLFile.html'); // Replace 'yourHTMLFile.html' with your HTML file path
//     const { document } = dom.window;

//     const items = [
//         "7️⃣",
//         "❌",
//         "🍓",
//         "🍋",
//         "🍉",
//         "🍒",
//         "💵",
//         "🍊",
//         "🍎"
//     ];

//     document.querySelector(".info").textContent = items.join(" ");

//     const doors = document.querySelectorAll(".door");
//     // Add event listeners to buttons
//     document.querySelector("#spinner").addEventListener("click", spin);
//     document.querySelector("#reseter").addEventListener("click", init);


//     }

//     function init(firstInit = true, groups = 1, duration = 1) {
//         for (const door of doors) {
//             if (firstInit) {
//                 door.dataset.spinned = "0";
//             } else if (door.dataset.spinned === "1") {
//                 return;
//             }

//             const boxes = door.querySelector(".boxes");
//             const boxesClone = boxes.cloneNode(false);

//             const pool = ["❓"];
//             if (!firstInit) {
//                 const arr = [];
//                 for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
//                     arr.push(...items);
//                 }
//                 pool.push(...shuffle(arr));

//                 boxesClone.addEventListener(
//                     "transitionstart",
//                     function () {
//                         door.dataset.spinned = "1";
//                         this.querySelectorAll(".box").forEach((box) => {
//                             box.style.filter = "blur(1px)";
//                         });
//                     },
//                     { once: true }
//                 );

//                 boxesClone.addEventListener(
//                     "transitionend",
//                     function () {
//                         this.querySelectorAll(".box").forEach((box, index) => {
//                             box.style.filter = "blur(0)";
//                             if (index > 0) this.removeChild(box);
//                         });
//                     },
//                     { once: true }
//                 );
//             }

//             for (let i = pool.length - 1; i >= 0; i--) {
//                 const box = document.createElement("div");
//                 box.classList.add("box");
//                 box.style.width = door.clientWidth + "px";
//                 box.style.height = door.clientHeight + "px";
//                 box.textContent = pool[i];
//                 boxesClone.appendChild(box);
//             }
//             boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
//             boxesClone.style.transform = `translateY(-${
//                 door.clientHeight * (pool.length - 1)
//             }px)`;
//             door.replaceChild(boxesClone, boxes);
//         }
//     }

//     function shuffle([...arr]) {
//         let m = arr.length;
//         while (m) {
//             const i = Math.floor(Math.random() * m--);
//             [arr[m], arr[i]] = [arr[i], arr[m]];
//         }
//         return arr;
//     }

//     init();
// })();
