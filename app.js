const API_BASE = "https://api-dados-abertos.tce.ce.gov.br/sim";
const API_PAGE_LIMIT = 1000;
const EXPENSE_FILTER_PAGE_LIMIT = 6;

const resourceSources = {
  "500": "Recursos nao vinculados de Impostos",
  "501": "Outros Recursos nao Vinculados",
  "502": "Recursos nao vinculados da compensacao de impostos",
  "503": "Apoio financeiro da Uniao em decorrencia de estado de calamidade publica.",
  "540": "Transferencias do FUNDEB - Impostos e Transferencias de Impostos",
  "541": "Transferencias do FUNDEB - Complementacao da Uniao - VAAF",
  "542": "Transferencias do FUNDEB - Complementacao da Uniao - VAAT",
  "543": "Transferencias do FUNDEB - Complementacao da Uniao - VAAR",
  "544": "Recursos de Precatorios do FUNDEF",
  "545": "Recursos de Precatorios do FUNDEB (2007- 2020)",
  "546": "Transferencias do FUNDEB - Complementacao da Uniao - ETI",
  "550": "Transferencia do Salario-Educacao",
  "551": "Transferencias de Recursos do FNDE Referentes ao Programa Dinheiro Direto na Escola (PDDE)",
  "552": "Transferencias de Recursos do FNDE Referentes ao Programa Nacional de Alimentacao Escolar (PNAE)",
  "553": "Transferencias de Recursos do FNDE Referentes ao Programa Nacional de Apoio ao Transporte Escolar (PNATE)",
  "569": "Outras Transferencias de Recursos do FNDE",
  "570": "Transferencias do Governo Federal referentes a Convenios e Instrumentos Congeneres vinculados a Educacao",
  "571": "Transferencias do Estado referentes a Convenios e Instrumentos Congeneres vinculados a Educacao",
  "572": "Transferencias de Municipios referentes a Convenios e Instrumentos Congeneres vinculados a Educacao",
  "573": "Royalties e Participacao Especial de Petroleo e Gas Natural Vinculados a Educacao - Lei no 12.858/2013",
  "574": "Operacoes de Credito Vinculadas a Educacao",
  "575": "Outras Transferencias de Convenios e Instrumentos Congeneres vinculados a Educacao",
  "576": "Transferencias de Recursos dos Estados para programas de educacao",
  "599": "Outros Recursos Vinculados a Educacao",
  "600": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Federal - Bloco de Manutencao das Acoes e Servicos Publicos de Saude",
  "601": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Federal - Bloco de Estruturacao da Rede de Servicos Publicos de Saude",
  "602": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Federal - Bloco de Manutencao das Acoes e Servicos Publicos de Saude  Recursos destinados ao enfrentamento da COVID-19 no bojo da acao 21C0.",
  "603": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Federal - Bloco de Estruturacao da Rede de Servicos Publicos de Saude  Recursos destinados ao enfrentamento da COVID-19 no bojo da acao 21C0.",
  "604": "Transferencias provenientes do Governo Federal destinadas ao vencimento dos agentes comunitarios de saude e dos agentes de combate as endemias",
  "605": "Assistencia financeira da Uniao destinada a complementacao ao pagamento dos pisos salariais para profissionais da enfermagem.",
  "621": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Estadual",
  "622": "Transferencias Fundo a Fundo de Recursos do SUS provenientes dos Governos Municipais",
  "631": "Transferencias do Governo Federal referentes a Convenios e Instrumentos Congeneres vinculados a Saude",
  "632": "Transferencias do Estado referentes a Convenios e Instrumentos Congeneres vinculados a Saude",
  "633": "Transferencias de Municipios referentes a Convenios Instrumentos Congeneres vinculados a Saude",
  "634": "Operacoes de Credito vinculadas a Saude",
  "635": "Royalties e Participacao Especial de Petroleo e Gas Natural vinculados a Saude - Lei no 12.858/2013",
  "636": "Outras Transferencias de Convenios e Instrumentos Congeneres vinculados a Saude",
  "659": "Outros Recursos Vinculados a Saude",
  "660": "Transferencia de Recursos do Fundo Nacional de Assistencia Social - FNAS",
  "661": "Transferencia de Recursos dos Fundos Estaduais de Assistencia Social",
  "662": "Transferencias de Recursos dos Fundos Municipais de Assistencia Social",
  "665": "Transferencias de Outras Entidades de Convenios e Instrumentos Congeneres vinculados a Assistencia Social",
  "669": "Outros Recursos Vinculados a Assistencia Social",
  "700": "Outras Transferencias de Convenios ou Instrumentos Congeneres da Uniao",
  "701": "Outras Transferencias de Convenios ou Instrumentos Congeneres dos Estados",
  "702": "Outras Transferencias de Convenios ou Instrumentos Congeneres dos Municipios",
  "703": "Outras Transferencias de Convenios ou Instrumentos Congeneres de outras Entidades",
  "704": "Transferencias da Uniao Referentes a Compensacoes Financeiras pela Exploracao de Recursos Naturais",
  "705": "Transferencias dos Estados Referentes a Compensacoes Financeiras pela Exploracao de Recursos Naturais",
  "706": "Transferencia Especial da Uniao",
  "707": "Transferencias da Uniao  inciso I do art. 5o da Lei Complementar 173/2020",
  "708": "Transferencia da Uniao Referente a Compensacao Financeira de Recursos Minerais",
  "709": "Transferencia da Uniao referente a Compensacao Financeira de Recursos Hidricos",
  "710": "Transferencia Especial dos Estados",
  "711": "Demais Transferencias Obrigatorias nao Decorrentes de Reparticoes de Receitas",
  "712": "Transferencias Fundo a Fundo de Recursos do Fundo Penitenciario - FUNPEN",
  "713": "Transferencias Fundo a Fundo de Recursos do Fundo de Seguranca Publica - FSP",
  "714": "Transferencias Fundo a Fundo de Recursos do Fundo de Amparo ao Trabalhador - FAT",
  "715": "Transferencias Destinadas ao Setor Cultural - LC no 195/2022 - Art. 5o - Audiovisual",
  "716": "Transferencias Destinadas ao Setor cultural - LC no 195/2022 - Art. 8o - Demais Setores da Cultura",
  "717": "Assistencia Financeira Transporte Coletivo - Art. 5o, Inciso IV, EC no 123/2022",
  "718": "Auxilio Financeiro - Outorga Credito Tributario ICMS - Art. 5o, Inciso V, EC no 123/2022",
  "719": "Transferencias da Politica Nacional Aldir Blanc de Fomento a Cultura - Lei no 14.399/202",
  "720": "Transferencias da Uniao Referentes as participacoes na exploracao de Petroleo e Gas Natural destinadas ao FEP - Lei 9.478/1997",
  "721": "Transferencias da Uniao Referentes a Cessao Onerosa de Petroleo  Lei no 13.885/2019",
  "722": "Transferencias do Fundo de Equalizacao Federativa (FEF)  LC no 212/2025  Propag (Portaria STN/MF no 1.701/2025)",
  "747": "Outras vinculacoes de transferencias da Uniao",
  "748": "Outras vinculacoes de transferencias dos Estados",
  "749": "Outras vinculacoes de transferencias",
  "750": "Recursos da Contribuicao de Intervencao no Dominio Economico - CIDE",
  "751": "Recursos da Contribuicao para o Custeio do Servico de Iluminacao Publica - COSIP",
  "752": "Recursos Vinculados ao Transito",
  "753": "Recursos Provenientes de Taxas, Contribuicoes e Precos Publicos",
  "754": "Recursos de Operacoes de Credito",
  "755": "Recursos de Alienacao de Bens/Ativos - Administracao Direta",
  "756": "Recursos de Alienacao de Bens/Ativos - Administracao Indireta",
  "757": "Recursos de depositos judiciais  Lides das quais o ente faz parte",
  "758": "Recursos de depositos judiciais  Lides das quais o ente nao faz parte",
  "759": "Recursos vinculados a fundos",
  "760": "Recursos de Emolumentos, Taxas e Custas",
  "761": "Recursos Vinculados ao Fundo de Combate e Erradicacao da Pobreza",
  "762": "Recursos de Alienacao de Ativos - Cessao de Direitos Creditorios. (Portaria STN/MF No 2.297/2025)",
  "763": "Recursos proprios dos estados vinculados ao Propag  LC no 212/202",
  "799": "Outras vinculacoes legais",
  "800": "Recursos vinculados ao RPPS - Fundo em Capitalizacao (Plano Previdenciario)",
  "801": "Recursos vinculados ao RPPS - Fundo em Reparticao (Plano Financeiro)",
  "802": "Recursos vinculados ao RPPS - Taxa de Administracao",
  "803": "Recursos vinculados ao Sistema de Protecao Social dos Militares (SPSM)",
  "804": "Demais Recursos Previdenciarios",
  "860": "Recursos extraorcamentarios vinculados a precatorios",
  "861": "Recursos extraorcamentarios vinculados a depositos judiciais",
  "862": "Recursos de Depositos de Terceiros",
  "863": "Recursos a distribuir  Comite Gestor IBS",
  "869": "Outros recursos extraorcamentarios",
  "880": "Recursos proprios dos consorcios",
  "899": "Outros Recursos Vinculados",
  "500000000": "Recursos nao vinculados de Impostos",
  "500100100": "Receitas de Impostos e de Transferencia de Impostos  Educacao",
  "500100200": "Receitas de Impostos e de Transferencia de Impostos  Saude",
  "501000000": "Outros Recursos nao Vinculados",
  "502000000": "Recursos nao vinculados da compensacao de impostos",
  "503000000": "Apoio financeiro da Uniao em decorrencia de estado de calamidade publica.",
  "503101000": "Apoio financeiro da Uniao em decorrencia de estado de calamidade publica.",
  "503310100": "Apoio financeiro da Uniao em decorrencia de estado de calamidade publica.",
  "503312100": "Apoio financeiro da Uniao em decorrencia de estado de calamidade publica.",
  "503320100": "Apoio financeiro da Uniao em decorrencia de estado de calamidade publica.",
  "503320200": "Apoio financeiro da Uniao em decorrencia de estado de calamidade publica.",
  "503321100": "Apoio financeiro da Uniao em decorrencia de estado de calamidade publica.",
  "503322100": "Apoio financeiro da Uniao em decorrencia de estado de calamidade publica.",
  "540000000": "Transferencias do FUNDEB  impostos 30%",
  "540107000": "Transferencias do FUNDEB  impostos 70%",
  "541000000": "Transferencias do FUNDEB 30%-Complementacao Uniao  VAAF",
  "541107000": "Transferencias do FUNDEB 70%-Complementacao Uniao  VAAF",
  "542000000": "Transferencias do FUNDEB 30%-Complementacao Uniao  VAAT",
  "542107000": "Transferencias do FUNDEB 70%-Complementacao Uniao  VAAT",
  "543000000": "Transferencias do FUNDEB 30%-Complementacao Uniao  VAAR",
  "543107000": "Transferencias do FUNDEB 70%-Complementacao Uniao  VAAR",
  "544000000": "Recursos de Precatorios do FUNDEF",
  "545000000": "Recursos de Precatorios do FUNDEB (2007- 2020)",
  "546000000": "Transferencias do FUNDEB - Complementacao da Uniao - ETI",
  "550000000": "Transferencia do Salario-Educacao",
  "551000000": "Transferencias de Recursos do FNDE Referentes ao Programa Dinheiro Direto na Escola (PDDE)",
  "552000000": "Transferencias de Recursos do FNDE Referentes ao Programa Nacional de Alimentacao Escolar (PNAE)",
  "553000000": "Transferencias de Recursos do FNDE Referentes ao Programa Nacional de Apoio ao Transporte Escolar (PNATE)",
  "569000000": "Outras Transferencias de Recursos do FNDE",
  "570000000": "Transferencias do Governo Federal referentes a Convenios e Instrumentos Congeneres vinculados a Educacao",
  "571000000": "Transferencias do Estado referentes a Convenios e Instrumentos Congeneres vinculados a Educacao",
  "572000000": "Transferencias de Municipios referentes a Convenios e Instrumentos Congeneres vinculados a Educacao",
  "573000000": "Royalties e Participacao Especial de Petroleo e Gas Natural Vinculados a Educacao - Lei no 12.858/2013",
  "574000000": "Operacoes de Credito Vinculadas a Educacao",
  "575000000": "Outras Transferencias de Convenios e Instrumentos Congeneres vinculados a Educacao",
  "576000000": "Transferencias de Recursos dos Estados para programas de educacao",
  "599000000": "Outros Recursos Vinculados a Educacao",
  "600000000": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Federal - Bloco de Manutencao das Acoes e Servicos Publicos de Saude",
  "601000000": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Federal - Bloco de Estruturacao da Rede de Servicos Publicos de Saude",
  "602000000": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Federal - Bloco de Manutencao das Acoes e Servicos Publicos de Saude  Recursos destinados ao enfrentamento da COVID-19 no bojo da acao 21C0.",
  "603000000": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Federal - Bloco de Estruturacao da Rede de Servicos Publicos de Saude  Recursos destinados ao enfrentamento da COVID-19 no bojo da acao 21C0.",
  "604000000": "Transferencias provenientes do Governo Federal destinadas ao vencimento dos agentes comunitarios de saude e dos agentes de combate as endemias",
  "605000000": "Assistencia financeira da Uniao destinada a complementacao ao pagamento dos pisos salariais para profissionais da enfermagem.",
  "621000000": "Transferencias Fundo a Fundo de Recursos do SUS provenientes do Governo Estadual",
  "622000000": "Transferencias Fundo a Fundo de Recursos do SUS provenientes dos Governos Municipais",
  "631000000": "Transferencias do Governo Federal referentes a Convenios e Instrumentos Congeneres vinculados a Saude",
  "632000000": "Transferencias do Estado referentes a Convenios e Instrumentos Congeneres vinculados a Saude",
  "633000000": "Transferencias de Municipios referentes a Convenios Instrumentos Congeneres vinculados a Saude",
  "634000000": "Operacoes de Credito vinculadas a Saude",
  "635000000": "Royalties e Participacao Especial de Petroleo e Gas Natural vinculados a Saude - Lei no 12.858/2013",
  "636000000": "Outras Transferencias de Convenios e Instrumentos Congeneres vinculados a Saude",
  "659000000": "Outros Recursos Vinculados a Saude",
  "660000000": "Transferencia de Recursos do Fundo Nacional de Assistencia Social - FNAS",
  "661000000": "Transferencia de Recursos dos Fundos Estaduais de Assistencia Social",
  "662000000": "Transferencias de Recursos dos Fundos Municipais de Assistencia Social",
  "665000000": "Transferencias de Outras Entidades de Convenios e Instrumentos Congeneres vinculados a Assistencia Social",
  "665000001": "Transferencias da Uniao de Convenios e Instrumentos Congeneres vinculados a Assistencia Social",
  "665000002": "Transferencias dos Estados de Convenios e Instrumentos Congeneres vinculados a Assistencia Social",
  "665000003": "Transferencias dos Municipios de Convenios e Instrumentos Congeneres vinculados a Assistencia Social",
  "669000000": "Outros Recursos Vinculados a Assistencia Social",
  "700000000": "Outras Transferencias de Convenios ou Instrumentos Congeneres da Uniao",
  "701000000": "Outras Transferencias de Convenios ou Instrumentos Congeneres dos Estados",
  "702000000": "Outras Transferencias de Convenios ou Instrumentos Congeneres dos Municipios",
  "703000000": "Outras Transferencias de Convenios ou Instrumentos Congeneres de outras Entidades",
  "704000000": "Transferencias da Uniao Referentes a Compensacoes Financeiras pela Exploracao de Recursos Naturais",
  "705000000": "Transferencias dos Estados Referentes a Compensacoes Financeiras pela Exploracao de Recursos Naturais",
  "706000000": "Transferencia Especial da Uniao",
  "707000000": "Transferencias da Uniao  inciso I do art. 5o da Lei Complementar 173/2020",
  "708000000": "Transferencia da Uniao Referente a Compensacao Financeira de Recursos Minerais",
  "709000000": "Transferencia da Uniao referente a Compensacao Financeira de Recursos Hidricos",
  "710000000": "Transferencia Especial dos Estados",
  "711000000": "Demais Transferencias Obrigatorias nao Decorrentes de Reparticoes de Receitas",
  "712000000": "Transferencias Fundo a Fundo de Recursos do Fundo Penitenciario - FUNPEN",
  "713000000": "Transferencias Fundo a Fundo de Recursos do Fundo de Seguranca Publica - FSP",
  "714000000": "Transferencias Fundo a Fundo de Recursos do Fundo de Amparo ao Trabalhador - FAT",
  "715000000": "Transferencias Destinadas ao Setor Cultural - LC no 195/2022 - Art. 5o - Audiovisual",
  "716000000": "Transferencias Destinadas ao Setor cultural - LC no 195/2022 - Art. 8o - Demais Setores da Cultura",
  "717000000": "Assistencia Financeira Transporte Coletivo - Art. 5o, Inciso IV, EC no 123/2022",
  "718000000": "Auxilio Financeiro - Outorga Credito Tributario ICMS - Art. 5o, Inciso V, EC no 123/2022",
  "718100100": "Auxilio Financeiro  Outorga Credito Tributario ICMS  Art. 5o, Inciso V, EC no 123/2022  Educacao",
  "719000000": "Transferencias da Politica Nacional Aldir Blanc de Fomento a Cultura - Lei no 14.399/202",
  "720000000": "Transferencias da Uniao Referentes as participacoes na exploracao de Petroleo e Gas Natural destinadas ao FEP - Lei 9.478/1997",
  "721000000": "Transferencias da Uniao Referentes a Cessao Onerosa de Petroleo  Lei no 13.885/2019",
  "722000000": "Transferencias do Fundo de Equalizacao Federativa (FEF)  LC no 212/2025  Propag (Portaria STN/MF no 1.701/2025)",
  "747000000": "Outras vinculacoes de transferencias da Uniao",
  "748000000": "Outras vinculacoes de transferencias dos Estados",
  "749000000": "Outras vinculacoes de transferencias",
  "749000001": "Transferencia de Recursos do Fundo Nacional de Habitacao de Interesse Social FNHIS",
  "750000000": "Recursos da Contribuicao de Intervencao no Dominio Economico - CIDE",
  "751000000": "Recursos da Contribuicao para o Custeio do Servico de Iluminacao Publica - COSIP",
  "752000000": "Recursos Vinculados ao Transito",
  "753000000": "Recursos Provenientes de Taxas, Contribuicoes e Precos Publicos",
  "754000000": "Recursos de Operacoes de Credito",
  "755000000": "Recursos de Alienacao de Bens/Ativos - Administracao Direta",
  "756000000": "Recursos de Alienacao de Bens/Ativos - Administracao Indireta",
  "757000000": "Recursos de depositos judiciais  Lides das quais o ente faz parte",
  "758000000": "Recursos de depositos judiciais  Lides das quais o ente nao faz parte",
  "759000000": "Recursos vinculados a fundos",
  "760000000": "Recursos de Emolumentos, Taxas e Custas",
  "761000000": "Recursos Vinculados ao Fundo de Combate e Erradicacao da Pobreza",
  "762000000": "Recursos de Alienacao de Ativos - Cessao de Direitos Creditorios.",
  "763000000": "Recursos proprios dos estados vinculados ao Propag  LC no 212/202",
  "799000000": "Outras vinculacoes legais",
  "800111101": "Beneficios previdenciarios - Poder Executivo  Fundo em Capitalizacao (Plano Previdenciario)",
  "800111102": "Beneficios previdenciarios - Poder Executivo  Fundo em Capitalizacao (Plano Previdenciario) - Compensacao Financeira",
  "800112101": "Beneficios previdenciarios - Poder Legislativo  Fundo em Capitalizacao (Plano Previdenciario)",
  "800112102": "Beneficios previdenciarios - Poder Legislativo  Fundo em Capitalizacao (Plano Previdenciario) - Compensacao Financeira",
  "801211101": "Beneficios previdenciarios - Poder Executivo - Fundo em Reparticao (Plano Financeiro)",
  "801211102": "Beneficios previdenciarios - Poder Executivo - Fundo em Reparticao (Plano Financeiro) - Compensacao Financeira",
  "801212101": "Beneficios previdenciarios - Poder Legislativo - Fundo em Reparticao (Plano Financeiro)",
  "801212102": "Beneficios previdenciarios - Poder Legislativo - Fundo em Reparticao (Plano Financeiro) - Compensacao Financeira",
  "802000000": "Recursos vinculados ao RPPS - Taxa de Administracao",
  "803000000": "Recursos vinculados ao Sistema de Protecao Social dos Militares (SPSM)",
  "804000000": "Demais Recursos Previdenciarios",
  "860000000": "Recursos extraorcamentarios vinculados a precatorios",
  "861000000": "Recursos extraorcamentarios vinculados a depositos judiciais",
  "862000000": "Recursos de Depositos de Terceiros",
  "863000000": "Recursos a distribuir  Comite Gestor IBS",
  "869000000": "Outros recursos extraorcamentarios",
  "880000000": "Recursos proprios dos consorcios",
  "899000000": "Outros Recursos Vinculados",
  "899000001": "Recursos Destinados aos Direitos da Crianca e do Adolescente",
  "899000002": "Recursos Destinados ao Meio Ambiente",
};

