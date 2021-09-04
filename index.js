const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const { fsFetchTalker } = require('./fsFetchTalker');

const logingValidation = require('./loginValidation');
const talker = require('./addingTalkerRouter');

app.use(bodyParser.json());

app.use('/login', logingValidation);

app.use('/talker', talker);

const HTTP_OK_STATUS = 200;

const PORT = '3000';

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Requisito 1 - Crie o endpoint GET /talker - 
// O endpoint deve retornar um array com todas as pessoas palestrantes cadastradas.
app.get('/talker', async (_req, res) => {
  const manageTalkers = await fsFetchTalker();

  if (manageTalkers) return res.status(HTTP_OK_STATUS).json(manageTalkers);

  return res.status(HTTP_OK_STATUS).json([]);
});

// Requisito 2 - Crie o endpoint GET /talker/:id
// O endpoint deve retornar uma pessoa palestrante com base no id da rota.

app.get('/talker/:id', async (req, res) => {
  const {
    id,
  } = req.params;
  const managerTalkers = await fsFetchTalker();
  const managerTalker = managerTalkers.find((manager) => manager.id === Number(id));
  if (!managerTalker) {
    res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }

  res.status(200).json(managerTalker);
});

app.listen(PORT, () => {
  console.log('Online');
});