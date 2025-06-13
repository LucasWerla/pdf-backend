
const { create } = require('xmlbuilder2');

exports.generateXml = (dados, hasRetencoes) => {
  const root = create({ version: '1.0', encoding: 'utf-8' })
    .ele('Nfse')
      .ele('Numero').txt(dados.numero).up()
      .ele('DataEmissao').txt(dados.data).up()
      .ele('Prestador')
        .ele('Cnpj').txt(dados.cnpjPrestador).up()
      .up()
      .ele('Tomador')
        .ele('Cnpj').txt(dados.cnpjTomador).up()
      .up()
      .ele('Valor').txt(dados.valor.toFixed(2)).up();

  if (hasRetencoes) {
    root.ele('Retencoes')
        .ele('IRRF').txt('10.00').up()
        .ele('PIS').txt('5.00').up()
        .ele('COFINS').txt('5.00').up()
      .up();
  }

  return root.end({ prettyPrint: true });
};