const modules = {
  contracts: {
    label: "Contratos",
    endpoint: "contratos",
    title: "Contratos encontrados",
    columns: [
      ["numero_contrato", "Contrato"],
      ["data_contrato", "Data"],
      ["numero_processo_adm", "Processo"],
      ["descricao_objeto_contrato", "Objeto"],
      ["nome_fiscal_contrato", "Fiscal"],
      ["valor_total_contrato", "Valor"],
    ],
  },
  expenses: {
    label: "Despesas",
    title: "Despesas encontradas",
    columns: [
      ["numero_empenho", "Empenho"],
      ["numero_nota_pagamento", "Pagamento"],
      ["data_nota_pagamento", "Data pagamento"],
      ["nome_negociante", "Credor"],
      ["numero_documento_negociante", "CNPJ/CPF"],
      ["valor_pagamento_resultado", "Valor"],
      ["codigo_fonte_resultado", "Fonte"],
      ["nome_fonte_resultado", "Nome da fonte"],
      ["data_referencia_doc", "Referencia"],
    ],
  },
  works: {
    label: "Obras",
    title: "Obras encontradas",
    columns: [
      ["numero_contrato", "Contrato"],
      ["data_inicio_obra", "Inicio"],
      ["data_fim_obra", "Fim"],
      ["numero_obra", "Obra"],
      ["descricao_obra_servico", "Descricao"],
      ["valor_total_obra", "Valor"],
    ],
  },
  payroll: {
    label: "Folha",
    title: "Folhas encontradas",
    columns: [
      ["data_referencia_doc", "Referencia"],
      ["data_competencia_resultado", "Competencia"],
      ["tipo_folha", "Tipo"],
      ["codigo_orgao", "Orgao"],
      ["nome_orgao_resultado", "Secretaria"],
      ["codigo_unidade_orcamentaria", "Unidade"],
      ["nome_unidade_resultado", "Nome unidade"],
      ["nome_servidor_resultado", "Servidor"],
      ["cpf_servidor_resultado", "CPF"],
      ["codigo_vinculo", "Vinculo"],
      ["valor_resultado", "Valor"],
    ],
  },
  revenues: {
    label: "Receitas",
    title: "Receitas encontradas",
    columns: [
      ["numero_talao_receita", "Talao"],
      ["data_talao_receita", "Data"],
      ["codigo_rubrica", "Rubrica"],
      ["codigo_fonte", "Fonte"],
      ["valor_receita", "Valor"],
      ["nome_razao_contribuinte", "Contribuinte"],
      ["numero_doc_contribuinte", "CNPJ/CPF"],
      ["historico_receita", "Historico"],
      ["data_referencia_doc", "Referencia"],
    ],
  },
  bids: {
    label: "Licitacoes",
    title: "Processos licitatorios encontrados",
    columns: [
      ["numero_licitacao", "Licitacao"],
      ["data_realizacao_autuacao_licitacao", "Data"],
      ["modalidade_licitacao", "Modalidade"],
      ["tipo_licitacao", "Tipo"],
      ["descricao_objeto_licitacao", "Objeto"],
      ["valor_orcado_estimado", "Valor estimado"],
      ["nome_responsavel_homologacao", "Responsavel"],
      ["data_homologacao", "Homologacao"],
      ["data_referencia_doc", "Referencia"],
    ],
  },
};

