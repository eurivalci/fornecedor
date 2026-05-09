/* ══ STATE ══ */
var S={perfil:'',capital:'',area:'alimentacao',modo:'local',cep:'',cidade:'',uf:'',lat:-15.78,lng:-47.93,raio:50,popEstimada:0};
var S_MODO='local';

/* ══ COORDENADAS POR UF (fallback quando CEP não tem coords) ══ */
var UF_COORDS={
  AC:[-9.97,-67.81],AL:[-9.57,-36.78],AP:[0.03,-51.07],AM:[-3.10,-60.02],
  BA:[-12.97,-38.50],CE:[-3.72,-38.54],DF:[-15.78,-47.93],ES:[-20.32,-40.34],
  GO:[-16.68,-49.26],MA:[-2.53,-44.30],MT:[-15.60,-56.10],MS:[-20.44,-54.65],
  MG:[-19.92,-43.94],PA:[-1.46,-48.50],PB:[-7.12,-34.86],PR:[-25.43,-49.27],
  PE:[-8.05,-34.88],PI:[-5.09,-42.80],RJ:[-22.91,-43.17],RN:[-5.80,-35.21],
  RS:[-30.03,-51.23],RO:[-8.76,-63.90],RR:[2.82,-60.67],SC:[-27.60,-48.55],
  SP:[-23.55,-46.63],SE:[-10.91,-37.07],TO:[-10.25,-48.32]
};

/* ══ DADOS NACIONAIS POR ÁREA (nível Brasil) ══ */
var INTEL_BRASIL={
  alimentacao:{
    mercadoTotal:'R$ 2,1 trilhões/ano',
    crescimento:'+8,4% ao ano (IBGE 2023)',
    ticketMedio:'R$ 38–85 (varia: delivery vs restaurante)',
    concorrencia:'Alta — 6,4 milhões de estabelecimentos no Brasil',
    penetracao:'100% da população consome',
    cnaes:[
      {cod:'4639-7',desc:'Comércio atacadista de produtos alimentícios em geral'},
      {cod:'5611-2',desc:'Restaurantes e similares'},
      {cod:'5620-1',desc:'Fornecimento de alimentos preparados (marmitaria)'},
      {cod:'1091-1',desc:'Fabricação de produtos de panificação e confeitaria'}
    ],
    estrategia:'Nichos de menor concorrência: alimentação saudável, fit e sem glúten crescem acima de 20% ao ano. Delivery tem barreira de entrada mínima — CAC recuperado em 2–3 meses com operação enxuta.',
    forn_destaque:['CEAGESP (SP)','Makro Atacadista','Frubana','Atacadão','Distribuidoras regionais de CNAE 4639-7']
  },
  moda:{
    mercadoTotal:'R$ 185 bilhões/ano',
    crescimento:'+6,2% ao ano (ABVTEX 2023)',
    ticketMedio:'R$ 80–350 (varejo popular vs premium)',
    concorrencia:'Média — concentrada em SP, RJ, CE',
    penetracao:'95% da população compra moda ao menos 1x/mês',
    cnaes:[
      {cod:'4641-9',desc:'Comércio atacadista de vestuário e acessórios'},
      {cod:'1411-8',desc:'Confecção de roupas íntimas e trajes'},
      {cod:'4642-7',desc:'Comércio atacadista de artigos do vestuário e complementos'}
    ],
    estrategia:'Moda circular (brechó) e moda fitness têm crescimento de 30%+/ano. Brás e Bom Retiro atendem todo o Brasil. E-commerce via Instagram/TikTok tem CAC muito baixo para segmentos nichados.',
    forn_destaque:['Polo do Brás (SP)','Moda Center Caruaru (PE)','Polo Bom Retiro (SP)','Feira da Madrugada (SP)','Confecções atacado online']
  },
  tecnologia:{
    mercadoTotal:'R$ 92 bilhões/ano (serviços + revenda)',
    crescimento:'+14% ao ano (IDC Brasil 2023)',
    ticketMedio:'R$ 150–800 (manutenção) · R$ 1.500–8.000 (projetos TI)',
    concorrencia:'Baixa a média — demanda supera oferta de qualidade',
    penetracao:'87% dos brasileiros têm smartphone (Ipea 2023)',
    cnaes:[
      {cod:'9521-5',desc:'Reparação e manutenção de equipamentos de informática'},
      {cod:'6201-5',desc:'Desenvolvimento de programas de computador sob encomenda'},
      {cod:'4751-2',desc:'Comércio varejista especializado de equipamentos'},
      {cod:'6202-3',desc:'Desenvolvimento e licenciamento de programas customizáveis'}
    ],
    estrategia:'Manutenção de celulares tem retorno em 90 dias. TI para PMEs tem MRR previsível — contrato de R$800–1.500/mês por cliente. Baixíssima necessidade de estoque.',
    forn_destaque:['Santa Ifigênia (SP)','Mercado Livre B2B','Dell Parceiros','Intelbras Revendas','Distribuidoras de peças eletrônicas']
  },
  beleza:{
    mercadoTotal:'R$ 117 bilhões/ano',
    crescimento:'+10,5% ao ano (ABIHPEC 2023)',
    ticketMedio:'R$ 60–250 (estética) · R$ 25–120 (cosméticos)',
    concorrencia:'Alta em grandes centros · Média no interior',
    penetracao:'Brasil é o 4º maior mercado mundial de beleza',
    cnaes:[
      {cod:'9602-5',desc:'Serviços de estética e outros serviços de cuidados com a beleza'},
      {cod:'4772-5',desc:'Comércio varejista de cosméticos, produtos de perfumaria'},
      {cod:'4771-7',desc:'Comércio varejista de produtos farmacêuticos'}
    ],
    estrategia:'Studio de sobrancelha e depilação tem menor ticket mas altíssima recorrência (cliente retorna a cada 15–21 dias). Cosméticos naturais e veganos crescem 28%/ano e têm margem acima de 60%.',
    forn_destaque:['Polo de Duque de Caxias (RJ)','Natura Distribuidores','Beauty Buy','Shopee Atacado Beleza','TotalBeleza']
  },
  construcao:{
    mercadoTotal:'R$ 421 bilhões/ano (PIB construção civil)',
    crescimento:'+4,7% ao ano (CBIC 2023)',
    ticketMedio:'R$ 400–2.500 (materiais por compra)',
    concorrencia:'Média — mercado fragmentado e regional',
    penetracao:'Déficit habitacional de 8 milhões de unidades gera demanda constante',
    cnaes:[
      {cod:'4744-0',desc:'Comércio varejista de materiais de construção em geral'},
      {cod:'4741-5',desc:'Comércio varejista de ferragens e ferramentas'},
      {cod:'4742-3',desc:'Comércio varejista de material elétrico'},
      {cod:'4743-1',desc:'Comércio varejista de vidros'}
    ],
    estrategia:'Acabamentos premium (porcelanato, mármore sintético) têm margem 3x maior que materiais básicos. Parcerias com construtoras geram pedidos recorrentes. Foco em obras de reforma cresce 12%/ano.',
    forn_destaque:['Polo ABC Paulista (SP)','Leroy Merlin Atacado','Votorantim Revendas','Elgin Distribuidores','Cerâmicas do Nordeste']
  },
  saude:{
    mercadoTotal:'R$ 343 bilhões/ano (saúde suplementar + privada)',
    crescimento:'+9,8% ao ano (ANS 2023)',
    ticketMedio:'R$ 120–600 (estética clínica) · R$ 80–250 (suplementos)',
    concorrencia:'Média — regulação cria barreira de entrada natural',
    penetracao:'47% dos brasileiros usam algum suplemento (Vigitel 2023)',
    cnaes:[
      {cod:'8650-0',desc:'Atividades de profissionais da área de saúde'},
      {cod:'4771-7',desc:'Comércio varejista de produtos farmacêuticos'},
      {cod:'4773-3',desc:'Comércio varejista de artigos médicos e ortopédicos'}
    ],
    estrategia:'Suplementação esportiva cresce 22%/ano — e-commerce viável com CAC baixo via influenciadores fitness. Clínicas de estética têm ticket alto e recorrência garantida por protocolos de manutenção.',
    forn_destaque:['Vimer Distribuidora','Ultrafarma Atacado','Shopee Saúde','Integralmedica Revendas','Distribuidoras de insumos estéticos']
  },
  dropshipping:{
    mercadoTotal:'R$ 45 bilhões/ano (e-commerce via dropshipping)',
    crescimento:'+32% ao ano (E-Commerce Brasil 2023)',
    ticketMedio:'R$ 60–180 (produto médio)',
    concorrencia:'Alta — mas nichos específicos têm < 50 concorrentes diretos',
    penetracao:'76% dos brasileiros compram online (NielsenIQ 2023)',
    cnaes:[
      {cod:'4789-0',desc:'Comércio varejista de outros produtos não especificados'},
      {cod:'6204-0',desc:'Consultoria em tecnologia da informação'},
      {cod:'4999-9',desc:'Outros serviços de entrega de produtos'}
    ],
    estrategia:'Nicho + produto exclusivo = margem acima de 40%. Produtos de solução de problema (ex: ergonômicos, organização) têm melhor conversão. Foco em Shopee e Mercado Livre para começar, Shopify para escalar.',
    forn_destaque:['Dropi','Shopee Fornecedores','Alibaba Brasil','Importações Americanas','DSers/Oberlo']
  },
  infoproduto:{
    mercadoTotal:'R$ 28 bilhões/ano (mercado EAD + infoprodutos)',
    crescimento:'+41% ao ano (ABED 2023)',
    ticketMedio:'R$ 97–2.400 (curso básico a mentoria premium)',
    concorrencia:'Baixa a média — 95% do mercado está em nichos pouco explorados',
    penetracao:'37 milhões de brasileiros fizeram algum curso online em 2023',
    cnaes:[
      {cod:'8599-6',desc:'Outras atividades de ensino não especificadas'},
      {cod:'6201-5',desc:'Desenvolvimento de programas de computador'},
      {cod:'7490-1',desc:'Outras atividades profissionais, científicas e técnicas'}
    ],
    estrategia:'Curso de nicho específico (ex: "Excel para RH", "Confeitaria árabe") converte 5–8x mais que cursos genéricos. Lançamento via PLR em 90 dias. MRR com membership a partir do 2º lançamento.',
    forn_destaque:['Hotmart','Eduzz','Monetizze','Teachable','Kiwify']
  }
};

