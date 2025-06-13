
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfProcessor = require('./utils/pdfProcessor');
const xmlGenerator = require('./utils/xmlGenerator');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/convert', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Arquivo inválido. Envie um PDF.' });
    }

    const pdfText = await pdfProcessor.extractText(req.file.buffer);
    const { hasRetencoes, dadosNota } = pdfProcessor.analyzeText(pdfText);
    const xml = xmlGenerator.generateXml(dadosNota, hasRetencoes);

    res.json({ xml, hasRetencoes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar o PDF.' });
  }
});

app.listen(3001, () => console.log('Backend rodando em http://localhost:3001'));