const endpointLabels = {
  notas_empenhos: "Notas de empenhos",
  liquidacoes: "Liquidacoes",
  notas_pagamentos: "Notas de pagamentos",
  notas_fiscais: "Notas fiscais",
  itens_notas_fiscais: "Itens de notas fiscais",
  obras_municipais_servicos_engenharia: "Obras e servicos",
  medicoes_obras_municipio: "Medicoes",
  status_obras_servico_engenharia: "Status",
  folhas_pagamentos: "Resumo da folha",
  agentes_publicos_folha: "Servidores na folha",
  agentes_publicos_municipais: "Cadastro de servidores",
  notas_pagamentos_folhas: "Pagamentos de folhas",
  liquidacoes_folha: "Liquidacoes de folha",
  liquidacoes_inss: "Liquidacoes de INSS",
  taloes_receitas_orcamentarias: "Receita orcamentaria",
  anulacoes_taloes_receitas_orcamentarias: "Anulacao de receita orcamentaria",
  taloes_receitas_extras_orcamentarias: "Receita extraorcamentaria",
  anulacoes_taloes_receitas_extras_orcamentarias: "Anulacao de receita extraorcamentaria",
  processos_administrativos_contratacoes: "Processo licitatorio",
  publicacoes_processos_administrativos_contratacoes: "Publicacoes",
  licitantes_fornecedores_bens_servicos: "Licitantes e fornecedores",
  itens_compoem_bens_servicos: "Itens",
  dotacoes_utilizadas_contratacoes: "Dotacoes utilizadas",
  identificacao_responsaveis_contratacao: "Responsaveis",
  tipos_responsaveis_contratacao: "Tipos de responsavel",
};

const state = {
  module: "contracts",
  rows: [],
  filteredRows: [],
  columnFilters: {},
  municipalities: new Map(),
  payrollLookups: {
    agencies: new Map(),
    units: new Map(),
    servers: new Map(),
    serverLinks: new Map(),
  },
  currentUrl: "",
  lastQuery: null,
  lastData: null,
};

const el = {
  apiStatus: document.querySelector("#apiStatus"),
  tabs: document.querySelectorAll(".module-tab"),
  municipality: document.querySelector("#municipality"),
  startDate: document.querySelector("#startDate"),
  endDate: document.querySelector("#endDate"),
  fiscalYear: document.querySelector("#fiscalYear"),
  referenceMonth: document.querySelector("#referenceMonth"),
  referenceEndMonth: document.querySelector("#referenceEndMonth"),
  creditorDocument: document.querySelector("#creditorDocument"),
  creditorName: document.querySelector("#creditorName"),
  expenseNumber: document.querySelector("#expenseNumber"),
  worksYear: document.querySelector("#worksYear"),
  payrollYear: document.querySelector("#payrollYear"),
  payrollReferenceMonth: document.querySelector("#payrollReferenceMonth"),
  payrollReferenceEndMonth: document.querySelector("#payrollReferenceEndMonth"),
  payrollCompetenceMonth: document.querySelector("#payrollCompetenceMonth"),
  payrollCompetenceEndMonth: document.querySelector("#payrollCompetenceEndMonth"),
  payrollType: document.querySelector("#payrollType"),
  payrollAgency: document.querySelector("#payrollAgency"),
  payrollUnit: document.querySelector("#payrollUnit"),
  payrollBond: document.querySelector("#payrollBond"),
  payrollServerDocument: document.querySelector("#payrollServerDocument"),
  payrollServerName: document.querySelector("#payrollServerName"),
  revenueYear: document.querySelector("#revenueYear"),
  revenueReferenceMonth: document.querySelector("#revenueReferenceMonth"),
  revenueReferenceEndMonth: document.querySelector("#revenueReferenceEndMonth"),
  revenueAgency: document.querySelector("#revenueAgency"),
  revenueUnit: document.querySelector("#revenueUnit"),
  revenueEndpoint: document.querySelector("#revenueEndpoint"),
  bidsEndpoint: document.querySelector("#bidsEndpoint"),
  expenseEndpoint: document.querySelector("#expenseEndpoint"),
  worksEndpoint: document.querySelector("#worksEndpoint"),
  payrollEndpoint: document.querySelector("#payrollEndpoint"),
  textSearch: document.querySelector("#textSearch"),
  pageSize: document.querySelector("#pageSize"),
  startIndex: document.querySelector("#startIndex"),
  searchButton: document.querySelector("#searchButton"),
  resetButton: document.querySelector("#resetButton"),
  exportButton: document.querySelector("#exportButton"),
  previousButton: document.querySelector("#previousButton"),
  nextButton: document.querySelector("#nextButton"),
  moduleLabel: document.querySelector("#moduleLabel"),
  resultsTitle: document.querySelector("#resultsTitle"),
  summaryRow: document.querySelector("#summaryRow"),
  tableHead: document.querySelector("#tableHead"),
  tableBody: document.querySelector("#tableBody"),
  tableFoot: document.querySelector("#tableFoot"),
  detailDialog: document.querySelector("#detailDialog"),
  detailTitle: document.querySelector("#detailTitle"),
  detailContent: document.querySelector("#detailContent"),
  closeDialog: document.querySelector("#closeDialog"),
};

function setStatus(message) {
  el.apiStatus.textContent = message;
}

function repairText(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!/[ÃÂ]/.test(trimmed)) return trimmed;
  try {
    const bytes = Uint8Array.from([...trimmed].map((char) => char.charCodeAt(0) & 255));
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    return trimmed;
  }
}

function displayValue(value, key = "") {
  const fixed = repairText(value);
  if (fixed === null || fixed === undefined || fixed === "") return "-";
  const textValue = String(fixed);
  if (/^\d{6}$/.test(textValue) && /referencia|competencia/i.test(key)) {
    return `${textValue.slice(4, 6)}/${textValue.slice(0, 4)}`;
  }
  if (typeof fixed === "number") {
    if (/valor|preco|total|saldo|quantidade/i.test(key)) return formatMoney(fixed);
    return String(fixed);
  }
  if (typeof fixed === "string" && /^\d{4}-\d{2}-\d{2}T/.test(fixed)) {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(fixed));
  }
  return String(fixed);
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function normalizeYear(year) {
  if (!year) return "";
  return `${year}00`;
}

function monthToReference(month) {
  if (!month) return "";
  const [year, value] = month.split("-");
  return `${year}${value}`;
}

function toApiDate(value) {
  // A API (DV_CONTRATOS / DV_OBRAS) rejeita o formato ISO "aaaa-mm-dd" que
  // o <input type="date"> sempre produz, com "Error parsing date ...".
  // Ela espera o formato compacto "aaaammdd", sem separadores.
  return value ? value.replaceAll("-", "") : "";
}

function referenceToMonth(reference) {
  const value = String(reference || "");
  return /^\d{6}$/.test(value) ? `${value.slice(0, 4)}-${value.slice(4, 6)}` : "";
}

function formatMonthRangeLabel(months) {
  if (!months.length) return "";
  const first = monthToReference(months[0]);
  const last = monthToReference(months[months.length - 1]);
  const firstLabel = displayValue(first, "data_referencia_doc");
  const lastLabel = displayValue(last, "data_referencia_doc");
  return first === last ? firstLabel : `${firstLabel} a ${lastLabel}`;
}

function getMonthRange(startMonth, endMonth = startMonth) {
  if (!startMonth) return [];
  const [startYear, startValue] = startMonth.split("-").map(Number);
  const [endYear, endValue] = (endMonth || startMonth).split("-").map(Number);
  const start = startYear * 12 + startValue;
  const end = endYear * 12 + endValue;
  if (!startYear || !startValue || !endYear || !endValue || end < start) return [];
  const months = [];
  for (let cursor = start; cursor <= end; cursor += 1) {
    const year = Math.floor((cursor - 1) / 12);
    const month = ((cursor - 1) % 12) + 1;
    months.push(`${year}-${String(month).padStart(2, "0")}`);
  }
  return months;
}

function getPayrollReferenceMonths() {
  return getMonthRange(el.payrollReferenceMonth.value, el.payrollReferenceEndMonth.value);
}

function getExpenseReferenceMonths() {
  return getMonthRange(el.referenceMonth.value, el.referenceEndMonth.value);
}

function getRevenueReferenceMonths() {
  return getMonthRange(el.revenueReferenceMonth.value, el.revenueReferenceEndMonth.value);
}

function getPayrollCompetenceMonths() {
  if (!el.payrollCompetenceMonth.value) return [];
  return getMonthRange(el.payrollCompetenceMonth.value, el.payrollCompetenceEndMonth.value || el.payrollCompetenceMonth.value);
}

function getPageSizeValue() {
  return el.pageSize.value === "all" ? String(API_PAGE_LIMIT) : el.pageSize.value;
}

function isFetchingAllPages() {
  return el.pageSize.value === "all";
}

function hasNextPage(data) {
  return (data.links || []).some((link) => link.rel === "next");
}

function isPayrollCodeFilter(value) {
  const term = String(value || "").trim();
  return /^[A-Za-z0-9]{1,4}$/.test(term);
}

function getActiveEndpoint() {
  if (state.module === "expenses") return el.expenseEndpoint.value;
  if (state.module === "works") return el.worksEndpoint.value;
  if (state.module === "payroll") return el.payrollEndpoint.value;
  if (state.module === "revenues") return el.revenueEndpoint.value;
  if (state.module === "bids") return el.bidsEndpoint.value;
  return modules[state.module].endpoint;
}