var fornecedores=[];
var mapObj=null,circleObj=null,pinLayer=null,heatLayer=null;
var layerMode='pins';

/* ══ IBGE POP — top municípios embutidos (IBGE 2022) ══ */
var IBGE_POP={
  'fortaleza':2703391,'são paulo':11451245,'rio de janeiro':6748000,'salvador':2900319,
  'belo horizonte':2315560,'manaus':2219580,'curitiba':1773733,'recife':1661017,
  'goiânia':1437237,'belém':1392031,'porto alegre':1332570,'guarulhos':1291771,
  'campinas':1213792,'são luís':1108975,'maceió':1025360,'natal':890480,
  'teresina':866300,'campo grande':897938,'joão pessoa':801718,'osasco':697886,
  'santo andré':721486,'são bernardo do campo':844483,'jaboatão dos guararapes':718600,
  'ribeirão preto':720151,'uberlândia':706597,'sorocaba':699258,'contagem':668935,
  'aracaju':674561,'feira de santana':626965,'cuiabá':631814,'joinville':616918,
  'juiz de fora':577349,'londrina':569733,'ananindeua':533893,'niterói':515317,
  'caucaia':366269,'maracanaú':228613,'imperatriz':258016,
  'caxias do sul':503243,'belford roxo':502914,'são gonçalo':1049826,
  'duque de caxias':924624,'nova iguaçu':822570,'mogi das cruzes':457141,
  'betim':444433,'macapá':512902,'porto velho':547033,'palmas':310769,
  'boa vista':419652,'rio branco':413418,'maceiò':1025360,'vitória':365855,
  'florianópolis':508828,'porto seguro':155752,'ilhéus':175561
};

/* ══ AREAS ══ */
var AREAS={
  alimentacao:{label:'Alimentação',emoji:'🍽️',
    cnaes:['4639700','4634601','4634602','4637107','1091100'],
    ticketMedio:55,penetracao:0.18,concorrentes:320,
    nichos:[
      {nome:'Food delivery / marmitex',score:94,cnae:'4639-7',retorno:'6–8 meses',desc:'Alta demanda, baixo estoque, ticket recorrente. Menor barreira de entrada do segmento.',tags:['Alta demanda','MEI viável','Recorrente']},
      {nome:'Cafeteria e snacks',score:81,cnae:'5611-2',retorno:'10–12 meses',desc:'Ticket médio crescente. Fidelização alta. Fornecedores de café especial em expansão.',tags:['Ticket crescente','Fidelização']},
      {nome:'Confeitaria artesanal',score:74,cnae:'1091-1',retorno:'8 meses',desc:'Mercado aquecido. Insumos com boas condições. Forte apelo em redes sociais.',tags:['Artesanal','Redes sociais']}
    ],
    riscos:[
      {icon:'🏛️',nome:'Vigilância sanitária',desc:'ANVISA + Vigilância Municipal',nivel:'rl-high',label:'Alto'},
      {icon:'📋',nome:'Alvará de funcionamento',desc:'Obrigatório antes da abertura',nivel:'rl-high',label:'Alto'},
      {icon:'🌡️',nome:'Controle de temperatura',desc:'Para alimentos perecíveis',nivel:'rl-med',label:'Médio'},
      {icon:'📦',nome:'Registro de produto',desc:'Para industrializados',nivel:'rl-low',label:'Baixo'}
    ]
  },
  moda:{label:'Moda e vestuário',emoji:'👗',
    cnaes:['4641901','4641902','1411801','1411802','4642701'],
    ticketMedio:120,penetracao:0.22,concorrentes:180,
    nichos:[
      {nome:'Brechó e moda circular',score:89,cnae:'4641-9',retorno:'4–6 meses',desc:'Tendência consolidada, baixo estoque inicial. Alta tração via Instagram.',tags:['Tendência','Baixo estoque','Instagram']},
      {nome:'Moda praia / fitness',score:78,cnae:'1411-8',retorno:'8 meses',desc:'Sazonalidade previsível. Confecções com pedido mínimo acessível.',tags:['Sazonalidade','E-commerce']},
      {nome:'Uniformes corporativos',score:70,cnae:'1411-8',retorno:'12 meses',desc:'B2B com contratos anuais recorrentes. Margem estável e previsível.',tags:['B2B','Recorrente']}
    ],
    riscos:[
      {icon:'📏',nome:'Inmetro / etiquetagem',desc:'Obrigatório em produtos têxteis',nivel:'rl-med',label:'Médio'},
      {icon:'🏭',nome:'Rastreabilidade',desc:'Origem do tecido / fornecedor',nivel:'rl-low',label:'Baixo'},
      {icon:'♻️',nome:'Logística reversa',desc:'Obrigação ambiental crescente',nivel:'rl-low',label:'Baixo'},
      {icon:'📋',nome:'Alvará comercial',desc:'Dependendo do porte e local',nivel:'rl-low',label:'Baixo'}
    ]
  },
  tecnologia:{label:'Tecnologia',emoji:'💻',
    cnaes:['6201500','4751201','4751202','6202300','9521500'],
    ticketMedio:280,penetracao:0.12,concorrentes:95,
    nichos:[
      {nome:'Manutenção de celulares',score:87,cnae:'9521-5',retorno:'3–5 meses',desc:'Alta rotatividade, baixo investimento inicial. Demanda crescente.',tags:['Alta rotatividade','Baixo inv.']},
      {nome:'Revenda de equipamentos usados',score:82,cnae:'4751-2',retorno:'4 meses',desc:'Margem alta, sem fábrica. Marketplace + loja física.',tags:['Margem alta','Flex']},
      {nome:'Serviços de TI para PMEs',score:76,cnae:'6201-5',retorno:'Recorrente',desc:'MRR previsível com contratos mensais.',tags:['MRR','B2B']}
    ],
    riscos:[
      {icon:'🔒',nome:'LGPD',desc:'Tratamento de dados de clientes',nivel:'rl-high',label:'Alto'},
      {icon:'📡',nome:'Anatel',desc:'Para revenda de equipamentos',nivel:'rl-med',label:'Médio'},
      {icon:'♻️',nome:'Descarte de eletrônicos',desc:'PNRS — logística reversa',nivel:'rl-med',label:'Médio'},
      {icon:'📋',nome:'Alvará MEI/ME',desc:'Simples para serviços locais',nivel:'rl-low',label:'Baixo'}
    ]
  },
  beleza:{label:'Beleza e estética',emoji:'✨',
    cnaes:['4772500','9602501','9602502','4771701','9602503'],
    ticketMedio:95,penetracao:0.25,concorrentes:210,
    nichos:[
      {nome:'Studio sobrancelha / depilação',score:92,cnae:'9602-5',retorno:'5–7 meses',desc:'Alta demanda recorrente. Baixo investimento em espaço. Boa margem por procedimento.',tags:['Alta demanda','Recorrente','MEI']},
      {nome:'Distribuidora de cosméticos',score:79,cnae:'4772-5',retorno:'8 meses',desc:'Margem boa. Variedade de fornecedores nacionais e importados.',tags:['Margem boa','Variedade']},
      {nome:'Produtos capilares naturais',score:71,cnae:'4771-7',retorno:'10 meses',desc:'Nicho crescente com público fiel. E-commerce viável desde o início.',tags:['E-commerce','Nicho']}
    ],
    riscos:[
      {icon:'💊',nome:'ANVISA — cosméticos',desc:'Registro ou notificação de produtos',nivel:'rl-high',label:'Alto'},
      {icon:'🏥',nome:'Vigilância sanitária',desc:'Para espaços de atendimento',nivel:'rl-med',label:'Médio'},
      {icon:'📋',nome:'CRF / CRBio',desc:'Para manipulação profissional',nivel:'rl-med',label:'Médio'},
      {icon:'🏢',nome:'Alvará de localização',desc:'Zoneamento para estética',nivel:'rl-low',label:'Baixo'}
    ]
  },
  construcao:{label:'Construção civil',emoji:'🏗️',
    cnaes:['4744001','4744002','4741500','4742300','4743100'],
    ticketMedio:650,penetracao:0.08,concorrentes:140,
    nichos:[
      {nome:'Materiais de acabamento',score:83,cnae:'4744-0',retorno:'10 meses',desc:'Alta margem em porcelanatos e revestimentos. Representantes regionais.',tags:['Alta margem','B2C e B2B']},
      {nome:'Ferragens e ferramentas',score:76,cnae:'4741-5',retorno:'8 meses',desc:'Demanda constante de autônomos e construtoras.',tags:['Demanda constante']},
      {nome:'Tintas e revestimentos',score:70,cnae:'4742-3',retorno:'12 meses',desc:'Fidelização alta. Parcerias com pintores e engenheiros.',tags:['Fidelização']}
    ],
    riscos:[
      {icon:'⛑️',nome:'NR-18 / Segurança',desc:'Normas de obra e depósito',nivel:'rl-high',label:'Alto'},
      {icon:'🌿',nome:'Licença ambiental',desc:'Para estoque de grandes volumes',nivel:'rl-med',label:'Médio'},
      {icon:'🏗️',nome:'CREA / CAU',desc:'Para projetos e laudos',nivel:'rl-med',label:'Médio'},
      {icon:'📦',nome:'INMETRO produtos',desc:'Certificação de materiais',nivel:'rl-low',label:'Baixo'}
    ]
  },
  saude:{label:'Saúde e bem-estar',emoji:'🏥',
    cnaes:['4771701','4771702','8650001','8650002','4773300'],
    ticketMedio:190,penetracao:0.15,concorrentes:120,
    nichos:[
      {nome:'Clínica estética / fisioterapia',score:88,cnae:'8650-0',retorno:'8–10 meses',desc:'Recorrência alta, pacotes. Equipamentos com financiamento.',tags:['Recorrente','Pacotes']},
      {nome:'Suplementos e nutrição esportiva',score:82,cnae:'4771-7',retorno:'6 meses',desc:'E-commerce viável. Fornecedores nacionais com boa margem.',tags:['E-commerce','Margem boa']},
      {nome:'Farmácia de manipulação',score:74,cnae:'4771-7',retorno:'18 meses',desc:'Regulado pela ANVISA, alta margem pós break-even. Exige CRF.',tags:['Regulado','Alta margem']}
    ],
    riscos:[
      {icon:'💊',nome:'ANVISA — categoria II',desc:'Licença sanitária obrigatória',nivel:'rl-high',label:'Alto'},
      {icon:'🎓',nome:'CRF / CFM / CREFITO',desc:'Responsável técnico obrigatório',nivel:'rl-high',label:'Alto'},
      {icon:'❄️',nome:'Cadeia de frio',desc:'Para medicamentos e suplementos',nivel:'rl-med',label:'Médio'},
      {icon:'📋',nome:'Alvará sanitário',desc:'Municipal + Estadual',nivel:'rl-low',label:'Baixo'}
    ]
  }
};

