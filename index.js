const express = require('express');

const app = express();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require("mongoose");
const multer = require("multer");
const UserModel = require('./models/User');
const checkAuth = require('./utils/checkAuth.js');
const UserController = require('./controllers/UserController.js');
const PostControler = require('./controllers/PostController.js');
const { registerValidation } = require('./validations/auth.js');
const postCreateValidator = require('./validations/auth.js');
const handleValidationErrors = require('./utils/handleValidationErrors');
const cors = require('cors')

app.use(express.json())
app.use(cors())

const uri = "mongodb+srv://Timur:Mistikk45@cluster0.hyza987.mongodb.net/MernTimur?retryWrites=true&w=majority"

mongoose.connect(uri).then(() => {
   console.log("Mongoose Started")
}).catch((err) => console.log("Db err", err))
mongoose.set('strictQuery', false);

const storage = multer.diskStorage({
   destination: (_, __, cb) => {
      cb(null, 'uploads');
   },
   filename: (_, file, cb) => {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });


app.use('/uploads', express.static('uploads'))

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.originalname}`,
   });
});



app.post('/auth/login', UserController.login)
app.post("/auth/register", handleValidationErrors, UserController.register)



app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/posts', PostControler.getAll)
app.get('/tags', PostControler.getLastTags)
app.get('/posts/:id', PostControler.getOne)
app.post('/posts', checkAuth, postCreateValidator, PostControler.create)
app.delete('/posts/:id', checkAuth, PostControler.remove)
app.patch('/posts/:id', checkAuth, postCreateValidator, PostControler.update)



















const register = async (req, res) => {
   try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
         email: req.body.email,
         fullName: req.body.fullName,
         avatarUrl: req.body.avatarUrl,
         passwordHash: hash,
      });

      const user = await doc.save();

      const token = jwt.sign(
         {
            _id: user._id,
         },
         'secret123',
         {
            expiresIn: '30d',
         },
      );

      const { passwordHash, ...userData } = user._doc;

      res.json({
         ...userData,
         token,
      });
   } catch (err) {
      console.log(err)
      res.json({
         massage: "Can't register"
      })
   }
}


const login = async (req, res) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email })

      if (!user) {
         return res.status(404).json({
            massage: "User not found"
         })
      }
      const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
      if (!isValidPass) {
         return res.status(404).json({
            massage: "Password or Login not found"
         })
      }

      const token = jwt.sign({
         _id: user._id,
      }, 'secret123', {
         expiresIn: '30d',
      })
      const { passwordHash, ...userData } = user._doc


      res.json({
         ...userData,
         token,
      })


   } catch (err) {
      console.log(err)
      res.json({
         massage: err
      })
   }
}


const getMe = async (req, res) => {
   try {
      const user = await UserModel.findById(req.userId)

      if (!user) {
         return res.status(404).json({
            massage: "User not found"
         })
      }

      const { passwordHash, ...userData } = user._doc


      res.json({ userData })

   } catch (err) {
      console.log(err)
      res.status(500).json({
         massage: err
      })
   }
}



console.log(process.env.PORT)
app.listen(process.env.PORT || 4444, (err) => {
   if (err) {
      return console.log(err)
   }
   console.log("Servers runs")
})