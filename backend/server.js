require('dotenv').config();

const express=require('express');
const cors=require('cors');
const connectDB=require('./config/db');
const authRoutes=require('./routes/authRoutes');
const authMiddleware=require('./middleware/authMiddleware');
const User=require('./models/User');

const app=express();

//connect to database
connectDB();

//middlewares
app.use(
  cors({
    origin: ["https://movie-explorer-alpha-lime.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

//mount auth routes
app.use('/auth', authRoutes);

const favoriteRoutes = require('./routes/favoriteRoutes');
app.use('/favorites', favoriteRoutes);

//protected test route
app.get('/profile', authMiddleware, async(req,res)=>{
    try{
        const user=await User.findById(req.user.userId).select('-password');
        if(!user) return res.status(404).json({message: 'User not found'});
        res.json({user});
    } catch(err){
        console.log('Profile error:', err);
        res.status(500).json({error: 'Server error'});
    }
});

//simple ping route
app.get('/ping',(req, res)=>{
    res.json({
        message: 'pong',
        time: new Date().toISOString()
    });
});

//start server
const PORT=process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});