/* ══ V3: DADOS TERRITORIAIS ══ */
var BARREIRA={
  alimentacao:{pct:92,label:'Hiperlocal',cor:'#ff4757',desc:'Perecíveis e logística fria exigem proximidade'},
  moda:{pct:28,label:'Baixa',cor:'#2ed573',desc:'Atacado nacional via Brás, Bom Retiro e e-commerce'},
  tecnologia:{pct:12,label:'Mínima',cor:'#2ed573',desc:'Fornecedores digitais e nacionais dominam'},
  beleza:{pct:45,label:'Média',cor:'#f5a623',desc:'Mix de distribuidores locais e nacionais'},
  construcao:{pct:78,label:'Alta',cor:'#ff4757',desc:'Peso e volume encarecem frete longo'},
  saude:{pct:50,label:'Média',cor:'#f5a623',desc:'Regulação exige fornecedor habilitado'},
  dropshipping:{pct:0,label:'Zero',cor:'#2ed573',desc:'100% sem barreira — fornecedor entrega direto'},
  infoproduto:{pct:0,label:'Zero',cor:'#2ed573',desc:'Produto digital — sem logística física'}
};

var AREAS_EXTRA={
  dropshipping:{label:'Dropshipping',emoji:'📦',
    cnaes:['4789099'],ticketMedio:85,penetracao:0.14,concorrentes:420,
    nichos:[
      {nome:'Dropshipping de nicho',score:88,cnae:'4789-0',retorno:'2–4 meses',desc:'Sem estoque. Fornecedor nacional ou importado entrega direto. Alta escalabilidade.',tags:['Sem estoque','Escalável','Digital']},
      {nome:'Print on demand',score:80,cnae:'4789-0',retorno:'3 meses',desc:'Camisetas, canecas e produtos personalizados sob demanda. Integração com Shopify.',tags:['POD','Criativo','0 estoque']},
      {nome:'Importados via Alibaba',score:72,cnae:'4789-0',retorno:'4–6 meses',desc:'Produtos exclusivos do exterior com margem alta. Exige gestão de câmbio e importação.',tags:['Importado','Margem alta']}
    ],
    riscos:[
      {icon:'🚚',nome:'Dependência do fornecedor',desc:'Prazo e qualidade fora do seu controle',nivel:'rl-high',label:'Alto'},
      {icon:'💱',nome:'Variação cambial',desc:'Para produtos importados',nivel:'rl-med',label:'Médio'},
      {icon:'📦',nome:'Gestão de devoluções',desc:'Política do Código do Consumidor',nivel:'rl-med',label:'Médio'},
      {icon:'📋',nome:'CNPJ MEI/ME',desc:'Exigido para emitir nota fiscal',nivel:'rl-low',label:'Baixo'}
    ]
  },
  infoproduto:{label:'Infoprodutos',emoji:'🎓',
    cnaes:['8599699'],ticketMedio:320,penetracao:0.09,concorrentes:280,
    nichos:[
      {nome:'Curso online / EAD',score:91,cnae:'8599-6',retorno:'1–3 meses',desc:'Alta margem, sem estoque, distribuição digital. Plataformas como Hotmart e Eduzz.',tags:['Alta margem','Recorrente','Escala']},
      {nome:'Mentoria e consultoria',score:85,cnae:'8599-6',retorno:'Imediato',desc:'Sem plataforma, sem estoque. Ticket alto e relacionamento direto com cliente.',tags:['Alto ticket','Sem infra']},
      {nome:'Assinatura / membership',score:78,cnae:'8599-6',retorno:'Recorrente',desc:'MRR previsível. Comunidade ou conteúdo exclusivo por assinatura mensal.',tags:['MRR','Comunidade']}
    ],
    riscos:[
      {icon:'©️',nome:'Propriedade intelectual',desc:'Plágio e proteção do conteúdo',nivel:'rl-med',label:'Médio'},
      {icon:'🔒',nome:'LGPD',desc:'Dados dos alunos e leads',nivel:'rl-med',label:'Médio'},
      {icon:'💳',nome:'Gateway de pagamento',desc:'Taxas e chargebacks',nivel:'rl-low',label:'Baixo'},
      {icon:'📋',nome:'Declaração ao CARF',desc:'Receita de plataformas digitais',nivel:'rl-low',label:'Baixo'}
    ]
  }
};

