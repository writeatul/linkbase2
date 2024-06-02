const express= require("express")
const app=express();
app.use(express.static("public"));
app.set("view engine", "ejs")
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken=require("./middleware");
const mongoose = require('mongoose');
const db = require("./connection/connection");
const ContactForm=require("./model/contactFormSchema")
const addlink=require("./model/addLinkSchema");
const userSchema=require("./model/userschema");
db.on("error", (error) => {
    console.error("database connection error " + error);
});

db.once("open", () => {
    console.log("mongoDb connected successfully");
}); 
// Middleware to parse JSON bodies
app.use(express.json());;
app.get("/",(req,res)=>{
    res.render("board");
})

app.get("/contact",(req,res)=>{
    res.render("contact");
})

app.get("/addlink",(req,res)=>{
    res.render("addlink");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})
// const hostingsData = [
//     { service: 'Bahnhof', serviceLink: '#', paypal: true, creditcard: true, webmoney: false, bitcoin: false, locations: ['Sweden'], twitter: 'BahnhofAB', facebook: 'B4hnhof' },
//     { service: 'Bpw', serviceLink: '#', paypal: true, creditcard: true, webmoney: true, bitcoin: true, locations: ['Netherlands', 'Moldova', 'Russia', 'Ukraine', 'Sweden'], twitter: 'BulletProofweb', facebook: 'bulletproofweb' },
//     { service: 'Bullethost', serviceLink: '#', paypal: true, creditcard: false, webmoney: false, bitcoin: true, locations: ['Netherlands'], twitter: '', facebook: 'bullethostservices' },
//     { service: 'Cast-Security', serviceLink: '#', paypal: false, creditcard: false, webmoney: false, bitcoin: true, locations: ['Canada', 'France', 'Germany', 'Poland'], twitter: '', facebook: '' },
//     { service: 'Ccihosting', serviceLink: '#', paypal: true, creditcard: true, webmoney: false, bitcoin: true, locations: ['Panama'], twitter: '', facebook: 'CCIHosting' },
//     { service: 'Cloud4box', serviceLink: '#', paypal: false, creditcard: true, webmoney: true, bitcoin: true, locations: ['Russia'], twitter: '', facebook: 'groups/cloud4box/about/' },
//     { service: 'Ddos-Guard', serviceLink: '#', paypal: false, creditcard: true, webmoney: true, bitcoin: true, locations: ['USA', 'Netherlands', 'Germany', 'Russia', 'Japan'], twitter: 'ddosguard', facebook: 'ddosguard' },
//     { service: 'Dedi', serviceLink: '#', paypal: true, creditcard: false, webmoney: false, bitcoin: true, locations: ['Albania', 'Netherlands', 'Norway', 'Hong Kong', 'USA (Chicago,New York,Los Angeles)', 'Switzerland', 'United Kingdom', 'Spain', 'Austria', 'Italy', 'Poland', 'Australia'], twitter: '', facebook: '' },
//     { service: 'Flokinet', serviceLink: '#', paypal: true, creditcard: false, webmoney: false, bitcoin: true, locations: ['Iceland', 'Romania', 'Finland'], twitter: 'flokinetehf', facebook: '' }
// ];

app.get('/', (req, res) => {
    res.render('hosting', { hostings: hostingsData });
});

// API endpoint to fetch hosting data
app.get('/api/hostings', (req, res) => {
    res.json(hostingsData);
});
app.get("/hosting",(req,res)=>{
    res.render("hosting");
})

app.get("/blog",(req,res)=>{
    res.render("blog");
})
app.get("/shop",(req,res)=>{
    res.render("shop");
})
app.get("/warez",(req,res)=>{
    res.render("warez");
})
app.get("/useful",(req,res)=>{
    res.render("useful");
})

app.get("/board",(req,res)=>{
    res.render("board");
})

app.get("/gaming",(req,res)=>{
    res.render("gaming");
})

app.get("/admin",(req,res)=>{
    res.render("admin");
})

