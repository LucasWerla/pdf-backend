
const pdfParse = require('pdf-parse');

exports.extractText = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

exports.analyzeText = (text) => {
  const lower = text.toLowerCase();
  const retencoes = ['irrf', 'pis', 'cofins', 'csll', 'inss', 'retenção', 'iss retido'];
  const hasRetencoes = retencoes.some(r => lower.includes(r));

  const dadosNota = {
    numero: '123456',
    cnpjPrestador: '12345678000100',
    cnpjTomador: '99887766000155',
    valor: 1000.00,
    data: '2025-06-01'
  };

  return { hasRetencoes, dadosNota };
};