function getApiEndpoint() {
  const endpoint = getActiveEndpoint();
  if (endpoint === "liquidacoes_folha" || endpoint === "liquidacoes_inss") return "liquidacoes";
  return endpoint;
}

function getColumns() {
  const adaptiveModules = ["expenses", "works", "payroll", "revenues", "bids"];
  if (!adaptiveModules.includes(state.module)) {
    return modules[state.module].columns;
  }
  const first = state.filteredRows[0] || state.rows[0] || {};
  const preferred =
    state.module === "expenses"
      ? modules.expenses.columns
      : state.module === "works"
        ? modules.works.columns
        : state.module === "revenues"
          ? modules.revenues.columns
          : state.module === "bids"
            ? modules.bids.columns
            : getPayrollColumns();
  const existing = preferred.filter(([key]) => key in first);
  if (state.module === "expenses") return preferred;
  if (state.module === "payroll" && existing.length >= 4) return existing;
  if (existing.length >= 3) return existing;
  return Object.keys(first)
    .slice(0, 6)
    .map((key) => [key, labelize(key)]);
}

function getPayrollColumns() {
  const endpoint = getActiveEndpoint();
  if (endpoint === "liquidacoes_folha" || endpoint === "liquidacoes_inss") {
    return [
      ["data_referencia_doc", "Referencia"],
      ["data_liquidacao", "Liquidacao"],
      ["numero_empenho", "Empenho"],
      ["codigo_orgao", "Orgao"],
      ["nome_orgao_resultado", "Secretaria"],
      ["codigo_unidade_orcamentaria", "Unidade"],
      ["nome_unidade_resultado", "Nome unidade"],
      ["nome_negociante", "Credor"],
      ["valor_resultado", "Valor"],
      ["codigo_fonte_resultado", "Fonte"],
      ["nome_fonte_resultado", "Nome da fonte"],
      ["descricao_historico_empenho", "Historico"],
    ];
  }
  return modules.payroll.columns;
}

