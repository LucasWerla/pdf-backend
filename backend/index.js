const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const { create } = require('xmlbuilder2');

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/convert', upload.single('pdf'), async (req, res) => {
  if (!req.file || req.file.mimetype !== 'application/pdf')
    return res.status(400).json({ error: 'Arquivo inválido. Envie um PDF.' });
  
  try {
    const data = await pdfParse(req.file.buffer);
    const text = data.text.toLowerCase();

    const retencoes = ['irrf', 'csll', 'cofins', 'pis', 'iss retido', 'retenção'];
    const hasRetencoes = retencoes.some(r => text.includes(r));

    const xml = create({ version: '1.0' })
      .ele('Nfse')
        .ele('Retencao').txt(hasRetencoes ? 'Sim' : 'Não').up()
      .end({ prettyPrint: true });

    res.json({ xml, hasRetencoes });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar o PDF.' });
  }
});

app.listen(3001, () => console.log('API rodando na porta 3001'));
