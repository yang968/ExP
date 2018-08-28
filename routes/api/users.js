const express = require("express");
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const router = express.Router();
const mongoose = require('mongoose');

// importing User model
const User = require('../../models/User');

router.get("/tester", (req, res) => res.json({
  msg: "This is the users route"
}));

// Private Auth route
router.get('/overview', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email
  });
});

// New user.
router.post('/register', (req, res) => {
  console.log(req.body)
  console.log(req.headers)
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) { return res.status(400).json(errors); }

  // Check to make sure nobody has already registered with a duplicate email
  console.log(req.body.email)
  const email = req.body.email
  User.findOne({ email })
    .then(user => {
      if (user) {
        // Throw a 400 error if the email address already exists
        return res.status(400).json({
          email: "A user has already registered with this address"
        });
      } else {
        // Otherwise create a new user
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          company: mongoose.Types.ObjectId(req.body.company),
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// Returning User.
router.post('/login', (req, res) => {
  const {
    errors,
    isValid
  } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ email: 'This user does not exist' });
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user.id,
              firstName: user.firstName
            };

            jsonwebtoken.sign(payload, keys.secretOrKey,
              // Tell the key to expire in one hour
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
          } else {
            return res.status(400).json({
              password: 'Incorrect password'
            });
          }
        });
    });
});


module.exports = router;