function labelize(key) {
  return key.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildUrl(startIndex = Number(el.startIndex.value || 0), countOverride = "", overrides = {}) {
  const endpoint = getApiEndpoint();
  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set("$format", "json");
  url.searchParams.set("$count", countOverride || getPageSizeValue());
  url.searchParams.set("$start_index", String(Math.max(0, startIndex)));

  if (el.municipality.value) url.searchParams.set("codigo_municipio", el.municipality.value);

  if (state.module === "contracts") {
    if (el.startDate.value) url.searchParams.set("data_inicio", toApiDate(el.startDate.value));
    if (el.endDate.value) url.searchParams.set("data_fim", toApiDate(el.endDate.value));
  }

  if (state.module === "expenses") {
    const year = normalizeYear(el.fiscalYear.value);
    const reference = overrides.expenseReference || monthToReference(el.referenceMonth.value);
    if (year) url.searchParams.set("exercicio_orcamento", year);
    if (reference) url.searchParams.set("data_referencia_doc", reference);
  }

  if (state.module === "works") {
    const year = normalizeYear(el.worksYear.value);
    if (year) url.searchParams.set("exercicio_orcamento", year);
    if (el.startDate.value) url.searchParams.set("data_inicio", toApiDate(el.startDate.value));
    if (el.endDate.value) url.searchParams.set("data_fim", toApiDate(el.endDate.value));
  }

  if (state.module === "payroll") {
    const year = normalizeYear(el.payrollYear.value);
    const reference = overrides.payrollReference || monthToReference(el.payrollReferenceMonth.value);
    if (year) url.searchParams.set("exercicio_orcamento", year);
    if (reference) url.searchParams.set("data_referencia_doc", reference);
    if (isPayrollCodeFilter(el.payrollAgency.value)) {
      url.searchParams.set("codigo_orgao", el.payrollAgency.value.trim());
    }
    if (isPayrollCodeFilter(el.payrollUnit.value)) {
      url.searchParams.set("codigo_unidade_orcamentaria", el.payrollUnit.value.trim());
    }
  }

  if (state.module === "revenues") {
    const year = normalizeYear(el.revenueYear.value);
    const reference = overrides.revenueReference || monthToReference(el.revenueReferenceMonth.value);
    if (year) url.searchParams.set("exercicio_orcamento", year);
    if (reference) url.searchParams.set("data_referencia_doc", reference);
    if (el.revenueAgency.value.trim()) url.searchParams.set("codigo_orgao", el.revenueAgency.value.trim());
    if (el.revenueUnit.value.trim()) url.searchParams.set("codigo_unidade_orcamentaria", el.revenueUnit.value.trim());
  }

  if (state.module === "bids") {
    if (el.startDate.value) url.searchParams.set("data_inicio", toApiDate(el.startDate.value));
    if (el.endDate.value) url.searchParams.set("data_fim", toApiDate(el.endDate.value));
  }

  return url;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

async function loadMunicipalities() {
  setStatus("Carregando municipios");
  const url = new URL(`${API_BASE}/municipios`);
  url.searchParams.set("$format", "json");
  url.searchParams.set("$count", "300");
  const data = await fetchJson(url);
  const rows = data.elements || [];
  for (const item of rows) {
    if (item.codigo_municipio && item.nome_municipio) {
      state.municipalities.set(item.codigo_municipio, repairText(item.nome_municipio));
    }
  }
  const options = rows
    .filter((item) => item.codigo_municipio && item.nome_municipio)
    .map((item) => {
      const option = document.createElement("option");
      option.value = item.codigo_municipio;
      option.textContent = `${item.codigo_municipio} - ${repairText(item.nome_municipio)}`;
      return option;
    });
  el.municipality.append(...options);
  setStatus("Pronto");
}

async function runSearch(startIndex = Number(el.startIndex.value || 0)) {
  const validationMessage = validateSearch();
  if (validationMessage) {
    renderNotice(validationMessage);
    return;
  }
  const fetchAllPages = isFetchingAllPages();
  const useExpandedExpenseSearch =
    !fetchAllPages && state.module === "expenses" && hasExpenseAdvancedFilters() && startIndex === 0;
  const url = buildUrl(startIndex, fetchAllPages || useExpandedExpenseSearch ? String(API_PAGE_LIMIT) : "");
  state.currentUrl = url.toString();
  state.lastQuery = { startIndex };
  el.startIndex.value = String(startIndex);
  setStatus(fetchAllPages ? "Buscando todos" : useExpandedExpenseSearch ? "Busca ampliada" : "Buscando");
  toggleLoading(true);
  try {
    const result =
      state.module === "payroll"
        ? await fetchPayrollRangeRows(startIndex, fetchAllPages)
        : state.module === "revenues"
          ? await fetchRevenueRangeRows(startIndex, fetchAllPages)
          : state.module === "expenses"
            ? await fetchExpenseRangeRows(url, startIndex, fetchAllPages, useExpandedExpenseSearch)
            : await fetchSingleSearchRows(url, startIndex, fetchAllPages, useExpandedExpenseSearch);
    const data = result.data;
    state.lastData = data;
    let rows = result.rows;
    state.rows = rows;
    if (state.module === "expenses") {
      state.rows = await enrichExpenseRows(state.rows);
    }
    if (state.module === "payroll") {
      await loadPayrollLookups();
      state.rows = await enrichPayrollRows(state.rows);
    }
    applyTextFilter();
    renderSummary(data);
    renderTable();
    el.nextButton.disabled = fetchAllPages || useExpandedExpenseSearch || !hasNextPage(data);
    el.previousButton.disabled = fetchAllPages || startIndex <= 0;
    el.exportButton.disabled = state.filteredRows.length === 0;
    setStatus("Pronto");
  } catch (error) {
    renderError(error);
    setStatus("Erro");
  } finally {
    toggleLoading(false);
  }
}

async function fetchSingleSearchRows(url, startIndex, fetchAllPages, useExpandedExpenseSearch) {
  const data = await fetchJson(url);
  let rows = (data.elements || []).map(normalizeRow);
  if (fetchAllPages) {
    rows = await fetchAllRows(rows, data, startIndex, API_PAGE_LIMIT);
  } else if (useExpandedExpenseSearch) {
    rows = await fetchExpandedExpenseRows(rows, data, API_PAGE_LIMIT);
  }
  return { data, rows };
}

async function fetchExpenseRangeRows(url, startIndex, fetchAllPages, useExpandedExpenseSearch) {
  const referenceMonths = getExpenseReferenceMonths();
  if (referenceMonths.length <= 1) {
    return fetchSingleSearchRows(url, startIndex, fetchAllPages, useExpandedExpenseSearch);
  }

  const references = referenceMonths.map(monthToReference);
  const allRows = [];
  let firstData = null;
  let anyNext = false;

  for (const reference of references) {
    setStatus(`Buscando ${displayValue(reference, "data_referencia_doc")}`);
    const currentUrl = buildUrl(
      startIndex,
      fetchAllPages || useExpandedExpenseSearch ? String(API_PAGE_LIMIT) : "",
      { expenseReference: reference },
    );
    const data = await fetchJson(currentUrl);
    if (!firstData) firstData = data;
    let rows = (data.elements || []).map(normalizeRow);
    if (fetchAllPages) {
      rows = await fetchAllRows(rows, data, startIndex, API_PAGE_LIMIT, { expenseReference: reference });
    } else if (useExpandedExpenseSearch) {
      rows = await fetchExpandedExpenseRows(rows, data, API_PAGE_LIMIT, { expenseReference: reference });
    } else {
      anyNext = anyNext || hasNextPage(data);
    }
    allRows.push(...rows);
  }

  return {
    data: {
      ...(firstData || { elements: [], links: [] }),
      elements: allRows,
      links: anyNext ? [{ rel: "next" }] : [],
      rangeReferences: references,
    },
    rows: allRows,
  };
}

async function fetchPayrollRangeRows(startIndex, fetchAllPages) {
  const referenceMonths = getPayrollReferenceMonths();
  const references = referenceMonths.length
    ? referenceMonths.map(monthToReference)
    : [monthToReference(el.payrollReferenceMonth.value)].filter(Boolean);
  const allRows = [];
  let firstData = null;
  let anyNext = false;

  for (const reference of references) {
    setStatus(`Buscando ${displayValue(reference, "data_referencia_doc")}`);
    const url = buildUrl(startIndex, fetchAllPages ? String(API_PAGE_LIMIT) : "", { payrollReference: reference });
    const data = await fetchJson(url);
    if (!firstData) firstData = data;
    let rows = (data.elements || []).map(normalizeRow);
    if (fetchAllPages) {
      rows = await fetchAllRows(rows, data, startIndex, API_PAGE_LIMIT, { payrollReference: reference });
    } else {
      anyNext = anyNext || hasNextPage(data);
    }
    allRows.push(...rows);
  }

  return {
    data: {
      ...(firstData || { elements: [], links: [] }),
      elements: allRows,
      links: anyNext ? [{ rel: "next" }] : [],
      rangeReferences: references,
    },
    rows: allRows,
  };
}

async function fetchRevenueRangeRows(startIndex, fetchAllPages) {
  const referenceMonths = getRevenueReferenceMonths();
  const references = referenceMonths.length
    ? referenceMonths.map(monthToReference)
    : [monthToReference(el.revenueReferenceMonth.value)].filter(Boolean);
  const allRows = [];
  let firstData = null;
  let anyNext = false;

  for (const reference of references) {
    setStatus(`Buscando ${displayValue(reference, "data_referencia_doc")}`);
    const url = buildUrl(startIndex, fetchAllPages ? String(API_PAGE_LIMIT) : "", { revenueReference: reference });
    const data = await fetchJson(url);
    if (!firstData) firstData = data;
    let rows = (data.elements || []).map(normalizeRow);
    if (fetchAllPages) {
      rows = await fetchAllRows(rows, data, startIndex, API_PAGE_LIMIT, { revenueReference: reference });
    } else {
      anyNext = anyNext || hasNextPage(data);
    }
    allRows.push(...rows);
  }

  return {
    data: {
      ...(firstData || { elements: [], links: [] }),
      elements: allRows,
      links: anyNext ? [{ rel: "next" }] : [],
      rangeReferences: references,
    },
    rows: allRows,
  };
}

async function fetchExpandedExpenseRows(initialRows, firstData, pageSize, overrides = {}) {
  const rows = [...initialRows];
  let hasNext = hasNextPage(firstData);
  let page = 1;
  while (hasNext && page < EXPENSE_FILTER_PAGE_LIMIT) {
    const nextUrl = buildUrl(page * pageSize, String(pageSize), overrides);
    const data = await fetchJson(nextUrl);
    rows.push(...(data.elements || []).map(normalizeRow));
    hasNext = hasNextPage(data);
    page += 1;
  }
  return rows;
}

async function fetchAllRows(initialRows, firstData, startIndex, pageSize, overrides = {}) {
  const rows = [...initialRows];
  let hasNext = hasNextPage(firstData);
  let page = 1;
  while (hasNext) {
    setStatus(`Carregando ${rows.length} registros`);
    const nextUrl = buildUrl(startIndex + page * pageSize, String(pageSize), overrides);
    const data = await fetchJson(nextUrl);
    rows.push(...(data.elements || []).map(normalizeRow));
    hasNext = hasNextPage(data);
    page += 1;
  }
  return rows;
}

function hasExpenseAdvancedFilters() {
  return Boolean(
    state.module === "expenses" &&
      ((el.creditorDocument?.value || "").trim() ||
        (el.creditorName?.value || "").trim() ||
        (el.expenseNumber?.value || "").trim()),
  );
}

async function loadPayrollLookups() {
  state.payrollLookups = {
    agencies: new Map(),
    units: new Map(),
    servers: new Map(),
    serverLinks: new Map(),
  };
  if (!el.municipality.value || !el.payrollYear.value) return;

  try {
    setStatus("Carregando secretarias");
    const year = normalizeYear(el.payrollYear.value);
    const agenciesUrl = new URL(`${API_BASE}/orgaos`);
    agenciesUrl.searchParams.set("$format", "json");
    agenciesUrl.searchParams.set("$count", "1000");
    agenciesUrl.searchParams.set("$start_index", "0");
    agenciesUrl.searchParams.set("codigo_municipio", el.municipality.value);
    agenciesUrl.searchParams.set("exercicio_orcamento", year);
    const unitsUrl = new URL(`${API_BASE}/unidades_orcamentarias`);
    unitsUrl.searchParams.set("$format", "json");
    unitsUrl.searchParams.set("$count", "1000");
    unitsUrl.searchParams.set("$start_index", "0");
    unitsUrl.searchParams.set("codigo_municipio", el.municipality.value);
    unitsUrl.searchParams.set("exercicio_orcamento", year);
    const shouldLoadServers = getActiveEndpoint() === "agentes_publicos_folha";
    const [agenciesData, unitsData] = await Promise.all([
      fetchJson(agenciesUrl),
      fetchJson(unitsUrl),
    ]);

    for (const agency of agenciesData.elements || []) {
      if (agency.codigo_orgao) {
        state.payrollLookups.agencies.set(trimCode(agency.codigo_orgao), repairText(agency.nome_orgao || ""));
      }
    }
    for (const unit of unitsData.elements || []) {
      const key = payrollUnitKey(unit.codigo_orgao, unit.codigo_unidade_orcamentaria);
      if (key) state.payrollLookups.units.set(key, repairText(unit.nome_unidade || ""));
    }

    if (shouldLoadServers) {
      for (const reference of getPayrollReferenceMonths().map(monthToReference)) {
        const firstServersData = await fetchPayrollServersPage(reference, 0);
        const serverRows = await fetchAllPayrollServerRows(
          (firstServersData.elements || []).map(normalizeRow),
          firstServersData,
          reference,
        );
        for (const server of serverRows) {
          addPayrollServerLookup(server);
        }
      }
    }
  } catch {
    state.payrollLookups = {
      agencies: new Map(),
      units: new Map(),
      servers: new Map(),
      serverLinks: new Map(),
    };
  }
}

async function fetchPayrollServersPage(reference, startIndex) {
  const url = new URL(`${API_BASE}/agentes_publicos_municipais`);
  url.searchParams.set("$format", "json");
  url.searchParams.set("$count", String(API_PAGE_LIMIT));
  url.searchParams.set("$start_index", String(startIndex));
  url.searchParams.set("codigo_municipio", el.municipality.value);
  url.searchParams.set("exercicio_orcamento", normalizeYear(el.payrollYear.value));
  url.searchParams.set("data_referencia_doc", reference);
  if (isPayrollCodeFilter(el.payrollAgency.value)) {
    url.searchParams.set("codigo_orgao", el.payrollAgency.value.trim());
  }
  if (isPayrollCodeFilter(el.payrollUnit.value)) {
    url.searchParams.set("codigo_unidade_orcamentaria", el.payrollUnit.value.trim());
  }
  return fetchJson(url);
}

async function fetchAllPayrollServerRows(initialRows, firstData, reference) {
  const rows = [...initialRows];
  let hasNext = hasNextPage(firstData);
  let page = 1;
  while (hasNext) {
    const data = await fetchPayrollServersPage(reference, page * API_PAGE_LIMIT);
    rows.push(...(data.elements || []).map(normalizeRow));
    hasNext = hasNextPage(data);
    page += 1;
  }
  return rows;
}

function addPayrollServerLookup(server) {
  const document = getPayrollDocumentKey(server.cpf_servidor || server.cpf_agente || "");
  const name = repairText(server.nome_servidor || server.nome_agente || "");
  if (!name) return;
  const bond = trimCode(server.codigo_vinculo);
  const ingress = trimCode(server.codigo_ingresso);
  const agency = trimCode(server.codigo_orgao);
  const unit = trimCode(server.codigo_unidade_orcamentaria);
  if (document) {
    [
      document,
      [document, bond].join("|"),
      [document, ingress, bond].join("|"),
      [document, agency, unit].join("|"),
      [document, agency, unit, ingress, bond].join("|"),
    ].forEach((key) => {
      if (key && !state.payrollLookups.servers.has(key)) {
        state.payrollLookups.servers.set(key, name);
      }
    });
  }
  addUniquePayrollServerLink(payrollServerLinkKey(server), name);
}

function addUniquePayrollServerLink(key, name) {
  if (!key || !name) return;
  if (!state.payrollLookups.serverLinks.has(key)) {
    state.payrollLookups.serverLinks.set(key, name);
    return;
  }
  if (state.payrollLookups.serverLinks.get(key) !== name) {
    state.payrollLookups.serverLinks.set(key, "");
  }
}

function payrollServerLinkKey(row) {
  const parts = [
    trimCode(row.codigo_orgao),
    trimCode(row.codigo_unidade_orcamentaria),
    trimCode(row.codigo_ingresso),
    trimCode(row.codigo_vinculo),
    String(row.numero_expediente_nomeacao || "").trim().toLocaleLowerCase("pt-BR"),
  ];
  return parts.every(Boolean) ? parts.join("|") : "";
}

async function enrichPayrollRows(rows) {
  const endpoint = getActiveEndpoint();
  const enriched = rows.map((row) => ({
    ...row,
    codigo_orgao: trimCode(row.codigo_orgao),
    codigo_unidade_orcamentaria: trimCode(row.codigo_unidade_orcamentaria),
    nome_orgao_resultado: state.payrollLookups.agencies.get(trimCode(row.codigo_orgao)) || "",
    nome_unidade_resultado:
      state.payrollLookups.units.get(payrollUnitKey(row.codigo_orgao, row.codigo_unidade_orcamentaria)) || "",
    data_competencia_resultado: getPayrollCompetence(row),
    nome_servidor_resultado: getPayrollServerName(row),
    cpf_servidor_resultado: formatCreditorDocument(getPayrollServerDocument(row)),
    valor_resultado: getPayrollValue(row),
  }));

  if (endpoint === "liquidacoes_folha" || endpoint === "liquidacoes_inss") {
    const withSources = await enrichPayrollLiquidationRows(enriched);
    if (endpoint === "liquidacoes_folha") {
      return withSources.filter((row) => String(row.status_folha) === "1");
    }
    return withSources.filter(isInssLiquidation);
  }

  return enriched;
}

async function enrichPayrollLiquidationRows(rows) {
  if (!rows.length || !el.municipality.value || !el.payrollYear.value) return rows;

  try {
    setStatus("Buscando fontes");
    const references = new Set();
    for (const row of rows) {
      const reference = referenceFromDate(row.data_emissao_empenho);
      if (reference) references.add(reference);
    }
    if (!references.size && el.payrollReferenceMonth.value) {
      getPayrollReferenceMonths().map(monthToReference).forEach((reference) => references.add(reference));
    }

    const empenhos = [];
    for (const reference of references) {
      const url = new URL(`${API_BASE}/notas_empenhos`);
      url.searchParams.set("$format", "json");
      url.searchParams.set("$count", String(API_PAGE_LIMIT));
      url.searchParams.set("$start_index", "0");
      url.searchParams.set("codigo_municipio", el.municipality.value);
      url.searchParams.set("exercicio_orcamento", normalizeYear(el.payrollYear.value));
      url.searchParams.set("data_referencia_doc", reference);
      if (isPayrollCodeFilter(el.payrollAgency.value)) {
        url.searchParams.set("codigo_orgao", el.payrollAgency.value.trim());
      }
      if (isPayrollCodeFilter(el.payrollUnit.value)) {
        url.searchParams.set("codigo_unidade_orcamentaria", el.payrollUnit.value.trim());
      }
      const firstData = await fetchJson(url);
      empenhos.push(...(firstData.elements || []).map(normalizeRow));
      let hasNext = hasNextPage(firstData);
      let page = 1;
      while (hasNext) {
        const nextUrl = new URL(url);
        nextUrl.searchParams.set("$start_index", String(page * API_PAGE_LIMIT));
        const data = await fetchJson(nextUrl);
        empenhos.push(...(data.elements || []).map(normalizeRow));
        hasNext = hasNextPage(data);
        page += 1;
      }
    }

    const byKey = new Map();
    for (const empenho of empenhos) {
      byKey.set(expenseJoinKey(empenho), empenho);
    }

    return rows.map((row) => {
      const empenho = byKey.get(expenseJoinKey(row));
      const merged = empenho
        ? {
            ...row,
            nome_negociante: row.nome_negociante || empenho.nome_negociante,
            descricao_historico_empenho:
              row.descricao_historico_empenho || empenho.descricao_historico_empenho,
            codigo_elemento_despesa: row.codigo_elemento_despesa || empenho.codigo_elemento_despesa,
            tipo_fonte: row.tipo_fonte || empenho.tipo_fonte,
            codigo_fonte: row.codigo_fonte || empenho.codigo_fonte,
            cd_complem_fonte: row.cd_complem_fonte || empenho.cd_complem_fonte,
            codigo_especificacao_fonte:
              row.codigo_especificacao_fonte || empenho.codigo_especificacao_fonte,
            codigo_fonte_recursos: row.codigo_fonte_recursos || empenho.codigo_fonte_recursos,
          }
        : row;
      return {
        ...merged,
        valor_resultado: merged.valor_liquidado ?? merged.valor_resultado,
        codigo_fonte_resultado: formatSourceCode(merged),
        nome_fonte_resultado: getSourceName(merged),
      };
    });
  } catch {
    return rows.map((row) => ({
      ...row,
      valor_resultado: row.valor_liquidado ?? row.valor_resultado,
      codigo_fonte_resultado: formatSourceCode(row),
      nome_fonte_resultado: getSourceName(row),
    }));
  }
}

function isInssLiquidation(row) {
  const text = `${row.nome_negociante || ""} ${row.descricao_historico_empenho || ""}`.toLocaleUpperCase("pt-BR");
  return (
    /\bINSS\b/.test(text) ||
    text.includes("INSTITUTO NACIONAL DA SEGURIDADE SOCIAL") ||
    text.includes("INSTITUTO NACIONAL DE SEGURIDADE SOCIAL")
  );
}

function trimCode(value) {
  return typeof value === "string" ? value.trim() : value;
}

function payrollUnitKey(agency, unit) {
  const agencyCode = trimCode(agency);
  const unitCode = trimCode(unit);
  return agencyCode && unitCode ? `${agencyCode}|${unitCode}` : "";
}

function getPayrollCompetence(row) {
  return row.data_competencia_folha ?? row.data_competencia ?? row.data_referencia_doc ?? "";
}

function getPayrollServerName(row) {
  const existingName = row.nome_servidor || row.nome_agente || row.nome_servidor_responsavel || "";
  if (existingName) return existingName;
  const document = getPayrollDocumentKey(getPayrollServerDocument(row));
  const bond = trimCode(row.codigo_vinculo);
  const ingress = trimCode(row.codigo_ingresso);
  const agency = trimCode(row.codigo_orgao);
  const unit = trimCode(row.codigo_unidade_orcamentaria);
  return (
    (document && state.payrollLookups.servers.get([document, agency, unit, ingress, bond].join("|"))) ||
    (document && state.payrollLookups.servers.get([document, agency, unit].join("|"))) ||
    (document && state.payrollLookups.servers.get([document, ingress, bond].join("|"))) ||
    (document && state.payrollLookups.servers.get([document, bond].join("|"))) ||
    (document && state.payrollLookups.servers.get(document)) ||
    state.payrollLookups.serverLinks.get(payrollServerLinkKey(row)) ||
    ""
  );
}

function getPayrollServerDocument(row) {
  return row.cpf_agente || row.cpf_servidor || row.cpf_servidor_responsavel || row.cpf_ex_servidor || "";
}

function getPayrollDocumentKey(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return onlyDigits(raw) || raw;
}

function getPayrollValue(row) {
  return (
    row.valor_item ??
    row.valor_pagamento_folha ??
    row.valor_liquidado ??
    row.valor_total_item_orc ??
    row.valor_total_extra_orc ??
    ""
  );
}

async function enrichExpenseRows(rows) {
  if (!rows.length) return rows;
  const endpoint = getActiveEndpoint();
  const enriched = rows.map((row) => ({
    ...row,
    valor_pagamento_resultado: getExpenseValue(row),
    codigo_fonte_resultado: formatSourceCode(row),
    nome_fonte_resultado: getSourceName(row),
  }));

  if (endpoint === "notas_empenhos") {
    return enriched.map((row) => ({
      ...row,
      numero_documento_negociante: formatCreditorDocument(row.numero_documento_negociante),
    }));
  }

  const needsCreditor = enriched.some((row) => !row.nome_negociante || !row.numero_documento_negociante);
  if (!needsCreditor || !el.municipality.value || !el.fiscalYear.value || !el.referenceMonth.value) return enriched;

  try {
    setStatus("Completando credores");
    const references = new Set(getExpenseReferenceMonths().map(monthToReference));
    for (const row of enriched) {
      const emittedReference = referenceFromDate(row.data_emissao_empenho);
      if (emittedReference) references.add(emittedReference);
    }
    const empenhos = [];
    for (const reference of references) {
      const url = new URL(`${API_BASE}/notas_empenhos`);
      url.searchParams.set("$format", "json");
      url.searchParams.set("$count", "1000");
      url.searchParams.set("$start_index", "0");
      url.searchParams.set("codigo_municipio", el.municipality.value);
      url.searchParams.set("exercicio_orcamento", normalizeYear(el.fiscalYear.value));
      url.searchParams.set("data_referencia_doc", reference);
      const data = await fetchJson(url);
      empenhos.push(...(data.elements || []).map(normalizeRow));
    }
    const byKey = new Map();
    for (const empenho of empenhos) {
      byKey.set(expenseJoinKey(empenho), empenho);
    }
    return enriched.map((row) => {
      const empenho = byKey.get(expenseJoinKey(row));
      if (!empenho) return row;
      const merged = {
        ...row,
        nome_negociante: row.nome_negociante || empenho.nome_negociante,
        numero_documento_negociante:
          row.numero_documento_negociante || empenho.numero_documento_negociante,
        codigo_tipo_negociante: row.codigo_tipo_negociante || empenho.codigo_tipo_negociante,
        descricao_historico_empenho:
          row.descricao_historico_empenho || empenho.descricao_historico_empenho,
        valor_empenhado: row.valor_empenhado || empenho.valor_empenhado,
        tipo_fonte: row.tipo_fonte || empenho.tipo_fonte,
        codigo_fonte: row.codigo_fonte || empenho.codigo_fonte,
        cd_complem_fonte: row.cd_complem_fonte || empenho.cd_complem_fonte,
      };
      return {
        ...merged,
        numero_documento_negociante: formatCreditorDocument(merged.numero_documento_negociante),
        codigo_fonte_resultado: formatSourceCode(merged),
        nome_fonte_resultado: getSourceName(merged),
      };
    });
  } catch {
    return enriched.map((row) => ({
      ...row,
      numero_documento_negociante: formatCreditorDocument(row.numero_documento_negociante),
    }));
  }
}

function referenceFromDate(value) {
  if (!value || typeof value !== "string") return "";
  const match = value.match(/^(\d{4})-(\d{2})-/);
  return match ? `${match[1]}${match[2]}` : "";
}

function expenseJoinKey(row) {
  return [
    row.codigo_municipio,
    row.exercicio_orcamento,
    row.codigo_orgao,
    String(row.codigo_unidade_orcamentaria || "").trim(),
    row.numero_empenho || row.numero_nota_empenho,
    row.data_emissao_empenho,
  ].join("|");
}

function getExpenseValue(row) {
  return (
    row.valor_nota_pagamento ??
    row.valor_pagamento_folha ??
    row.valor_liquidado ??
    row.valor_liquido ??
    row.valor_bruto ??
    row.valor_empenhado ??
    row.valor_documento_despesa_extra ??
    ""
  );
}

function formatCreditorDocument(value) {
  if (!value) return "";
  const raw = String(value).trim();
  const digits = onlyDigits(raw);
  if (digits.length === 11 || digits.length === 14) return digits;
  if (/^[A-Za-z0-9+/=]{16,}$/.test(raw)) return "Documento protegido";
  return raw;
}

function getSourceBaseCode(row) {
  const code =
    row.codigo_fonte ||
    row.codigo_especificacao_fonte ||
    row.codigo_fonte_recursos ||
    "";
  const digits = onlyDigits(code);
  if (digits.length >= 3) return digits.slice(0, 3);
  return digits;
}

function getSourceFullCode(row) {
  const code =
    row.codigo_fonte ||
    row.codigo_especificacao_fonte ||
    row.codigo_fonte_recursos ||
    "";
  const digits = onlyDigits(code);
  if (digits.length >= 9) return digits.slice(0, 9);
  return "";
}

function formatSourceCode(row) {
  const group = row.tipo_fonte || row.codigo_tipo_fonte || row.codigo_grupo_fonte || row.grupo_fonte || "";
  const source = row.codigo_fonte || row.codigo_especificacao_fonte || row.codigo_fonte_recursos || "";
  const complement = row.cd_complem_fonte || row.codigo_complemento_fonte || "";
  const parts = [group, source, complement].map((part) => String(part || "").trim()).filter(Boolean);
  return parts.join(".");
}

function getSourceName(row) {
  const fullCode = getSourceFullCode(row);
  const baseCode = getSourceBaseCode(row);
  return resourceSources[fullCode] || resourceSources[baseCode] || (baseCode ? "Fonte nao catalogada" : "");
}

function validateSearch() {
  if (state.module === "expenses") {
    if (!el.municipality.value) return "Informe o municipio para consultar despesas.";
    if (!el.fiscalYear.value) return "Informe o exercicio para consultar despesas.";
    if (!el.referenceMonth.value) return "Informe a referencia inicial para consultar despesas.";
    if (!getExpenseReferenceMonths().length) return "Informe um intervalo de referencia valido.";
  }
  if (state.module === "works") {
    if (!el.worksYear.value) return "Informe o exercicio para consultar obras.";
    if (!el.startDate.value || !el.endDate.value) return "Informe inicio e fim para consultar obras.";
  }
  if (state.module === "payroll") {
    if (!el.municipality.value) return "Informe o municipio para consultar folha de pagamento.";
    if (!el.payrollYear.value) return "Informe o exercicio para consultar folha de pagamento.";
    if (!el.payrollReferenceMonth.value) return "Informe a referencia inicial para consultar folha de pagamento.";
    if (!getPayrollReferenceMonths().length) return "Informe um intervalo de referencia valido.";
    if (el.payrollCompetenceMonth.value && !getPayrollCompetenceMonths().length) {
      return "Informe um intervalo de competencia valido.";
    }
  }
  if (state.module === "revenues") {
    if (!el.municipality.value) return "Informe o municipio para consultar receitas.";
    if (!el.revenueYear.value) return "Informe o exercicio para consultar receitas.";
    if (!el.revenueReferenceMonth.value) return "Informe a referencia inicial para consultar receitas.";
    if (!getRevenueReferenceMonths().length) return "Informe um intervalo de referencia valido.";
  }
  if (state.module === "bids") {
    if (!el.municipality.value) return "Informe o municipio para consultar licitacoes.";
    if (!el.startDate.value || !el.endDate.value) return "Informe inicio e fim para consultar licitacoes.";
  }
  return "";
}

function normalizeRow(row) {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, typeof value === "string" ? repairText(value) : value]),
  );
  if (!normalized.numero_documento_negociante && normalized.cpf_cnpj_emitente) {
    normalized.numero_documento_negociante = normalized.cpf_cnpj_emitente;
  }
  if (!normalized.nome_negociante && normalized.nome_credor_despesa_extra) {
    normalized.nome_negociante = normalized.nome_credor_despesa_extra;
  }
  if (!normalized.numero_empenho && normalized.numero_nota_empenho) {
    normalized.numero_empenho = normalized.numero_nota_empenho;
  }
  return normalized;
}