var FORN_DIGITAIS={
  moda:[
    {nome:'Brás Online',desc:'Representantes do polo do Brás com venda online. Pedido mínimo a partir de R$ 300.',site:'https://brasonline.com.br',tags:['Atacado','MEI aceito','Frete nacional'],alcance:'nacional'},
    {nome:'Moda Center Santa Cruz',desc:'Polo de Caruaru/PE com e-commerce. Forte em moda nordestina e fitness.',site:'https://modacenter.com.br',tags:['Nordeste','Atacado'],alcance:'nacional'},
    {nome:'Ropas Atacado',desc:'Plataforma B2B de confecções com catálogo digital e entrega em todo Brasil.',site:'https://ropas.com.br',tags:['B2B','Digital','Variedade'],alcance:'nacional'},
    {nome:'Alibaba Brasil',desc:'Importação direta de moda asiática. Pedido mínimo variável por fornecedor.',site:'https://alibaba.com',tags:['Importado','Alta margem'],alcance:'global'}
  ],
  tecnologia:[
    {nome:'Mercado Livre / MLB',desc:'Revenda de eletrônicos usados e novos. MercadoEnvios integrado.',site:'https://mercadolivre.com.br',tags:['Marketplace','Nacional','MEI aceito'],alcance:'nacional'},
    {nome:'Magalu Parceiros',desc:'Programa de revenda de produtos Magazine Luiza com dropshipping.',site:'https://parceiros.magazineluiza.com.br',tags:['Dropshipping','Confiável'],alcance:'nacional'},
    {nome:'Santa Ifigênia Online',desc:'Representantes do polo eletrônico de SP com vendas nacionais.',site:'https://santaifigenia.com.br',tags:['Eletrônicos','Atacado'],alcance:'nacional'},
    {nome:'Ali Express Brasil',desc:'Produtos eletrônicos importados com entrega direta ao cliente final.',site:'https://aliexpress.com',tags:['Importado','Dropshipping'],alcance:'global'}
  ],
  beleza:[
    {nome:'Natura Distribuidores',desc:'Rede oficial de distribuidores Natura com pedido mínimo acessível.',site:'https://natura.com.br',tags:['Marca forte','MEI aceito','Nacional'],alcance:'nacional'},
    {nome:'Beauty Buy',desc:'Atacado de cosméticos e produtos de beleza com entrega nacional.',site:'https://beautybuy.com.br',tags:['Atacado','Variedade'],alcance:'nacional'},
    {nome:'TotalBeleza',desc:'Distribuidora nacional de insumos para estética e salões.',site:'https://totalbeleza.com.br',tags:['B2B','Profissional'],alcance:'nacional'},
    {nome:'Shopee Brasil Fornecedores',desc:'Marketplace com fornecedores de cosméticos e produtos capilares.',site:'https://shopee.com.br',tags:['Marketplace','Competitivo'],alcance:'nacional'}
  ],
  dropshipping:[
    {nome:'Dropi',desc:'Plataforma de dropshipping nacional com +10mil produtos e integração Shopify/WooCommerce.',site:'https://dropi.com.br',tags:['Nacional','API','Integração'],alcance:'nacional'},
    {nome:'Importações Americanas',desc:'Dropshipping de importados com estoque no Brasil. Entrega em 3–7 dias.',site:'https://importacoesamericanas.com.br',tags:['Importado','Rápido'],alcance:'nacional'},
    {nome:'Oberlo / DSers',desc:'Integração com Alibaba para dropshipping global. Requer loja Shopify.',site:'https://dsers.com',tags:['Global','Shopify'],alcance:'global'},
    {nome:'Shein Parceiros',desc:'Programa de revenda Shein com produtos de moda a preço de atacado.',site:'https://shein.com.br',tags:['Moda','Alta margem'],alcance:'global'}
  ],
  infoproduto:[
    {nome:'Hotmart',desc:'Principal plataforma de infoprodutos do Brasil. Coproduções e afiliados.',site:'https://hotmart.com',tags:['Lider','Afiliados','Grátis p/ começar'],alcance:'nacional'},
    {nome:'Eduzz',desc:'Plataforma para cursos, e-books e mentorias com gateway integrado.',site:'https://eduzz.com',tags:['Completa','B2B disponível'],alcance:'nacional'},
    {nome:'Monetizze',desc:'Especialista em assinaturas recorrentes e programas de membros.',site:'https://monetizze.com.br',tags:['Recorrência','MRR'],alcance:'nacional'},
    {nome:'Teachable / Kajabi',desc:'Plataformas internacionais para cursos com domínio próprio e comunidade.',site:'https://teachable.com',tags:['Internacional','Premium'],alcance:'global'}
  ],
  alimentacao:[
    {nome:'Frubana Brasil',desc:'Distribuidora digital de hortifruti e insumos para restaurantes. Entrega D+1.',site:'https://frubana.com',tags:['Perecíveis','D+1','App'],alcance:'regional'},
    {nome:'Atacadão Online',desc:'Compras no atacado pelo app com retirada em loja ou entrega.',site:'https://atacadao.com.br',tags:['Atacado','App','Nacional'],alcance:'nacional'},
    {nome:'iFood para Restaurantes',desc:'Insumos e embalagens via plataforma iFood para parceiros.',site:'https://restaurantes.ifood.com.br',tags:['Parceiro iFood','Insumos'],alcance:'nacional'}
  ],
  construcao:[
    {nome:'Leroy Merlin Online',desc:'Materiais de construção e acabamento com entrega nacional.',site:'https://leroymerlin.com.br',tags:['Variedade','Nacional','B2C'],alcance:'nacional'},
    {nome:'C&C Online',desc:'Atacado de materiais de construção com programa para revendedores.',site:'https://cc.com.br',tags:['Atacado','Revendedor'],alcance:'nacional'},
    {nome:'MadeiraMadeira',desc:'Marketplace de acabamentos, pisos e revestimentos com entrega nacional.',site:'https://madeiramadeira.com.br',tags:['Acabamentos','Marketplace'],alcance:'nacional'}
  ],
  saude:[
    {nome:'Vimer Distribuidora',desc:'Distribuidora de suplementos e produtos naturais com atacado nacional.',site:'https://vimer.com.br',tags:['Suplementos','Atacado'],alcance:'nacional'},
    {nome:'Ultrafarma Atacado',desc:'Medicamentos e dermocosméticos com compra atacado para revendedores.',site:'https://ultrafarma.com.br',tags:['Dermocosméticos','Nacional'],alcance:'nacional'},
    {nome:'Shopee Saúde',desc:'Equipamentos estéticos e produtos de bem-estar com fornecedores nacionais.',site:'https://shopee.com.br',tags:['Equipamentos','Variado'],alcance:'nacional'}
  ]
};

