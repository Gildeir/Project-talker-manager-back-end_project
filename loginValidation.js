const express = require('express');

const router = express.Router();

const crypto = require('crypto');

const token = crypto.randomBytes(8).toString('hex');

const isValidEmail = (req, res, next) => {
  const regexChecker = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const {
    email,
  } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }
  if (!regexChecker.test(email)) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  next();
};

const isValidPassword = (req, res, next) => {
  const {
    password,
  } = req.body;
  if (!password) {
    return res.status(400).json({
      message: 'O campo "password" é obrigatório',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }
  next();
};

router.post('/', isValidEmail, isValidPassword, (_req, res) => {
  res.status(200).json({
    token,
  });
});

module.exports = router;