function applyTextFilter() {
  const context = getFilterContext();
  state.filteredRows = state.rows.filter((row) => rowMatchesFilterContext(row, context));
}

function getFilterContext({ omittedColumnKey = "" } = {}) {
  const term = el.textSearch.value.trim().toLocaleLowerCase("pt-BR");
  const columnFilters = Object.entries(state.columnFilters)
    .map(([key, values]) => [key, values instanceof Set ? values : new Set(values || [])])
    .filter(([key]) => key !== omittedColumnKey)
    .filter(([, values]) => values.size > 0);

  return {
    term,
    columnFilters,
    documentTerm: onlyDigits(el.creditorDocument?.value || ""),
    creditorTerm: (el.creditorName?.value || "").trim().toLocaleLowerCase("pt-BR"),
    numberTerm: (el.expenseNumber?.value || "").trim().toLocaleLowerCase("pt-BR"),
    payrollCompetenceTerms: new Set(getPayrollCompetenceMonths().map(monthToReference)),
    payrollTypeTerm: (el.payrollType?.value || "").trim().toLocaleLowerCase("pt-BR"),
    payrollAgencyTerm: (el.payrollAgency?.value || "").trim().toLocaleLowerCase("pt-BR"),
    payrollUnitTerm: (el.payrollUnit?.value || "").trim().toLocaleLowerCase("pt-BR"),
    payrollBondTerm: (el.payrollBond?.value || "").trim().toLocaleLowerCase("pt-BR"),
    payrollDocumentTerm: onlyDigits(el.payrollServerDocument?.value || ""),
    payrollServerTerm: (el.payrollServerName?.value || "").trim().toLocaleLowerCase("pt-BR"),
  };
}