app.post('/register', async (req, res) => {
    try {
        // Check if the username already exists
        const existingUser = await userSchema.findOne({ username: req.body.name });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }
 
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds

        // Create a new user document with hashed password
        const newUser = new userSchema({
            username: req.body.name,
            email: req.body.email,
            password: hashedPassword // Store the hashed password in the database
        });

        // Save the new user document to the database
        await newUser.save();
        // Send a success response
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {

        // Find the user by email
        const user = await userSchema.findOne({ email: req.body.email });
        // If user not found or password incorrect
        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({ success: false, message: 'Invalid email or password maybe' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env. JWT_SECRET, { expiresIn: '1h' });

        // Send success response with token
        res.status(200).json({ success: true, token: token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/submit', async (req, res) => {
    const formData = req.body;

    try {
        // Save the code snippet to the database
        const document = await addlink.create({
            domain: formData.domain,
            optionOption: formData.optionOption,
            languageOption: formData.languageOption,
            info: formData.info,
            tor: formData.tor,
            i2p: formData.i2p,
            blockchain: formData.blockchain,
            twitter: formData.twitter,
            facebook: formData.facebook,
            telegram: formData.telegram,
            discord: formData.discord,
            paypal: formData.paypal === 'true', // Assuming the form sends 'true' or 'false' as strings
            creditcard: formData.creditcard === 'true',
            webmoney: formData.webmoney === 'true',
            bitcoin: formData.bitcoin === 'true',
            location: formData.location
        });
        
        
        res.json({ message: 'Form data received successfully', data: formData });
    } catch (error) {
        console.error("Error saving code snippet:", error);
        // Render an error page with an appropriate error message
        res.status(500).json({
            message: "An error occurred while saving the Links."
        });
    }
});
app.post('/contact', async (req, res) => {
    try {
        const { subject, message, name, email } = req.body;
     
        // Create a new contact form entry
        const newContactForm = new ContactForm({
            subject,
            message,
            name,
            email
        });
        // Save to the database
        await newContactForm.save();
        res.status(201).json({ success: true, message: 'Contact form submitted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error submitting contact form', error: error.message });
    }
});
app.get('/contact-message-count',verifyToken, async (req, res) => {
    try {
        const unreadCount = await ContactForm.countDocuments({ read: false });
        res.json({ count: unreadCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/contact-messages',verifyToken, async (req, res) => {
    try {
      const contactMessages = await ContactForm.find().sort({ createdAt: -1 });
      res.json({ messages: contactMessages });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/mark-as-read/:id',verifyToken, async (req, res) => {
    const messageId = req.params.id;
    try {
        // Update the specific message with the given ID to mark it as read
        await ContactForm.updateOne({ _id: messageId }, { $set: { read: true } });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Apply the verifyToken middleware to the /admin route
app.post('/admin',verifyToken, async (req, res) => {
  try {
    const { optionOption, languageOption } = req.body;
    const query = {};

    if (optionOption) query.optionOption = optionOption;
    if (languageOption) query.languageOption = languageOption;

    const links = await addlink.find(query).sort({ createdAt: -1 });
    const totalCount = await addlink.countDocuments(query);
    res.json({ links, totalCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/update-link/:id',verifyToken, async (req, res) => {
    try {
        const link = await addlink.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        res.json(link);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/delete-link/:id',verifyToken, async (req, res) => {
    try {
        await addlink.findByIdAndDelete(req.params.id);
        res.json({ message: 'Link deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/hostings', async (req, res) => {
    try {
        const hostingsdata = await addlink.find({
            optionOption: "Hosting",
            approved: true
        }).sort({ createdAt: -1 });
        res.json({ hostingsdata });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/get-links', async (req, res) => {
    try {
        const blogsdata = await addlink.find({
            optionOption: "Blog",
            approved: true
        }).sort({ createdAt: -1 });
        res.json({ blogsdata });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getShops', async (req, res) => {
    try {
        const shopsdata = await addlink.find({
            optionOption: "Shop",
            approved: true
        }).sort({ createdAt: -1 });
        res.json({ shopsdata });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getwarez', async (req, res) => {
    try {
        const warezsdata = await addlink.find({
            optionOption: "Warez",
            approved: true
        }).sort({ createdAt: -1 });
        res.json({ warezsdata });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getuseful', async (req, res) => {
    try {
        const usefulsdata = await addlink.find({
            optionOption: "Useful",
            approved: true
        }).sort({ createdAt: -1 });
        res.json({ usefulsdata });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getboard', async (req, res) => {
    try {
        const boardsdata = await addlink.find({
            optionOption: "Board",
            approved: true
        }).sort({ createdAt: -1 });
        res.json({ boardsdata });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getgaming', async (req, res) => {
    try {
        const gamingdata = await addlink.find({
            optionOption: "GameHacking",
            approved: true
        }).sort({ createdAt: -1 });
        res.json({ gamingdata });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(3011,()=>{
    console.log("port started");
})
