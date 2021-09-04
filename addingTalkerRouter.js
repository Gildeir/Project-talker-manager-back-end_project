const express = require('express');

const router = express.Router();

const fs = require('fs').promises;

const arquivo = './talker.json';

const { fsFetchTalker } = require('./fsFetchTalker');

router.get('/', async (_req, res) => {
  const data = await fsFetchTalker();
  if (data) return res.status(200).json(data);
    return res.status(200).json([]);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await fsFetchTalker();
  const found = data.find((item) => item.id === Number(id));
  if (!found) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return res.status(200).json(found);
});

const isValidToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: 'Token não encontrado',
    });
  }

  if (authorization.length !== 16) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
  next();
};

const isValidName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  }
  if (name.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  next();
};

const isValidAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({
      message: 'O campo "age" é obrigatório',
    });
  }
  if (age < 18) {
    return res.status(400).json({
      message: 'A pessoa palestrante deve ser maior de idade',
    });
  }
  next();
};
const isValidWatchedAt = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt } = talk;
  const valiDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!watchedAt) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }
  if (!valiDate.test(watchedAt)) {
    return res.status(400)
      .json({
        message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
      });
  }
  next();
};
const isValidRate = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;
 
if (rate < 1 || rate > 5) {
  return res.status(400).json({
    message: 'O campo "rate" deve ser um inteiro de 1 à 5',
  });
}

   if (!rate) {
     return res.status(400).json({
       message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
     });
   }
  next();
};

const isValidTalk = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }

  return next();
};

router.post('/',
  isValidToken,
  isValidName,
  isValidAge,
  isValidTalk,
  isValidWatchedAt,
  isValidRate,
  (req, res) => {
    fs.readFile(arquivo, 'utf8')
      .then((talkerInf) => JSON.parse(talkerInf))
      .then((talkerInf) => {
        const data = talkerInf;
        const addingNewTalker = { ...req.body, id: talkerInf.length + 1 };
        data.push(addingNewTalker);
        fs.writeFile('./talker.json', JSON.stringify(data));
        return res.status(201).json({ ...addingNewTalker });
      })
      .catch((err) => res.status(400).json(err));
  });

module.exports = router;