function rowMatchesFilterContext(row, context) {
  const matchesGeneral =
    !context.term ||
    Object.values(row).some((value) =>
      displayValue(value).toLocaleLowerCase("pt-BR").includes(context.term),
    );
  const matchesDocument =
    state.module !== "expenses" ||
    !context.documentTerm ||
    onlyDigits(row.numero_documento_negociante || row.cpf_cnpj_emitente || "").includes(context.documentTerm);
  const matchesCreditor =
    state.module !== "expenses" ||
    !context.creditorTerm ||
    String(row.nome_negociante || row.nome_credor_despesa_extra || row.nome_emitente || "")
      .toLocaleLowerCase("pt-BR")
      .includes(context.creditorTerm);
  const matchesNumber =
    state.module !== "expenses" ||
    !context.numberTerm ||
    [
      row.numero_empenho,
      row.numero_nota_empenho,
      row.numero_nota_pagamento,
      row.numero_documento_caixa,
      row.numero_documento_despesa_extra,
      row.numero_nota_fiscal,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLocaleLowerCase("pt-BR").includes(context.numberTerm));
  const matchesPayrollCompetence =
    state.module !== "payroll" ||
    !context.payrollCompetenceTerms.size ||
    context.payrollCompetenceTerms.has(String(getPayrollCompetence(row)));
  const matchesPayrollType =
    state.module !== "payroll" ||
    !context.payrollTypeTerm ||
    String(row.tipo_folha || "").toLocaleLowerCase("pt-BR").includes(context.payrollTypeTerm);
  const matchesPayrollAgency =
    state.module !== "payroll" ||
    !context.payrollAgencyTerm ||
    [row.codigo_orgao, row.nome_orgao_resultado]
      .filter(Boolean)
      .some((value) => String(value).toLocaleLowerCase("pt-BR").includes(context.payrollAgencyTerm));
  const matchesPayrollUnit =
    state.module !== "payroll" ||
    !context.payrollUnitTerm ||
    [row.codigo_unidade_orcamentaria, row.nome_unidade_resultado]
      .filter(Boolean)
      .some((value) => String(value).toLocaleLowerCase("pt-BR").includes(context.payrollUnitTerm));
  const matchesPayrollBond =
    state.module !== "payroll" ||
    !context.payrollBondTerm ||
    String(row.codigo_vinculo || row.tipo_vinculo || "")
      .toLocaleLowerCase("pt-BR")
      .includes(context.payrollBondTerm);
  const matchesPayrollDocument =
    state.module !== "payroll" ||
    !context.payrollDocumentTerm ||
    onlyDigits(getPayrollServerDocument(row)).includes(context.payrollDocumentTerm);
  const matchesPayrollServer =
    state.module !== "payroll" ||
    !context.payrollServerTerm ||
    getPayrollServerName(row).toLocaleLowerCase("pt-BR").includes(context.payrollServerTerm);
  const matchesColumnFilters = context.columnFilters.every(([key, value]) =>
    value.has(displayValue(row[key], key)),
  );
  return (
    matchesGeneral &&
    matchesDocument &&
    matchesCreditor &&
    matchesNumber &&
    matchesPayrollCompetence &&
    matchesPayrollType &&
    matchesPayrollAgency &&
    matchesPayrollUnit &&
    matchesPayrollBond &&
    matchesPayrollDocument &&
    matchesPayrollServer &&
    matchesColumnFilters
  );
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function renderSummary(data) {
  const endpoint = getActiveEndpoint();
  const municipality = state.municipalities.get(el.municipality.value) || "Todos os municipios";
  const start = Number(el.startIndex.value || 0);
  const advancedExpenseSearch = state.module === "expenses" && hasExpenseAdvancedFilters();
  const allPages = isFetchingAllPages();
  const payrollRangeSearch = state.module === "payroll" && getPayrollReferenceMonths().length > 1;
  const expenseRangeSearch = state.module === "expenses" && getExpenseReferenceMonths().length > 1;
  const countText = allPages
    ? `${state.filteredRows.length} resultado(s) em ${state.rows.length} registro(s) carregados`
    : payrollRangeSearch || expenseRangeSearch
      ? `${state.filteredRows.length} resultado(s) em ${state.rows.length} registro(s) carregados`
    : advancedExpenseSearch
      ? `${state.filteredRows.length} resultado(s) em ${state.rows.length} registro(s) analisados`
      : `${state.rows.length} registro(s) nesta pagina`;
  const endpointText = endpointLabels[endpoint] || modules[state.module].label;
  el.summaryRow.innerHTML = "";
  [endpointText, municipality, countText, `Inicio ${start}`].forEach((text) => {
    const item = document.createElement("span");
    item.textContent = text;
    el.summaryRow.append(item);
  });
  if (state.module === "payroll") {
    const reference = formatMonthRangeLabel(getPayrollReferenceMonths());
    const competence = formatMonthRangeLabel(getPayrollCompetenceMonths());
    [reference ? `Referencia ${reference}` : "", competence ? `Competencia ${competence}` : ""]
      .filter(Boolean)
      .forEach((text) => {
        const item = document.createElement("span");
        item.textContent = text;
        el.summaryRow.append(item);
      });
  }
  if (state.module === "expenses") {
    const reference = formatMonthRangeLabel(getExpenseReferenceMonths());
    if (reference) {
      const item = document.createElement("span");
      item.textContent = `Referencia ${reference}`;
      el.summaryRow.append(item);
    }
  }
  if (state.filteredRows.length) {
    const totals = getVisibleTotals(state.filteredRows);
    [`${totals.quantityLabel} ${formatInteger(totals.quantity)}`, `Valor ${formatMoney(totals.value)}`].forEach((text) => {
      const item = document.createElement("span");
      item.textContent = text;
      el.summaryRow.append(item);
    });
  }
  if (!allPages && !advancedExpenseSearch && hasNextPage(data)) {
    const next = document.createElement("span");
    next.textContent = "Ha proxima pagina";
    el.summaryRow.append(next);
  }
}

function renderTable() {
  const columns = getColumns();
  el.tableHead.innerHTML = "";
  renderTableHead(columns);
  renderTableRows(columns);
}

function renderTableHead(columns) {
  const headRow = document.createElement("tr");
  for (const [key, label] of columns) {
    const th = document.createElement("th");
    const labelEl = document.createElement("div");
    labelEl.className = "column-label";
    labelEl.textContent = label;
    th.append(labelEl, createColumnFilter(key, columns));
    headRow.append(th);
  }
  el.tableHead.append(headRow);
}

function createColumnFilter(key, columns) {
  const wrapper = document.createElement("div");
  wrapper.className = "column-filter";

  const button = document.createElement("button");
  button.className = "column-filter-button";
  button.type = "button";
  updateColumnFilterButton(button, key);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldOpen = !wrapper.classList.contains("open");
    closeColumnFilterPanels(wrapper);
    if (shouldOpen) {
      renderColumnFilterOptions();
      wrapper.classList.add("open");
      search.focus();
    } else {
      wrapper.classList.remove("open");
    }
  });

  const panel = document.createElement("div");
  panel.className = "column-filter-panel";
  panel.addEventListener("click", (event) => event.stopPropagation());

  const search = document.createElement("input");
  search.className = "column-filter-search";
  search.type = "search";
  search.placeholder = "Buscar na lista";

  const actions = document.createElement("div");
  actions.className = "column-filter-actions";
  const selectAll = document.createElement("button");
  selectAll.type = "button";
  selectAll.textContent = "Marcar todos";
  const clear = document.createElement("button");
  clear.type = "button";
  clear.textContent = "Limpar";
  actions.append(selectAll, clear);

  const list = document.createElement("div");
  list.className = "column-filter-list";
  let optionControls = [];
  let options = [];

  function refreshFilteredResults() {
    updateColumnFilterButton(button, key);
    applyTextFilter();
    if (state.lastData) renderSummary(state.lastData);
    renderTableRows(columns);
    el.exportButton.disabled = state.filteredRows.length === 0;
  }

  function applyOptionSearch() {
    const term = search.value.trim().toLocaleLowerCase("pt-BR");
    optionControls.forEach(({ item, option }) => {
      item.hidden = term ? !option.toLocaleLowerCase("pt-BR").includes(term) : false;
    });
  }

  function renderColumnFilterOptions() {
    const selected = getColumnSelection(key);
    options = getColumnFilterOptions(key);
    optionControls = [];
    list.innerHTML = "";

    options.forEach((option) => {
      const item = document.createElement("label");
      item.className = "column-filter-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = selected.has(option);
      checkbox.addEventListener("change", () => {
        const next = new Set(getColumnSelection(key));
        if (checkbox.checked) next.add(option);
        else next.delete(option);
        setColumnSelection(key, next);
        refreshFilteredResults();
      });
      const text = document.createElement("span");
      text.textContent = option;
      item.append(checkbox, text);
      list.append(item);
      optionControls.push({ item, checkbox, option });
    });

    if (!options.length) {
      const empty = document.createElement("div");
      empty.className = "column-filter-empty";
      empty.textContent = "Sem opcoes para os filtros atuais";
      list.append(empty);
    }

    updateColumnFilterButton(button, key);
    applyOptionSearch();
  }

  search.addEventListener("input", () => {
    applyOptionSearch();
  });

  selectAll.addEventListener("click", () => {
    const next = new Set(options);
    setColumnSelection(key, next);
    optionControls.forEach(({ checkbox }) => {
      checkbox.checked = true;
    });
    refreshFilteredResults();
  });

  clear.addEventListener("click", () => {
    setColumnSelection(key, new Set());
    optionControls.forEach(({ checkbox }) => {
      checkbox.checked = false;
    });
    refreshFilteredResults();
  });

  panel.append(search, actions, list);
  wrapper.append(button, panel);
  renderColumnFilterOptions();
  return wrapper;
}

function updateColumnFilterButton(button, key) {
  const selected = getColumnSelection(key);
  button.textContent = selected.size ? `${selected.size} selecionado(s)` : "Todos";
}

function getColumnSelection(key) {
  const current = state.columnFilters[key];
  if (current instanceof Set) return current;
  return new Set(current || []);
}