/* ══ V4 PREVIEW: POLOS COMERCIAIS ══ */
var POLOS=[
  {nome:'Brás + Bom Retiro',cidade:'São Paulo – SP',emoji:'👗',especialidades:['Moda feminina','Moda masculina','Calçados','Acessórios'],ticketMin:'R$ 200',aceitaMei:true,online:true,areas:['moda','beleza','dropshipping'],desc:'Maior polo de moda do Brasil. +15 mil estabelecimentos em ~2km². Representantes vendem online com envio nacional.',dicas:'Visite na madrugada (4h–9h) para melhor atendimento. Terças e quintas têm maior variedade.'},
  {nome:'25 de Março',cidade:'São Paulo – SP',emoji:'🛍️',especialidades:['Variedades','Importados','Embalagens','Brindes','Decoração'],ticketMin:'R$ 150',aceitaMei:true,online:true,areas:['moda','dropshipping','tecnologia','alimentacao','saude','beleza'],desc:'Polo de variedades e importados mais famoso do Brasil. Ideal para quem busca mix amplo com preço de atacado.',dicas:'Chegue cedo — movimento intenso após as 10h. Negocie à vista para descontos de 10–20%.'},
  {nome:'Santa Ifigênia',cidade:'São Paulo – SP',emoji:'💻',especialidades:['Eletrônicos','Informática','Celulares','Componentes','Games'],ticketMin:'R$ 300',aceitaMei:true,online:true,areas:['tecnologia','dropshipping'],desc:'Centro eletrônico referência nacional. Distribuidores com preço abaixo do varejo e representantes para todo Brasil.',dicas:'Pesquise preços em pelo menos 3 lojas antes de fechar. Exija nota fiscal sempre.'},
  {nome:'Polo de Caruaru',cidade:'Caruaru – PE',emoji:'👕',especialidades:['Confecções','Moda popular','Uniformes'],ticketMin:'R$ 100',aceitaMei:true,online:false,areas:['moda'],desc:'Maior polo de confecções do Nordeste. Preços muito competitivos e pedido mínimo acessível para MEI.',dicas:'Concentrado na Feira da Sulanca — sábados são o dia principal. Ótimo para iniciantes com pouco capital.'},
  {nome:'Polo Joalheiro de Limeira',cidade:'Limeira – SP',emoji:'💍',especialidades:['Semijoias','Bijuterias','Folheados'],ticketMin:'R$ 250',aceitaMei:true,online:true,areas:['moda','beleza'],desc:'Capital nacional das semijoias. Mais de 400 fabricantes com venda direta e representantes online.',dicas:'Muitos fabricantes vendem pelo WhatsApp. Busque por "atacado semijoias Limeira" para fornecedores online.'},
  {nome:'Polo Calçadista de Franca',cidade:'Franca – SP',emoji:'👟',especialidades:['Calçados masculinos','Couro','Acessórios'],ticketMin:'R$ 400',aceitaMei:false,online:true,areas:['moda'],desc:'Capital do calçado masculino brasileiro. Fábricas vendem direto com qualidade premium.',dicas:'Exige CNPJ ativo (não MEI) para a maioria dos fornecedores. Pedido mínimo mais elevado.'},
  {nome:'Feira da Madrugada',cidade:'São Paulo – SP',emoji:'🌙',especialidades:['Mix geral','Importados','Roupas','Acessórios','Utilidades'],ticketMin:'R$ 100',aceitaMei:true,online:false,areas:['moda','dropshipping','alimentacao','beleza','construcao'],desc:'Maior feira atacadista noturna do Brasil. Funciona das 22h às 6h. Preços muito competitivos.',dicas:'Leve dinheiro e sacolas próprias. Melhor custo-benefício em mix variado para revendedores iniciantes.'},
  {nome:'Polo de Novo Hamburgo',cidade:'Novo Hamburgo – RS',emoji:'👡',especialidades:['Calçados femininos','Moda gaúcha','Couro'],ticketMin:'R$ 350',aceitaMei:false,online:true,areas:['moda'],desc:'Referência em calçados femininos e couro. Parte dos fabricantes aceita pedidos online com frete nacional.',dicas:'Visite durante a Couromoda (janeiro) para os melhores preços e lançamentos da temporada.'},
  {nome:'CEAGESP / Ceasa',cidade:'São Paulo – SP (e regionais)',emoji:'🥦',especialidades:['Hortifruti','Cereais','Laticínios','Peixes','Flores'],ticketMin:'R$ 150',aceitaMei:true,online:false,areas:['alimentacao'],desc:'Maior entreposto de abastecimento do Brasil. Funciona nas madrugadas — preços até 60% abaixo do varejo para insumos de restaurantes e marmitarias.',dicas:'Chegue entre 3h e 6h para melhor seleção. Leve caixa térmica para perecíveis. Aceita MEI com nota.'},
  {nome:'Polo Atacadista de Duque de Caxias',cidade:'Duque de Caxias – RJ',emoji:'🏭',especialidades:['Químicos','Cosméticos','Higiene','Limpeza'],ticketMin:'R$ 300',aceitaMei:true,online:true,areas:['beleza','saude','alimentacao'],desc:'Polo industrial com distribuidoras de cosméticos, higiene e produtos de limpeza. Muitos fornecedores com venda online e representantes nacionais.',dicas:'Ótimo para quem busca cosméticos e insumos de beleza com preço de fábrica.'},
  {nome:'Polo de Materiais de Construção — Região do ABC',cidade:'São Paulo – SP',emoji:'🧱',especialidades:['Cimento','Ferro','Tintas','Cerâmicas','Hidráulica'],ticketMin:'R$ 500',aceitaMei:false,online:true,areas:['construcao'],desc:'Concentração de distribuidoras e importadoras de materiais de construção no ABC Paulista. Representantes com cobertura nacional.',dicas:'Exige CNPJ ativo (ME ou acima). Negocie prazo de pagamento — 28/56 dias é padrão.'},
  {nome:'Distrito das Farmácias — Rua Barão de Itapetininga',cidade:'São Paulo – SP',emoji:'💊',especialidades:['Medicamentos','Insumos farmacêuticos','Dermocosméticos','Equipamentos médicos'],ticketMin:'R$ 400',aceitaMei:false,online:true,areas:['saude'],desc:'Polo de distribuidoras de insumos farmacêuticos e produtos de saúde em SP. Exige CRF e CNPJ regularizado.',dicas:'Obrigatório ter responsável técnico (farmacêutico) para compra de insumos controlados.'}
];

var NOMES_EXTRA={
  dropshipping:['Dropi Logística Ltda','Fulfillment Brasil ME','Estoque Digital Eireli','NovaDrop Distribuidora','DS Commerce Ltda','Envio Fácil ME'],
  infoproduto:['EduTech Brasil Ltda','Conhecimento Digital ME','Plataforma Saber Eireli','InfoLearn Brasil','Digital Master ME','Conteúdo PRO Ltda']
};

/* ══ V3 STATE ══ */


var V6_CATS = [
  {id:'alimentacao', label:'Alimentação', icon:'🍽️', count:48},
  {id:'moda',        label:'Moda',        icon:'👗', count:52},
  {id:'tecnologia',  label:'Tecnologia',  icon:'💻', count:31},
  {id:'beleza',      label:'Beleza',      icon:'✨', count:38},
  {id:'construcao',  label:'Construção',  icon:'🏗️', count:24},
  {id:'saude',       label:'Saúde',       icon:'🏥', count:29},
  {id:'casa',        label:'Casa e deco', icon:'🏠', count:35},
  {id:'pet',         label:'Pet shop',    icon:'🐾', count:22},
  {id:'esporte',     label:'Esporte',     icon:'⚽', count:27},
  {id:'infantil',    label:'Infantil',    icon:'🧸', count:19},
  {id:'papelaria',   label:'Papelaria',   icon:'📚', count:16},
  {id:'automotivo',  label:'Automotivo',  icon:'🚗', count:18}
];

var V6_POPULARES = [
  'camiseta polo','marmita fit','capinha celular','bijuteria','squeeze',
  'necessaire','vela aromática','mouse pad','tênis','cupcake','kit skincare',
  'agenda','chinelo','brinquedo montessori','suplemento whey'
];

