const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post')
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/'});
const fs = require('fs');
const app = express();
const secrets = require('./secrets.js');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
//mongoose.connect(`mongodb+srv://${secrets.MONGO_USER}:${secrets.MONGO_PASSWORD}@cluster0.ncabifs.mongodb.net/?retryWrites=true&w=majority`);
mongoose.connect(`mongodb://database:27017`);

app.post('/register', async (req, res) => {
  console.log(req.body)
  const {username, password} = req.body;
  try {
    const userDoc = await User.create({username, password: bcrypt.hashSync(password, salt)});
    res.json(userDoc);
  } catch(e) {
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const userDoc = await User.findOne({username});
  try {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      //logged in
      jwt.sign({username, id: userDoc._id}, secrets.SECRET_STRING, {}, (err, token) => {
        if (err)
          throw err;
        res.cookie('token', token).json({
          id: userDoc._id,
          username
        });
      });
    } else {
      res.status(400).json('Wrong credentials!');
    }
  }
  catch (e) {
    res.status(422).json('Invalid params');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if(!token) {
    res.json('Invalid token').status(400);
    return;
  }
  jwt.verify(token, secrets.SECRET_STRING, {}, (err, info) => {
    if(err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  let newPath = "";
  if(req.file) {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secrets.SECRET_STRING, {}, async (err, info) => {
    if(err) {
      console.log(err)
      return res.status(422).json("failed to authenticate");
    }
    const {title, summary, content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });
    res.json(postDoc);
  });
});

app.put('/post', uploadMiddleware.single('file'), async(req,res) => {
  let newPath = null;
  if(req.file) {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secrets.SECRET_STRING, {}, async (err, info) => {
    if(err) {
      console.log(err)
      return res.status(422).json("failed to authenticate");
    }
    const {id, title, summary, content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if(!isAuthor) {
      return res.status(400).json('You are not the author!');
    }
    await postDoc.update({title, summary, content, cover: newPath ? newPath : postDoc.cover})
    res.json(postDoc);
  });
  
});

app.get('/post', async (req,res) => {
  res.json(await Post.find().populate('author', 'username').sort({createdAt: -1}).limit(20));
});

app.get('/post/:id', async (req,res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', 'username');
  res.json(postDoc);
});

app.post('/post/delete/:id', async (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secrets.SECRET_STRING, {}, async (err, info) => {
    if(err) {
      console.log(err)
      return res.status(422).json("failed to authenticate");
    }
    const {id} = req.params;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if(!isAuthor) {
      return res.status(400).json('You are not the author!');
    }
    try {
      await Post.deleteOne({_id: id});
      return res.status(200).json("success!");
    } catch (e) {
      console.log('cootas')
      return res.status(422).json("failed to delete");
    }
  });
});

app.get('/hello', async (req,res) => {
  console.log("request inbound!")
  res.json({"message": "hello world!"});
});

app.listen(5000, '0.0.0.0', () => {
  console.log(`Running on http://0.0.0.0:5000`);
});