function setColumnSelection(key, values) {
  if (values.size) state.columnFilters[key] = values;
  else delete state.columnFilters[key];
}

function getColumnFilterOptions(key) {
  const context = getFilterContext({ omittedColumnKey: key });
  return Array.from(
    new Set(
      state.rows
        .filter((row) => rowMatchesFilterContext(row, context))
        .map((row) => displayValue(row[key], key)),
    ),
  )
    .filter((value) => value !== "")
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true, sensitivity: "base" }));
}

function closeColumnFilterPanels(except = null) {
  document.querySelectorAll(".column-filter.open").forEach((filter) => {
    if (filter !== except) filter.classList.remove("open");
  });
}

function renderTableRows(columns) {
  const rows = state.filteredRows;
  el.tableBody.innerHTML = "";
  el.tableFoot.innerHTML = "";

  if (rows.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "empty-state";
    cell.colSpan = Math.max(columns.length, 1);
    cell.textContent = state.rows.length ? "Nenhum resultado corresponde ao texto buscado." : "Nenhum registro retornado.";
    row.append(cell);
    el.tableBody.append(row);
    return;
  }

  for (const rowData of rows) {
    const row = document.createElement("tr");
    row.className = "result-row";
    row.addEventListener("click", () => openDetails(rowData));
    for (const [key] of columns) {
      const cell = document.createElement("td");
      const value = rowData[key];
      cell.textContent = displayValue(value, key);
      if (/valor|preco|total|saldo|quantidade/i.test(key)) cell.classList.add("numeric");
      if (/objeto|historico|descricao/i.test(key)) cell.classList.add("clamp");
      row.append(cell);
    }
    el.tableBody.append(row);
  }
  renderTotalsFooter(rows, columns);
}

function renderTotalsFooter(rows, columns) {
  if (!rows.length || !columns.length) return;
  const totals = getVisibleTotals(rows);
  const row = document.createElement("tr");
  row.className = "totals-row";

  if (columns.length < 3) {
    const cell = document.createElement("td");
    cell.className = "numeric";
    cell.colSpan = columns.length;
    cell.textContent = `Totais | ${totals.quantityLabel}: ${formatInteger(totals.quantity)} | Valor: ${formatMoney(totals.value)}`;
    row.append(cell);
    el.tableFoot.append(row);
    return;
  }

  const labelCell = document.createElement("td");
  labelCell.textContent = "Totais";
  labelCell.colSpan = columns.length - 2;
  row.append(labelCell);

  const quantityCell = document.createElement("td");
  quantityCell.className = "numeric";
  quantityCell.textContent = `${totals.quantityLabel}: ${formatInteger(totals.quantity)}`;
  row.append(quantityCell);

  const valueCell = document.createElement("td");
  valueCell.className = "numeric";
  valueCell.textContent = `Valor: ${formatMoney(totals.value)}`;
  row.append(valueCell);

  el.tableFoot.append(row);
}

function getVisibleTotals(rows) {
  if (state.module === "payroll") {
    const documents = new Set(
      rows
        .map((row) => getPayrollDocumentKey(getPayrollServerDocument(row)))
        .filter(Boolean),
    );
    return {
      quantity: documents.size || rows.length,
      quantityLabel: documents.size ? "CPFs" : "Registros",
      value: rows.reduce((total, row) => total + getTotalValue(row), 0),
    };
  }
  const quantityKey = findTotalKey(rows, /quantidade|qtd/i);
  return {
    quantity: quantityKey ? sumRows(rows, quantityKey) : rows.length,
    quantityLabel: quantityKey ? labelize(quantityKey) : "Registros",
    value: rows.reduce((total, row) => total + getTotalValue(row), 0),
  };
}

function findTotalKey(rows, pattern) {
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  return keys.find((key) => pattern.test(key) && rows.some((row) => Number.isFinite(toNumber(row[key]))));
}

function sumRows(rows, key) {
  return rows.reduce((total, row) => total + (toNumber(row[key]) || 0), 0);
}

function getTotalValue(row) {
  if (state.module === "payroll") return toNumber(getPayrollValue(row)) || 0;
  const valueKey = findTotalKey([row], /valor|preco|total|saldo/i);
  return valueKey ? toNumber(row[valueKey]) || 0 : 0;
}

function toNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatInteger(value) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value);
}

function renderError(error) {
  state.lastData = null;
  el.tableHead.innerHTML = "";
  el.tableBody.innerHTML = "";
  el.tableFoot.innerHTML = "";
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.className = "empty-state";
  cell.textContent = `Nao foi possivel consultar a API: ${error.message}`;
  row.append(cell);
  el.tableBody.append(row);
  el.summaryRow.innerHTML = "<span>Falha na consulta</span>";
  el.exportButton.disabled = true;
  el.nextButton.disabled = true;
}

function renderNotice(message) {
  state.lastData = null;
  el.tableHead.innerHTML = "";
  el.tableBody.innerHTML = "";
  el.tableFoot.innerHTML = "";
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.className = "empty-state";
  cell.textContent = message;
  row.append(cell);
  el.tableBody.append(row);
  el.summaryRow.innerHTML = "<span>Consulta incompleta</span>";
  el.exportButton.disabled = true;
  el.nextButton.disabled = true;
  el.previousButton.disabled = true;
}

function openDetails(row) {
  const title =
    row.numero_contrato ||
    row.numero_empenho ||
    row.nome_servidor_resultado ||
    row.cpf_servidor_resultado ||
    row.numero_processo_adm ||
    row.descricao_objeto_contrato ||
    "Detalhes";
  el.detailTitle.textContent = displayValue(title);
  el.detailContent.innerHTML = "";
  for (const [key, value] of Object.entries(row)) {
    const item = document.createElement("div");
    item.className = "detail-item";
    if (/descricao|historico|objeto/i.test(key)) item.classList.add("full");
    const keyEl = document.createElement("div");
    keyEl.className = "detail-key";
    keyEl.textContent = labelize(key);
    const valueEl = document.createElement("div");
    valueEl.className = "detail-value";
    valueEl.textContent = displayValue(value, key);
    item.append(keyEl, valueEl);
    el.detailContent.append(item);
  }
  el.detailDialog.showModal();
}

function exportCsv() {
  if (!state.filteredRows.length) return;
  const keys = Array.from(new Set(state.filteredRows.flatMap((row) => Object.keys(row))));
  const lines = [
    keys.join(";"),
    ...state.filteredRows.map((row) =>
      keys
        .map((key) => `"${displayValue(row[key], key).replaceAll('"', '""')}"`)
        .join(";"),
    ),
  ];
  const blob = new Blob([`\ufeff${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `tce-ce-${getActiveEndpoint()}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function toggleLoading(isLoading) {
  el.searchButton.disabled = isLoading;
  el.searchButton.textContent = isLoading ? "Buscando..." : "Buscar";
}

function setModule(module) {
  state.module = module;
  document.body.dataset.module = module;
  el.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.module === module));
  el.moduleLabel.textContent = modules[module].label;
  el.resultsTitle.textContent = modules[module].title;
  el.startIndex.value = "0";
  state.rows = [];
  state.filteredRows = [];
  state.columnFilters = {};
  state.lastData = null;
  el.exportButton.disabled = true;
  el.previousButton.disabled = true;
  el.nextButton.disabled = true;
  el.summaryRow.innerHTML = "<span>Sem consulta ativa</span>";
  el.tableHead.innerHTML = "";
  el.tableBody.innerHTML = '<tr><td class="empty-state">Selecione os filtros e execute uma busca.</td></tr>';
  el.tableFoot.innerHTML = "";
}

function resetFilters() {
  el.municipality.value = "";
  el.startDate.value = "";
  el.endDate.value = "";
  el.fiscalYear.value = "";
  el.referenceMonth.value = "";
  el.referenceEndMonth.value = "";
  el.creditorDocument.value = "";
  el.creditorName.value = "";
  el.expenseNumber.value = "";
  el.worksYear.value = "";
  el.payrollYear.value = "";
  el.payrollReferenceMonth.value = "";
  el.payrollReferenceEndMonth.value = "";
  el.payrollCompetenceMonth.value = "";
  el.payrollCompetenceEndMonth.value = "";
  el.payrollType.value = "";
  el.payrollAgency.value = "";
  el.payrollUnit.value = "";
  el.payrollBond.value = "";
  el.payrollServerDocument.value = "";
  el.payrollServerName.value = "";
  el.revenueYear.value = "";
  el.revenueReferenceMonth.value = "";
  el.revenueReferenceEndMonth.value = "";
  el.revenueAgency.value = "";
  el.revenueUnit.value = "";
  el.textSearch.value = "";
  el.pageSize.value = "all";
  el.startIndex.value = "0";
  state.columnFilters = {};
  setModule(state.module);
}

function wireEvents() {
  el.tabs.forEach((tab) => {
    tab.addEventListener("click", () => setModule(tab.dataset.module));
  });
  el.searchButton.addEventListener("click", () => runSearch(0));
  el.resetButton.addEventListener("click", resetFilters);
  el.exportButton.addEventListener("click", exportCsv);
  el.previousButton.addEventListener("click", () => {
    const nextStart = Math.max(0, Number(el.startIndex.value || 0) - Number(getPageSizeValue()));
    runSearch(nextStart);
  });
  el.nextButton.addEventListener("click", () => {
    const nextStart = Number(el.startIndex.value || 0) + Number(getPageSizeValue());
    runSearch(nextStart);
  });
  el.textSearch.addEventListener("input", () => {
    applyTextFilter();
    if (state.lastData) renderSummary(state.lastData);
    renderTable();
    el.exportButton.disabled = state.filteredRows.length === 0;
  });
  [el.creditorDocument, el.creditorName, el.expenseNumber].forEach((input) => {
    input.addEventListener("input", () => {
      applyTextFilter();
      if (state.lastData) renderSummary(state.lastData);
      renderTable();
      el.exportButton.disabled = state.filteredRows.length === 0;
    });
  });
  [
    el.payrollCompetenceMonth,
    el.payrollCompetenceEndMonth,
    el.payrollType,
    el.payrollAgency,
    el.payrollUnit,
    el.payrollBond,
    el.payrollServerDocument,
    el.payrollServerName,
  ].forEach((input) => {
    input.addEventListener("input", () => {
      applyTextFilter();
      if (state.lastData) renderSummary(state.lastData);
      renderTable();
      el.exportButton.disabled = state.filteredRows.length === 0;
    });
  });
  if (document.addEventListener) {
    document.addEventListener("click", () => closeColumnFilterPanels());
  }
  el.closeDialog.addEventListener("click", () => el.detailDialog.close());
}

async function init() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1).toISOString().slice(0, 10);
  const end = today.toISOString().slice(0, 10);
  el.startDate.value = start;
  el.endDate.value = end;
  el.fiscalYear.value = String(today.getFullYear());
  el.worksYear.value = String(today.getFullYear());
  el.payrollYear.value = String(today.getFullYear());
  el.referenceMonth.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  el.referenceEndMonth.value = el.referenceMonth.value;
  el.payrollReferenceMonth.value = el.referenceMonth.value;
  el.payrollReferenceEndMonth.value = el.referenceMonth.value;
  document.body.dataset.module = state.module;
  wireEvents();
  setModule("contracts");
  try {
    await loadMunicipalities();
  } catch (error) {
    setStatus("Municipios indisponiveis");
  }
}

init();