var V6_PRODUTOS = [

/* ──────── ALIMENTAÇÃO ──────── */
{nome:'Marmita fit / saudável',cat:'alimentacao',margem:'35–55%',
  desc:'Produto de alta demanda e recorrência. Ticket entre R$15–35. Exige embalagem adequada e controle de temperatura.',
  barreira:85,cnae:'5620-1',ncm:'2104.20',ticketMin:'R$ 12/un',pedidoMin:'50 unidades/semana',
  tags:['Alta demanda','Recorrente','MEI viável'],
  fornecedores:[
    {nome:'CEAGESP / Ceasa regional',tipo:'local',link:'https://www.google.com/maps/search/ceasa+mercado+atacado'},
    {nome:'Makro Atacadista',tipo:'nacional',link:'https://www.makro.com.br'},
    {nome:'Frubana (app)',tipo:'digital',link:'https://www.frubana.com'},
    {nome:'Atacadão',tipo:'nacional',link:'https://www.atacadao.com.br'}
  ]},
{nome:'Cupcake / bolo artesanal',cat:'alimentacao',margem:'55–70%',
  desc:'Margem alta, custo de insumos baixo. Canais: encomenda direta, Instagram, iFood. Exige ANVISA para industrializar.',
  barreira:60,cnae:'1091-1',ncm:'1905.90',ticketMin:'R$ 8/un',pedidoMin:'Sem mínimo',
  tags:['Alta margem','Redes sociais','MEI viável'],
  fornecedores:[
    {nome:'Casa do Bolo (atacado)',tipo:'nacional',link:'https://www.google.com/search?q=atacado+insumos+confeitaria'},
    {nome:'Barry Callebaut revendas',tipo:'nacional',link:'https://www.google.com/search?q=chocolate+cobertura+atacado'},
    {nome:'Distribuidoras de insumos CNAE 4639-7',tipo:'local',link:'https://www.google.com/maps/search/distribuidor+insumos+alimenticios'}
  ]},
{nome:'Café especial / gourmet',cat:'alimentacao',margem:'45–65%',
  desc:'Mercado em expansão. Venda online e em estúdios. Fornecedores em MG, ES, SP com envio nacional.',
  barreira:30,cnae:'4637-1',ncm:'0901.21',ticketMin:'R$ 28/250g',pedidoMin:'R$ 200',
  tags:['Tendência','E-commerce','Nacional'],
  fornecedores:[
    {nome:'Fazendas do Brasil (atacado)',tipo:'nacional',link:'https://www.google.com/search?q=cafe+especial+atacado+fornecedor'},
    {nome:'Orfeu Cafés Especiais',tipo:'nacional',link:'https://www.orfeu.com.br'},
    {nome:'Mercado do Café MG',tipo:'regional',link:'https://www.google.com/search?q=atacado+cafe+especial+minas+gerais'}
  ]},
{nome:'Brigadeiro gourmet',cat:'alimentacao',margem:'60–75%',
  desc:'Ticket médio alto (R$4–8/un), baixo custo de produção. Muito bem posicionado em redes sociais e delivery.',
  barreira:50,cnae:'1091-1',ncm:'1806.90',ticketMin:'R$ 3/un',pedidoMin:'Sem mínimo',
  tags:['Alta margem','Instagram','Recorrente'],
  fornecedores:[
    {nome:'Harald (chocolate atacado)',tipo:'nacional',link:'https://www.google.com/search?q=Harald+chocolate+revendas'},
    {nome:'Distribuidoras CNAE 4639-7',tipo:'local',link:'https://www.google.com/maps/search/distribuidor+insumos+alimenticios'},
    {nome:'Cacau Show Franquia',tipo:'nacional',link:'https://www.cacaushow.com.br'}
  ]},
{nome:'Açaí na tigela',cat:'alimentacao',margem:'50–65%',
  desc:'Alta demanda, baixo ticket unitário mas alto volume. Fornecedores em PA, AM com entrega nacional congelado.',
  barreira:70,cnae:'5611-2',ncm:'0811.90',ticketMin:'R$ 18–35/tigela',pedidoMin:'R$ 300',
  tags:['Alta demanda','Recorrente','Nordeste crescente'],
  fornecedores:[
    {nome:'Amazonfrut (atacado açaí)',tipo:'nacional',link:'https://www.google.com/search?q=acai+atacado+fornecedor+nacional'},
    {nome:'Distribuidores regionais açaí',tipo:'local',link:'https://www.google.com/maps/search/distribuidor+acai+atacado'},
    {nome:'Bem Açaí (atacado)',tipo:'nacional',link:'https://www.google.com/search?q=bem+acai+atacado'}
  ]},
{nome:'Salgado / coxinha artesanal',cat:'alimentacao',margem:'50–65%',
  desc:'Alta demanda para eventos, festas e delivery. Produto com boa escala de produção e custo acessível.',
  barreira:75,cnae:'5620-1',ncm:'1902.30',ticketMin:'R$ 3–7/un',pedidoMin:'Sem mínimo',
  tags:['Alta demanda','Eventos','MEI viável'],
  fornecedores:[
    {nome:'Distribuidoras de insumos locais',tipo:'local',link:'https://www.google.com/maps/search/distribuidor+insumos+alimenticios'},
    {nome:'Seara / BRF (atacado)',tipo:'nacional',link:'https://www.google.com/search?q=seara+brf+atacado+revendas'},
    {nome:'Makro Atacadista',tipo:'nacional',link:'https://www.makro.com.br'}
  ]},

/* ──────── MODA ──────── */
{nome:'Camiseta polo',cat:'moda',margem:'40–60%',
  desc:'Produto atemporal, alta rotatividade. Brás e Bom Retiro têm preço de R$12–18 no atacado. Estampa própria diferencia.',
  barreira:25,cnae:'4641-9',ncm:'6105.10',ticketMin:'R$ 12/un',pedidoMin:'R$ 200',
  tags:['Alta rotatividade','Atacado acessível','Personalizável'],
  fornecedores:[
    {nome:'Polo do Brás — SP',tipo:'polo',link:'https://www.google.com/maps/search/bras+sao+paulo+moda+atacado'},
    {nome:'Polo Bom Retiro — SP',tipo:'polo',link:'https://www.google.com/maps/search/bom+retiro+sao+paulo+atacado'},
    {nome:'Moda Center Caruaru — PE',tipo:'polo',link:'https://www.google.com/maps/search/polo+moda+caruaru'},
    {nome:'Brás Online',tipo:'digital',link:'https://brasonline.com.br'}
  ]},
{nome:'Vestido feminino',cat:'moda',margem:'45–65%',
  desc:'Alta margem, especialmente em tecido viscose e linho. Bom Retiro e confecções em Goiânia têm bom custo-benefício.',
  barreira:22,cnae:'4641-9',ncm:'6204.49',ticketMin:'R$ 18/un',pedidoMin:'R$ 300',
  tags:['Alta margem','Instagram','Sazonalidade'],
  fornecedores:[
    {nome:'Polo Bom Retiro — SP',tipo:'polo',link:'https://www.google.com/maps/search/bom+retiro+vestidos+atacado'},
    {nome:'Confecções Goiânia — GO',tipo:'regional',link:'https://www.google.com/search?q=confeccoes+goiania+atacado+vestidos'},
    {nome:'Ropas Atacado',tipo:'digital',link:'https://ropas.com.br'}
  ]},
{nome:'Tênis casual / sneaker',cat:'moda',margem:'35–55%',
  desc:'Alta concorrência mas mercado enorme. Atacado em Novo Hamburgo (RS) e Franca (SP). Importados via Alibaba.',
  barreira:35,cnae:'4642-7',ncm:'6404.19',ticketMin:'R$ 35/par',pedidoMin:'R$ 500',
  tags:['Alto volume','Polo RS e SP','Importado viável'],
  fornecedores:[
    {nome:'Polo Novo Hamburgo — RS',tipo:'polo',link:'https://www.google.com/maps/search/novo+hamburgo+calcados+atacado'},
    {nome:'Polo Franca — SP',tipo:'polo',link:'https://www.google.com/maps/search/franca+sp+calcados+atacado'},
    {nome:'Alibaba Brasil (importação)',tipo:'digital',link:'https://www.alibaba.com'}
  ]},
{nome:'Chinelo personalizado',cat:'moda',margem:'50–70%',
  desc:'Sublimação/silk em chinelo Havaianas branco. Baixo custo de entrada, ótimo para presente e eventos.',
  barreira:20,cnae:'4642-7',ncm:'6402.99',ticketMin:'R$ 8/par',pedidoMin:'48 pares',
  tags:['Alta margem','Personalização','Baixo investimento'],
  fornecedores:[
    {nome:'Havaianas Atacado (linha branca)',tipo:'nacional',link:'https://www.google.com/search?q=havaianas+branca+atacado+sublimacao'},
    {nome:'Distribuidoras de chinelos',tipo:'local',link:'https://www.google.com/maps/search/calcados+atacado+distribuidora'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},
{nome:'Moda fitness / legging',cat:'moda',margem:'45–65%',
  desc:'Mercado em expansão constante. Tecidos técnicos (supplex, dry-fit) disponíveis em atacadistas de SP e GO.',
  barreira:28,cnae:'4641-9',ncm:'6211.43',ticketMin:'R$ 22/un',pedidoMin:'R$ 400',
  tags:['Tendência','E-commerce forte','Recorrente'],
  fornecedores:[
    {nome:'Polo Brás/Bom Retiro — SP',tipo:'polo',link:'https://www.google.com/maps/search/fitness+moda+atacado+sao+paulo'},
    {nome:'Cia Marítima Atacado',tipo:'nacional',link:'https://www.google.com/search?q=moda+fitness+atacado+fornecedor'},
    {nome:'Confecções Goiânia',tipo:'regional',link:'https://www.google.com/search?q=confeccoes+goiania+fitness+atacado'}
  ]},
{nome:'Bijuteria / semijoia',cat:'moda',margem:'55–75%',
  desc:'Alta margem. Polo de Limeira (SP) é referência nacional. Pedido mínimo acessível. Ótimo para Instagram e Shopee.',
  barreira:15,cnae:'4783-1',ncm:'7117.19',ticketMin:'R$ 5/un',pedidoMin:'R$ 150',
  tags:['Alta margem','Limeira SP','Instagram'],
  fornecedores:[
    {nome:'Polo Joalheiro Limeira — SP',tipo:'polo',link:'https://www.google.com/maps/search/limeira+sp+semijoias+atacado'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+de+marco+sao+paulo+bijuteria'},
    {nome:'Atacadista semijoias online',tipo:'digital',link:'https://www.google.com/search?q=semijoias+atacado+online+fornecedor'}
  ]},
{nome:'Bolsa feminina',cat:'moda',margem:'45–65%',
  desc:'Grande variedade de preços. Brás tem opções de R$15–R$80 no atacado. Alta saída em festas e datas comemorativas.',
  barreira:25,cnae:'4641-9',ncm:'4202.22',ticketMin:'R$ 18/un',pedidoMin:'R$ 300',
  tags:['Alta rotatividade','Datas sazonais','Brás SP'],
  fornecedores:[
    {nome:'Polo do Brás — SP',tipo:'polo',link:'https://www.google.com/maps/search/bras+bolsas+atacado+sao+paulo'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+bolsas+atacado'},
    {nome:'Brás Online',tipo:'digital',link:'https://brasonline.com.br'}
  ]},
{nome:'Pijama / loungewear',cat:'moda',margem:'50–65%',
  desc:'Crescimento acelerado pós-pandemia. Tecido microsoft e malha são os mais vendidos. Ótimo para atacado online.',
  barreira:25,cnae:'4641-9',ncm:'6207.91',ticketMin:'R$ 20/un',pedidoMin:'R$ 300',
  tags:['Tendência','Conforto','E-commerce'],
  fornecedores:[
    {nome:'Confecções Brás/Bom Retiro',tipo:'polo',link:'https://www.google.com/maps/search/pijama+atacado+sao+paulo'},
    {nome:'Ropas Atacado',tipo:'digital',link:'https://ropas.com.br'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},

/* ──────── TECNOLOGIA ──────── */
{nome:'Capinha de celular',cat:'tecnologia',margem:'50–70%',
  desc:'Produto leve, fácil envio, sem perecibilidade. Importação direta do Alibaba com custo de R$2–5/un. Alta escala.',
  barreira:10,cnae:'4751-2',ncm:'3926.90',ticketMin:'R$ 2/un',pedidoMin:'100 un',
  tags:['Margem alta','E-commerce','Importado viável'],
  fornecedores:[
    {nome:'Santa Ifigênia — SP',tipo:'polo',link:'https://www.google.com/maps/search/santa+ifigenia+sp+acessorios+celular'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'},
    {nome:'Ali Express Brasil',tipo:'digital',link:'https://www.aliexpress.com'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+sp+acessorios+tecnologia'}
  ]},
{nome:'Fone de ouvido / headphone',cat:'tecnologia',margem:'40–60%',
  desc:'Mercado amplo. Produtos nacionais de entrada custam R$15–40 no atacado. Bluetooth domina as vendas.',
  barreira:15,cnae:'4751-2',ncm:'8518.30',ticketMin:'R$ 15/un',pedidoMin:'R$ 300',
  tags:['Alta demanda','Bluetooth preferido','Shopee forte'],
  fornecedores:[
    {nome:'Santa Ifigênia — SP',tipo:'polo',link:'https://www.google.com/maps/search/santa+ifigenia+fone+ouvido+atacado'},
    {nome:'Positivo Atacado',tipo:'nacional',link:'https://www.google.com/search?q=positivo+fone+atacado+revendas'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},
{nome:'Carregador / cabo USB',cat:'tecnologia',margem:'45–65%',
  desc:'Produto consumível, compra recorrente. Diferencial em qualidade (certificado Inmetro) ou design.',
  barreira:12,cnae:'4751-2',ncm:'8544.42',ticketMin:'R$ 5/un',pedidoMin:'100 un',
  tags:['Consumível','Recorrente','Certificação diferencia'],
  fornecedores:[
    {nome:'Santa Ifigênia — SP',tipo:'polo',link:'https://www.google.com/maps/search/santa+ifigenia+carregador+atacado'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'},
    {nome:'Distribuidoras eletrônicos',tipo:'local',link:'https://www.google.com/maps/search/distribuidora+eletronicos+atacado'}
  ]},
{nome:'Suporte celular / apoio mesa',cat:'tecnologia',margem:'55–70%',
  desc:'Crescimento com home office. Custo baixo, fácil embalagem. Muito pesquisado no Mercado Livre e Shopee.',
  barreira:10,cnae:'4789-0',ncm:'3926.90',ticketMin:'R$ 3/un',pedidoMin:'50 un',
  tags:['Home office','Alta margem','Shopee forte'],
  fornecedores:[
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+suporte+celular+atacado'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'},
    {nome:'Ali Express Brasil',tipo:'digital',link:'https://www.aliexpress.com'}
  ]},

/* ──────── BELEZA ──────── */
{nome:'Kit skincare / facial',cat:'beleza',margem:'45–65%',
  desc:'Mercado em expansão. Kits com hidratante + sérum + protetor vendem bem. Fornecedores nacionais com boa margem.',
  barreira:20,cnae:'4772-5',ncm:'3304.99',ticketMin:'R$ 25/kit',pedidoMin:'R$ 300',
  tags:['Tendência','Kit vende mais','ANVISA obrigatório'],
  fornecedores:[
    {nome:'Natura Distribuidores',tipo:'nacional',link:'https://www.natura.com.br'},
    {nome:'Beauty Buy',tipo:'nacional',link:'https://www.google.com/search?q=beauty+buy+atacado+cosmeticos'},
    {nome:'Polo Duque de Caxias — RJ',tipo:'polo',link:'https://www.google.com/maps/search/duque+caxias+cosmeticos+atacado'},
    {nome:'TotalBeleza',tipo:'nacional',link:'https://www.google.com/search?q=totalbeleza+atacado'}
  ]},
{nome:'Shampoo / condicionador',cat:'beleza',margem:'35–50%',
  desc:'Alta rotatividade, produto consumível. Linhas profissionais têm melhor margem. Distribuidoras com pedido mínimo baixo.',
  barreira:25,cnae:'4772-5',ncm:'3305.10',ticketMin:'R$ 18/un',pedidoMin:'R$ 200',
  tags:['Consumível','Recorrente','Profissional diferencia'],
  fornecedores:[
    {nome:'LOreal Professionnel revendas',tipo:'nacional',link:'https://www.google.com/search?q=loreal+professionnel+revendas+atacado'},
    {nome:'Beauty Buy',tipo:'nacional',link:'https://www.google.com/search?q=beauty+buy+shampoo+atacado'},
    {nome:'Distribuidoras cosméticos locais',tipo:'local',link:'https://www.google.com/maps/search/distribuidora+cosmeticos+atacado'}
  ]},
{nome:'Perfume / colônia',cat:'beleza',margem:'50–70%',
  desc:'Alta margem especialmente em fragrâncias inspiradas. Importação direta da Turquia e Dubai com excelente custo.',
  barreira:20,cnae:'4772-5',ncm:'3303.00',ticketMin:'R$ 15/un',pedidoMin:'R$ 400',
  tags:['Alta margem','Importado viável','Presente frequente'],
  fornecedores:[
    {nome:'25 de Março — SP (importados)',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+perfume+atacado'},
    {nome:'Distribuidoras perfumaria',tipo:'local',link:'https://www.google.com/maps/search/distribuidora+perfumaria+atacado'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},
{nome:'Esmalte / base',cat:'beleza',margem:'50–65%',
  desc:'Produto de baixo custo e alta rotatividade. Kits temáticos e coleções sazonais têm boa saída.',
  barreira:15,cnae:'4772-5',ncm:'3304.30',ticketMin:'R$ 3/un',pedidoMin:'R$ 150',
  tags:['Baixo custo','Alta rotatividade','Kits vendem'],
  fornecedores:[
    {nome:'Hits Especialita atacado',tipo:'nacional',link:'https://www.google.com/search?q=hits+specialita+esmalte+atacado'},
    {nome:'Risqué Distribuidores',tipo:'nacional',link:'https://www.google.com/search?q=risque+esmalte+atacado'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+esmalte+atacado'}
  ]},
{nome:'Escova de cabelo / pente',cat:'beleza',margem:'45–60%',
  desc:'Alta demanda constante. Escovas profissionais têm margem superior. Kits com acessórios aumentam ticket.',
  barreira:18,cnae:'4772-5',ncm:'9605.00',ticketMin:'R$ 8/un',pedidoMin:'R$ 200',
  tags:['Demanda constante','Profissional diferencia'],
  fornecedores:[
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+escova+cabelo+atacado'},
    {nome:'Distribuidoras beleza',tipo:'local',link:'https://www.google.com/maps/search/distribuidora+beleza+atacado'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},

/* ──────── CASA E DECO ──────── */
{nome:'Vela aromática / difusor',cat:'casa',margem:'60–75%',
  desc:'Tendência consolidada. Baixo custo de produção (parafina + essência), ótima margem. Muito vendido no Instagram.',
  barreira:15,cnae:'4789-0',ncm:'3406.00',ticketMin:'R$ 8/un',pedidoMin:'Sem mínimo',
  tags:['Alta margem','Artesanal','Instagram forte'],
  fornecedores:[
    {nome:'Kaiak Essências (atacado)',tipo:'nacional',link:'https://www.google.com/search?q=essencias+aromaticas+atacado+fornecedor'},
    {nome:'Distribuidoras parafina',tipo:'local',link:'https://www.google.com/maps/search/parafina+atacado+fornecedor'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+vela+aromatica+atacado'}
  ]},
{nome:'Quadro decorativo / poster',cat:'casa',margem:'55–70%',
  desc:'Print on demand elimina estoque. Canvases e molduras vendidos em Mercado Livre com entrega nacional.',
  barreira:10,cnae:'4789-0',ncm:'4911.99',ticketMin:'R$ 15/un',pedidoMin:'Sem mínimo (POD)',
  tags:['Print on demand','Sem estoque','Escalável'],
  fornecedores:[
    {nome:'Printful (POD)',tipo:'digital',link:'https://www.printful.com/br'},
    {nome:'Gráficas digitais locais',tipo:'local',link:'https://www.google.com/maps/search/grafica+digital+impressao+sob+demanda'},
    {nome:'Molduras atacado',tipo:'local',link:'https://www.google.com/maps/search/molduras+atacado+fornecedor'}
  ]},
{nome:'Necessaire / bolsa organizadora',cat:'casa',margem:'50–65%',
  desc:'Alta demanda em datas comemorativas. Brás e 25 de Março têm ótimas opções. Personalização via silk screen.',
  barreira:18,cnae:'4789-0',ncm:'4202.12',ticketMin:'R$ 10/un',pedidoMin:'R$ 200',
  tags:['Presentes','Brás SP','Personalizável'],
  fornecedores:[
    {nome:'Polo do Brás — SP',tipo:'polo',link:'https://www.google.com/maps/search/bras+sp+necessaire+atacado'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+sp+bolsa+organizadora'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},
{nome:'Squeeze / garrafa térmica',cat:'casa',margem:'45–60%',
  desc:'Alta demanda ano-round. Térmica de qualidade diferencia. Personalização com logo agrada empresas (B2B).',
  barreira:20,cnae:'4789-0',ncm:'3924.10',ticketMin:'R$ 12/un',pedidoMin:'50 un',
  tags:['B2C e B2B','Personalização','Presente corporativo'],
  fornecedores:[
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+squeeze+garrafa+termica+atacado'},
    {nome:'Atacado Embalagens SP',tipo:'nacional',link:'https://www.google.com/search?q=squeeze+termica+atacado+fornecedor'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},

/* ──────── PET SHOP ──────── */
{nome:'Ração premium',cat:'pet',margem:'25–40%',
  desc:'Mercado de R$30bi/ano. Margem menor mas volume alto e fidelização. Revendedor tem acesso a preço diferenciado.',
  barreira:35,cnae:'4771-7',ncm:'2309.10',ticketMin:'R$ 80/saco',pedidoMin:'R$ 500',
  tags:['Mercado gigante','Fidelização','Volume alto'],
  fornecedores:[
    {nome:'Premier Pet Distribuidores',tipo:'nacional',link:'https://www.google.com/search?q=premier+pet+distribuidores+atacado'},
    {nome:'Royal Canin revendas',tipo:'nacional',link:'https://www.google.com/search?q=royal+canin+revendas+atacado'},
    {nome:'PetLove Atacado B2B',tipo:'digital',link:'https://www.google.com/search?q=petlove+b2b+atacado+pet'}
  ]},
{nome:'Roupinha de pet / fantasia',cat:'pet',margem:'55–70%',
  desc:'Nicho em expansão acelerada. Alta margem, baixo custo. Instagram e TikTok são canais naturais de venda.',
  barreira:12,cnae:'4789-0',ncm:'6211.49',ticketMin:'R$ 8/un',pedidoMin:'R$ 200',
  tags:['Nicho crescente','Alta margem','Redes sociais'],
  fornecedores:[
    {nome:'Polo do Brás — SP',tipo:'polo',link:'https://www.google.com/maps/search/bras+roupinha+pet+atacado'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+pet+shop+atacado'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},
{nome:'Cama / casinha para pet',cat:'pet',margem:'45–60%',
  desc:'Ticket médio de R$60–200. Fabricação própria com almofadas/espumas é opção de alta margem.',
  barreira:25,cnae:'4789-0',ncm:'6307.90',ticketMin:'R$ 25/un',pedidoMin:'R$ 300',
  tags:['Ticket médio alto','Fabricação própria viável'],
  fornecedores:[
    {nome:'Distribuidoras artigos pet',tipo:'local',link:'https://www.google.com/maps/search/distribuidora+pet+shop+atacado'},
    {nome:'MadeiraMadeira (matéria-prima)',tipo:'nacional',link:'https://www.madeiramadeira.com.br'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},

/* ──────── ESPORTE ──────── */
{nome:'Suplemento whey protein',cat:'esporte',margem:'30–50%',
  desc:'Mercado de R$3bi/ano. Revendedores acesso a preços 30–40% abaixo do varejo. E-commerce muito forte.',
  barreira:25,cnae:'4771-7',ncm:'2106.10',ticketMin:'R$ 65/kg',pedidoMin:'R$ 500',
  tags:['E-commerce forte','Fidelização','Crescimento 22%/ano'],
  fornecedores:[
    {nome:'Integralmedica Distribuidores',tipo:'nacional',link:'https://www.google.com/search?q=integralmedica+distribuidores+atacado'},
    {nome:'Max Titanium revendas',tipo:'nacional',link:'https://www.google.com/search?q=max+titanium+revendas+atacado'},
    {nome:'Vimer Distribuidora',tipo:'nacional',link:'https://www.google.com/search?q=vimer+distribuidora+suplementos'}
  ]},
{nome:'Caneleira / luva de boxe',cat:'esporte',margem:'45–60%',
  desc:'Nicho bem definido, público fiel. MMA e boxe em crescimento. Kits completos têm boa saída.',
  barreira:20,cnae:'4763-6',ncm:'9506.91',ticketMin:'R$ 25/par',pedidoMin:'R$ 400',
  tags:['Nicho fiel','MMA em alta','Kits vendem'],
  fornecedores:[
    {nome:'Everlast Distribuidores',tipo:'nacional',link:'https://www.google.com/search?q=everlast+distribuidores+brasil'},
    {nome:'Alibaba Brasil (importação)',tipo:'digital',link:'https://www.alibaba.com'},
    {nome:'Distribuidoras artigos esportivos',tipo:'local',link:'https://www.google.com/maps/search/distribuidora+artigos+esportivos'}
  ]},

/* ──────── INFANTIL ──────── */
{nome:'Brinquedo Montessori',cat:'infantil',margem:'50–65%',
  desc:'Tendência educacional crescente. Madeira natural tem boa aceitação dos pais. Produção própria viável.',
  barreira:20,cnae:'4763-6',ncm:'9503.00',ticketMin:'R$ 15/un',pedidoMin:'R$ 300',
  tags:['Tendência','Educacional','Madeira natural'],
  fornecedores:[
    {nome:'Distribuidoras brinquedos SP',tipo:'local',link:'https://www.google.com/maps/search/distribuidora+brinquedos+atacado'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+brinquedos+atacado'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},
{nome:'Roupa infantil',cat:'infantil',margem:'45–60%',
  desc:'Alta rotatividade — crianças crescem rápido. Moda bebê tem margem superior. Brás e confecções de GO atendem bem.',
  barreira:25,cnae:'4641-9',ncm:'6209.20',ticketMin:'R$ 12/un',pedidoMin:'R$ 250',
  tags:['Alta rotatividade','Presente frequente','Brás SP'],
  fornecedores:[
    {nome:'Polo do Brás — SP',tipo:'polo',link:'https://www.google.com/maps/search/bras+roupa+infantil+atacado'},
    {nome:'Moda Center Caruaru — PE',tipo:'polo',link:'https://www.google.com/maps/search/caruaru+roupa+infantil+atacado'},
    {nome:'Ropas Atacado',tipo:'digital',link:'https://ropas.com.br'}
  ]},

/* ──────── PAPELARIA ──────── */
{nome:'Agenda / caderno personalizado',cat:'papelaria',margem:'50–65%',
  desc:'Produto sazonal (virada de ano) mas venda contínua corporativa. Personalização agrega muito valor.',
  barreira:20,cnae:'4789-0',ncm:'4820.10',ticketMin:'R$ 15/un',pedidoMin:'R$ 300',
  tags:['Corporativo','Personalizável','Sazonalidade'],
  fornecedores:[
    {nome:'Tilibra Distribuidores',tipo:'nacional',link:'https://www.google.com/search?q=tilibra+distribuidores+atacado'},
    {nome:'Gráficas digitais locais',tipo:'local',link:'https://www.google.com/maps/search/grafica+agenda+personalizada'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+papelaria+atacado'}
  ]},
{nome:'Caneta / conjunto de escrita',cat:'papelaria',margem:'40–60%',
  desc:'Produto corporativo e escolar. Conjuntos premium têm boa margem. Personalização com logo abre mercado B2B.',
  barreira:15,cnae:'4789-0',ncm:'9608.10',ticketMin:'R$ 2/un',pedidoMin:'R$ 200',
  tags:['B2B forte','Personalização','25 de Março'],
  fornecedores:[
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+caneta+papelaria+atacado'},
    {nome:'BIC Distribuidores',tipo:'nacional',link:'https://www.google.com/search?q=bic+distribuidores+atacado'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},

/* ──────── AUTOMOTIVO ──────── */
{nome:'Capa de banco / tapete automotivo',cat:'automotivo',margem:'45–60%',
  desc:'Alta demanda de proprietários de veículos. Personalização por modelo de carro diferencia. Mercado Livre forte.',
  barreira:20,cnae:'4530-7',ncm:'8708.99',ticketMin:'R$ 30/jogo',pedidoMin:'R$ 400',
  tags:['Alta demanda','Personalização por modelo','ML forte'],
  fornecedores:[
    {nome:'Distribuidoras acessórios auto',tipo:'local',link:'https://www.google.com/maps/search/distribuidora+acessorios+automotivos'},
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+automotivo+atacado'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'}
  ]},
{nome:'Perfume / aromatizador de carro',cat:'automotivo',margem:'55–70%',
  desc:'Consumível de alta margem. Custo baixo, venda recorrente. Público masculino com boa disposição a pagar.',
  barreira:12,cnae:'4530-7',ncm:'3307.49',ticketMin:'R$ 5/un',pedidoMin:'100 un',
  tags:['Alta margem','Consumível','Recorrente'],
  fornecedores:[
    {nome:'25 de Março — SP',tipo:'polo',link:'https://www.google.com/maps/search/25+marco+aromatizador+carro+atacado'},
    {nome:'Alibaba Brasil',tipo:'digital',link:'https://www.alibaba.com'},
    {nome:'Distribuidoras acessórios',tipo:'local',link:'https://www.google.com/maps/search/distribuidora+acessorios+carro+atacado'}
  ]}
];
