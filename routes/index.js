var express = require('express');
const _ = require('underscore');
const uuidv4 = require('uuid/v4');
var router = express.Router();
const data = require('../data/data.json');
/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('login', { page: 'Login', menuId: 'login' });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  data.users.forEach(element => {
    if (element.username.toUpperCase() === username.toUpperCase() && element.password === password) {
      element.__session = uuidv4();
      res.status(200).json(element);
    }
  });
  res.status(200).json({ "error": { code: 0001, message: 'Invalid username or password' } });
})

router.post('/decrypt', function (req, res, next) {
  let encryptedText = req.body.text;
  let key = req.body.key;
  const simpleEncrypter = require('../simple-encrypter/simple-string-encrypter')
  //decrypt
  console.log(key)
  simpleEncrypter.SimpleStringEncrypter(key)
    .decrypt(encryptedText).then(data => {
      console.log("Decrypted: " + data)
      res.status(200).json(data)
    }).catch(err => {
      console.log(err)
      res.status(200).json(err);
    })
});

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

router.post('/encrypt', function (req, res, next) {
  let keys = req.body.keys;
  let random = getRandomArbitrary(0, keys.length - 1);
  console.log("random : " + random)
  let key = keys[random];
  console.log(keys)
  console.log("Secret Key : " + key)
  //encrypt
  const text = data.text;
  const simpleEncrypter = require('../simple-encrypter/simple-string-encrypter')
  simpleEncrypter.SimpleStringEncrypter(key)
    .encrypt(text).then(data => {
      console.log("Encrypted: " + data)
      res.status(200).json(data)
    }).catch(err => {
      console.log(err)
      res.status(200).json(err);
    })
});

router.post('/answer/check', function (req, res, next) {
  let answer = parseInt(req.body.answer);

  if (_.contains(data.answer, answer)) {
    let combinations = [];

    data.secretNumbers.forEach(element => {
      combinations.push(element.value);
    })

    res.status(200).json({ message: "Ya! Ok got it!", ans: answer, combinations: combinations });
  } else {
    res.status(200).json({ "error": { "message": "No it's not correct!" } })
  }

})

router.get('/home', function (req, res, next) {
  res.render('index', { page: 'Home', menuId: 'instruct' });
});


module.exports = router;
