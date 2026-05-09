function selModo(btn,modo){
  document.querySelectorAll('.modo-btn').forEach(function(b){b.classList.remove('selected')});
  btn.classList.add('selected');
  S_MODO=modo;
  S.modo=modo;
}

/* ══ LOCALIZAÇÃO — TABS CEP / UF ══ */
var LOC_TAB = 'cep'; // 'cep' ou 'uf'

function setLocTab(tab){
  LOC_TAB = tab;
  var isDigital = (S_MODO==='digital'||S.area==='infoproduto'||S.area==='dropshipping');
  if(isDigital) return; // digital tem bloco próprio
  document.getElementById('s4-cep-block').style.display = tab==='cep' ? 'block' : 'none';
  document.getElementById('s4-uf-block').style.display  = tab==='uf'  ? 'block' : 'none';
  document.getElementById('loc-tab-cep').classList.toggle('active', tab==='cep');
  document.getElementById('loc-tab-cep').setAttribute('aria-selected', tab==='cep'?'true':'false');
  document.getElementById('loc-tab-uf').classList.toggle('active',  tab==='uf');
  document.getElementById('loc-tab-uf').setAttribute('aria-selected', tab==='uf'?'true':'false');
  // Se já tem UF selecionado ao trocar de tab, habilitar botão
  if(tab==='uf' && S.uf){
    document.getElementById('btn-buscar').disabled = false;
  }
}

var CIDADES_UF = {
  AC:'Rio Branco',AL:'Maceió',AP:'Macapá',AM:'Manaus',BA:'Salvador',
  CE:'Fortaleza',DF:'Brasília',ES:'Vitória',GO:'Goiânia',MA:'São Luís',
  MT:'Cuiabá',MS:'Campo Grande',MG:'Belo Horizonte',PA:'Belém',
  PB:'João Pessoa',PR:'Curitiba',PE:'Recife',PI:'Teresina',
  RJ:'Rio de Janeiro',RN:'Natal',RS:'Porto Alegre',RO:'Porto Velho',
  RR:'Boa Vista',SC:'Florianópolis',SP:'São Paulo',SE:'Aracaju',TO:'Palmas'
};

function selecionarUF(uf){
  if(!uf) return;
  S.uf = uf;
  S.cidade = document.getElementById('cidade-input').value.trim() || CIDADES_UF[uf] || uf;
  var coords = UF_COORDS[uf];
  if(coords){ S.lat = coords[0]; S.lng = coords[1]; }
  var cidLower = S.cidade.toLowerCase();
  S.popEstimada = IBGE_POP[cidLower] || estimarPop(S.cidade);
  var elR = document.getElementById('uf-result');
  elR.style.display = 'flex';
  elR.className = 'ibox ok';
  document.getElementById('uf-icon').textContent = '📍';
  document.getElementById('uf-txt').textContent = S.cidade + ' – ' + uf + ' · Pop. ~' + fmtNum(S.popEstimada);
  document.getElementById('btn-buscar').disabled = false;
}

function atualizarCidade(val){
  var uf = (document.getElementById('uf-select')||{}).value || S.uf;
  if(!uf) return;
  S.cidade = val.trim() || CIDADES_UF[uf] || uf;
  if(val.trim()){
    var cidLower = val.trim().toLowerCase();
    S.popEstimada = IBGE_POP[cidLower] || estimarPop(val.trim());
    var elR = document.getElementById('uf-result');
    elR.style.display = 'flex';
    elR.className = 'ibox ok';
    document.getElementById('uf-icon').textContent = '📍';
    document.getElementById('uf-txt').textContent = val.trim() + ' – ' + uf + ' · Pop. ~' + fmtNum(S.popEstimada);
  }
}

function selecionarUFDig(uf){
  if(!uf) return;
  S.uf = uf;
  S.cidade = CIDADES_UF[uf] || uf;
  var coords = UF_COORDS[uf];
  if(coords){ S.lat = coords[0]; S.lng = coords[1]; }
  S.popEstimada = estimarPop(S.cidade);
  var elR = document.getElementById('cep-result-dig');
  elR.style.display = 'flex';
  elR.className = 'ibox ok';
  document.getElementById('cep-icon-dig').textContent = '📍';
  document.getElementById('cep-txt-dig').textContent = S.cidade + ' – ' + uf;
  document.getElementById('btn-buscar').disabled = false;
}

function irParaLocalizacao(){
  var isDigital=(S_MODO==='digital'||S.area==='infoproduto'||S.area==='dropshipping');
  var s4title=document.getElementById('s4-title');
  var s4sub=document.getElementById('s4-sub');
  var cepBlock=document.getElementById('s4-cep-block');
  var digBlock=document.getElementById('s4-digital-block');
  var btnBuscar=document.getElementById('btn-buscar');
  var ufBlock = document.getElementById('s4-uf-block');
  var raioBlock = document.getElementById('raio-block');
  var locTabCep = document.getElementById('loc-tab-cep');
  var locTabUf  = document.getElementById('loc-tab-uf');
  if(isDigital){
    s4title.textContent='Sua região de referência';
    s4sub.textContent='No modo digital não há barreira territorial. Selecione seu estado para estimar o mercado local.';
    cepBlock.style.display='none';
    if(ufBlock) ufBlock.style.display='none';
    digBlock.style.display='block';
    if(raioBlock) raioBlock.style.display='none';
    if(locTabCep) locTabCep.style.display='none';
    if(locTabUf)  locTabUf.style.display='none';
    btnBuscar.disabled=false;
  } else {
    s4title.textContent='Sua localização';
    s4sub.textContent='Informe seu CEP ou selecione seu estado para mapear o mercado na sua região.';
    digBlock.style.display='none';
    if(raioBlock) raioBlock.style.display='flex';
    if(locTabCep) locTabCep.style.display='block';
    if(locTabUf)  locTabUf.style.display='block';
    // Mostrar tab ativo
    cepBlock.style.display = LOC_TAB==='cep' ? 'block' : 'none';
    if(ufBlock) ufBlock.style.display = LOC_TAB==='uf' ? 'block' : 'none';
    // Habilitar botão se já tem localização
    btnBuscar.disabled = !(S.uf || S.cidade);
  }
  go('s4');
}

function fmtCepDig(inp){
  var v=inp.value.replace(/\D/g,'');
  if(v.length>5) v=v.slice(0,5)+'-'+v.slice(5,8);
  inp.value=v;
  if(v.replace('-','').length===8) buscarCepDig();
}

function buscarCepDig(){} /* substituído por selecionarUFDig */

/* ══ V3: RENDER DIGITAL ══ */
function renderDigital(area){
  var el=document.getElementById('tab-digital');
  var fornDig=FORN_DIGITAIS[S.area]||[];
  var barreira=BARREIRA[S.area]||{pct:50,label:'Média',cor:'#f5a623',desc:''};
  var isDigital=(S_MODO==='digital'||S.area==='dropshipping'||S.area==='infoproduto');
  var html='';
  html+='<div class="v2-section-title">Índice de barreira territorial</div>';
  html+='<div class="market-box" style="margin-bottom:1rem">';
  html+='<div class="market-row"><span class="market-k">Barreira territorial</span><span class="market-v" style="color:'+barreira.cor+'">'+barreira.label+' ('+barreira.pct+'%)</span></div>';
  html+='<div class="market-row"><span class="market-k" style="width:100%">'+barreira.desc+'</span></div>';
  html+='<div class="barreira-wrap">';
  html+='<div class="barreira-label"><span>Sem barreira</span><span>Hiperlocal</span></div>';
  html+='<div class="barreira-bar"><div class="barreira-fill" style="width:'+barreira.pct+'%;background:'+barreira.cor+'"></div></div>';
  html+='</div></div>';
  if(isDigital){
    html+='<div class="digital-notice">🌐 Modo digital ativo — os fornecedores abaixo operam sem restrição geográfica e entregam em todo o Brasil.</div>';
  }
  if(fornDig.length){
    html+='<div class="v2-section-title">Fornecedores nacionais / digitais</div>';
    fornDig.forEach(function(f){
      var alcancePill=f.alcance==='global'?'<span class="bdg bp">🌍 Global</span>':f.alcance==='regional'?'<span class="bdg ba">🗺 Regional</span>':'<span class="bdg bt">🇧🇷 Nacional</span>';
      html+='<div class="forn-digital-card">';
      html+='<div class="forn-digital-top"><span class="forn-digital-name">'+f.nome+'</span>'+alcancePill+'</div>';
      html+='<div class="forn-digital-meta">'+f.desc+'</div>';
      html+='<div class="forn-digital-tags">';
      f.tags.forEach(function(t){html+='<span class="bdg bgr">'+t+'</span>'});
      html+='</div>';
      html+='<a class="forn-link-btn" href="'+f.site+'" target="_blank" rel="noopener">Acessar site ↗</a>';
      html+='</div>';
    });
  } else {
    html+='<div class="ibox warn" style="margin-top:.5rem">Sem fornecedores digitais mapeados para esta área ainda. Em breve.</div>';
  }
  el.innerHTML=html;
}

/* ══ V4 PREVIEW: RENDER POLOS ══ */
function renderPolos(area){
  var el=document.getElementById('tab-polos');
  var polosArea=POLOS.filter(function(p){return p.areas.indexOf(S.area)>=0});
  var html='';
  if(!polosArea.length){
    html+='<div class="empty-hist"><span class="eicon">🏬</span><p>Não há polo atacadista físico mapeado para '+area.label+'.<br>Esta área opera principalmente via fornecedores digitais — veja a aba Digital 🌐.</p></div>';
  } else {
    html+='<div class="v2-section-title">'+polosArea.length+' polo'+(polosArea.length>1?'s':'')+' relevante'+(polosArea.length>1?'s':'')+' para '+area.label+'</div>';
    polosArea.forEach(function(p){
      var mapsQ=encodeURIComponent(p.nome+' '+p.cidade);
      var mapsArea=encodeURIComponent(area.label+' atacado '+p.cidade);
      html+='<div class="polo-card">';
      html+='<div class="polo-card-header">';
      html+='<div>';
      html+='<div class="polo-card-nome">'+p.emoji+' '+p.nome+'</div>';
      html+='<div class="polo-card-loc">📍 '+p.cidade+'</div>';
      html+='</div>';
      html+='<div class="polo-card-badges">';
      html+=(p.aceitaMei?'<span class="bdg bt">MEI aceito</span>':'<span class="bdg br">CNPJ obrig.</span>');
      html+=(p.online?'<span class="bdg bb">Vende online</span>':'<span class="bdg bgr">Só presencial</span>');
      html+='</div></div>';
      html+='<div class="polo-card-desc">'+p.desc+'</div>';
      html+='<div class="polo-esp-list">';
      p.especialidades.forEach(function(e){html+='<span class="bdg bgr">'+e+'</span>'});
      html+='</div>';
      html+='<div class="polo-card-grid">';
      html+='<div class="polo-info-item"><div class="polo-info-label">Pedido mínimo</div><div class="polo-info-val">'+p.ticketMin+'</div></div>';
      html+='<div class="polo-info-item"><div class="polo-info-label">Formato</div><div class="polo-info-val">'+(p.online?'Presencial + Online':'Presencial')+'</div></div>';
      html+='</div>';
      html+='<div class="polo-dica">💡 '+p.dicas+'</div>';
      html+='<div style="display:flex;gap:7px;flex-wrap:wrap">';
      html+='<a class="polo-mapa-btn" href="https://www.google.com/maps/search/'+mapsQ+'" target="_blank" rel="noopener">📍 Ver no Maps</a>';
      html+='<a class="polo-mapa-btn" href="https://www.google.com/search?q='+encodeURIComponent('fornecedores '+area.label+' '+p.nome+' atacado')+'" target="_blank" rel="noopener">🔍 Buscar fornecedores</a>';
      if(p.online){
        html+='<a class="polo-mapa-btn" href="https://www.google.com/search?q='+encodeURIComponent(p.nome+' online atacado comprar')+'" target="_blank" rel="noopener">🌐 Comprar online</a>';
      }
      html+='</div></div>';
    });
    var outrosPolos=POLOS.filter(function(p){return p.areas.indexOf(S.area)<0}).slice(0,3);
    if(outrosPolos.length){
      html+='<div class="v2-section-title" style="margin-top:1.25rem">Outros polos do Brasil</div>';
      outrosPolos.forEach(function(p){
        var mq=encodeURIComponent(p.nome+' '+p.cidade);
        html+='<div class="polo-mini">';
        html+='<div class="polo-mini-icon">'+p.emoji+'</div>';
        html+='<div class="polo-mini-body"><div class="polo-mini-nome">'+p.nome+'</div><div class="polo-mini-loc">'+p.cidade+' · '+p.especialidades.slice(0,2).join(', ')+'</div></div>';
        html+='<a href="https://www.google.com/maps/search/'+mq+'" target="_blank" rel="noopener" style="font-size:11px;color:var(--amber);white-space:nowrap">Ver Maps →</a>';
        html+='</div>';
      });
    }
  }
  el.innerHTML=html;
}

/* ══ V3: NOMES EXTRAS ══ */
var NOMES={
  alimentacao:['Distribuidora Central Alimentos Ltda','Atacadão Norte Comércio ME','Frigorífico Regional Nordeste Eireli','Insumos Culinários Brasil ME','Central do Sabor Distribuidora','Abastece Fácil Ltda','Grãos & Cia Atacado ME','Frigorífico Nordeste ME','Distribuidora Alimentos Boa Vista Ltda','Temperos Brasil Distribuidora Ltda','Asa Branca Alimentos ME','Distribuidora São Francisco Eireli'],
  moda:['Confecções do Nordeste Ltda','Atacado Moda Brasil ME','Fashion Distribuidora Eireli','Tecidos & Aviamentos Ltda','Roupa Fácil Atacado','Moda Regional Distribuidora ME','Confecção Sol Nascente ME','Têxtil Norte Ltda'],
  tecnologia:['Tech Distribuidora Ltda','Eletrônicos do Brasil ME','Insumos TI Nordeste Eireli','Computadores & Cia Ltda','Digital Store Atacado ME','InfoParts Distribuidora Ltda'],
  beleza:['Cosméticos Nordeste Ltda','Beauty Distribuidora ME','Insumos Estética Eireli','Beleza Total Distribuidora','Cosméticos Naturais Brasil ME','Arte & Beleza Atacado Ltda'],
  construcao:['Material de Construção Brasil Ltda','Acabamentos & Cia ME','Ferragens do Norte Eireli','Tintas Distribuidora Ltda','Construção Fácil Atacado ME','Revestimentos Brasil Ltda'],
  saude:['Distribuidora Saúde Ltda','Farmacêutica Regional ME','Suplementos Brasil Eireli','Insumos Saúde Distribuidora','Vida & Saúde Atacado ME','Nutri Distribuidora Ltda']
};
var PORTES=['MEI','ME','ME','EPP','Ltda','Ltda'];

/* ══ USUÁRIO & HISTÓRICO ══ */
var USER={nome:'',historico:[]};
var STORAGE_KEY='fornecedorbr_user';

function _modalTrap(e){
  var modal=document.getElementById('modal-welcome');
  if(!modal||modal.style.display==='none') return;
  var focusable=modal.querySelectorAll('input,button,[tabindex]:not([tabindex="-1"])');
  var first=focusable[0];var last=focusable[focusable.length-1];
  if(e.key==='Tab'){
    if(e.shiftKey){if(document.activeElement===first){e.preventDefault();last.focus();}}
    else{if(document.activeElement===last){e.preventDefault();first.focus();}}
  }
  if(e.key==='Escape') pularCadastro();
}

function carregarUsuario(){
  try{
    var raw=localStorage.getItem(STORAGE_KEY);
    if(raw){
      USER=JSON.parse(raw);
      if(!USER.historico) USER.historico=[];
      atualizarHeaderUsuario();
      if(USER.nome) mostrarGreeting();
    } else {
      setTimeout(function(){
        document.getElementById('modal-welcome').style.display='flex';
        setTimeout(function(){document.getElementById('modal-name-input').focus();},100);
        document.addEventListener('keydown',_modalTrap);
      },600);
    }
  }catch(e){USER={nome:'',historico:[]};}
}

function salvarStorage(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(USER));}catch(e){}
}

function salvarNome(){
  var nome=document.getElementById('modal-name-input').value.trim();
  if(!nome) return;
  USER.nome=nome;
  salvarStorage();
  document.removeEventListener('keydown',_modalTrap);
  document.getElementById('modal-welcome').style.display='none';
  atualizarHeaderUsuario();
  mostrarGreeting();
}

function pularCadastro(){
  document.removeEventListener('keydown',_modalTrap);
  document.getElementById('modal-welcome').style.display='none';
}

function atualizarHeaderUsuario(){
  if(!USER.nome) return;
  document.getElementById('hbadge-default').style.display='none';
  var hu=document.getElementById('header-user');
  hu.style.display='flex';
  var iniciais=USER.nome.split(' ').slice(0,2).map(function(p){return p[0]}).join('').toUpperCase();
  document.getElementById('user-avatar').textContent=iniciais;
  document.getElementById('user-name-hdr').textContent=USER.nome.split(' ')[0];
  var qtd=USER.historico.length;
  document.getElementById('hist-count-badge').textContent=qtd+' pesquisa'+(qtd!==1?'s':'');
}

function mostrarGreeting(){
  if(!USER.nome) return;
  var bar=document.getElementById('greeting-bar');
  bar.style.display='flex';
  document.getElementById('greeting-name').textContent=USER.nome.split(' ')[0];
}

function salvarPesquisa(area,mercado,sat){
  if(!USER.nome) return;
  var pesquisa={
    id:Date.now(),
    ts:new Date().toISOString(),
    area:S.area,
    modo:S.modo||S_MODO,
    areaLabel:((AREAS[S.area]||AREAS_EXTRA[S.area])||AREAS.alimentacao).label,
    cidade:S.cidade,
    uf:S.uf,
    raio:S.raio,
    cep:S.cep,
    lat:S.lat,
    lng:S.lng,
    popEstimada:S.popEstimada,
    perfil:S.perfil,
    capital:S.capital,
    totalFornecedores:fornecedores.length,
    mercadoTotal:mercado.total,
    mercadoMktShare:mercado.mktShare,
    saturacaoIndice:sat.indice,
    avgScore:Math.round(fornecedores.reduce(function(a,f){return a+f.score},0)/fornecedores.length)
  };
  USER.historico.unshift(pesquisa);
  if(USER.historico.length>20) USER.historico=USER.historico.slice(0,20);
  salvarStorage();
  atualizarHeaderUsuario();
}

function renderHistorico(){
  var el=document.getElementById('hist-list');
  var sub=document.getElementById('hist-sub');
  if(!USER.historico.length){
    el.innerHTML='<div class="empty-hist"><span class="eicon">🔍</span><p>Nenhuma pesquisa salva ainda.<br>Faça sua primeira análise para ver o histórico aqui.</p></div>';
    sub.textContent='Nenhuma pesquisa salva ainda.';
    return;
  }
  sub.textContent=USER.historico.length+' pesquisa'+(USER.historico.length!==1?'s':'')+' salva'+(USER.historico.length!==1?'s':'')+'. Clique para recarregar.';
  var html='';
  USER.historico.forEach(function(p,i){
    var dt=new Date(p.ts);
    var dtStr=dt.toLocaleDateString('pt-BR')+' '+dt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    var areaEmoji={alimentacao:'🍽️',moda:'👗',tecnologia:'💻',beleza:'✨',construcao:'🏗️',saude:'🏥'}[p.area]||'📊';
    var satCor=p.saturacaoIndice>70?'var(--red)':p.saturacaoIndice>40?'var(--amber)':'var(--green)';
    html+='<div class="hist-card" tabindex="0" role="button" aria-label="Recarregar pesquisa: '+p.areaLabel+' em '+p.cidade+'" onclick="recarregarPesquisa('+i+')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();recarregarPesquisa('+i+')}">';
    html+='<button class="hist-del" onclick="event.stopPropagation();deletarPesquisa('+i+')" aria-label="Remover esta pesquisa" title="Remover">✕</button>';
    html+='<div class="hist-top">';
    html+='<div class="hist-title">'+areaEmoji+' '+p.areaLabel+' · '+p.cidade+' – '+p.uf+'</div>';
    html+='<div class="hist-date">'+dtStr+'</div>';
    html+='</div>';
    var histLoc=p.cep?'CEP '+p.cep.replace(/(\d{5})(\d{3})/,'$1-$2'):(p.cidade?p.cidade+(p.uf?' – '+p.uf:''):'Nacional');
    var histRaio=(p.modo==='digital'||p.raio>=500)?'Nacional':p.raio+'km';
    html+='<div class="hist-meta">'+histLoc+' · Raio '+histRaio+' · Perfil: '+(p.perfil||'—')+'</div>';
    html+='<div class="hist-stats">';
    html+='<span class="hist-stat">🏢 <strong>'+p.totalFornecedores+'</strong> fornecedores</span>';
    html+='<span class="hist-stat">💰 <strong>R$ '+fmtK(p.mercadoTotal)+'</strong>/mês</span>';
    html+='<span class="hist-stat">🛡 Score <strong>'+p.avgScore+'</strong>/100</span>';
    html+='<span class="hist-stat">Saturação: <strong style="color:'+satCor+'">'+p.saturacaoIndice+'%</strong></span>';
    html+='</div>';
    html+='</div>';
  });
  el.innerHTML=html;
}

function recarregarPesquisa(i){
  var p=USER.historico[i];
  S.area=p.area; S.cidade=p.cidade; S.uf=p.uf;
  S.raio=p.raio; S.cep=p.cep; S.lat=p.lat; S.lng=p.lng;
  S.popEstimada=p.popEstimada; S.perfil=p.perfil; S.capital=p.capital;
  S.modo=p.modo||'local'; S_MODO=p.modo||'local';
  if(mapObj){mapObj.remove();mapObj=null;circleObj=null;pinLayer=null;heatLayer=null;}
  go('s-loading');
  animLoading().then(function(){
    var area=AREAS[S.area]||AREAS_EXTRA[S.area]||AREAS.alimentacao;
    var isDigRec=(S_MODO==='digital'||S.area==='infoproduto'||S.area==='dropshipping');
    fornecedores=gerarFornecedores(area);
    calcScores();
    var mercado=calcMercado(area);
    var sat=calcSaturacao(area);
    document.getElementById('st-forn').textContent=fornecedores.length;
    document.getElementById('st-raio').textContent=isDigRec?'Nacional':S.raio+'km';
    document.getElementById('st-mercado').textContent='R$'+fmtK(mercado.total);
    document.getElementById('res-title').textContent='Análise — '+area.label;
    document.getElementById('res-sub').textContent=fornecedores.length+' fornecedores mapeados · '+S.cidade+' – '+S.uf+(isDigRec?'':' · Raio '+S.raio+'km')+' · Pop. ~'+fmtNum(S.popEstimada)+' hab.';
    document.getElementById('raio-map').value=S.raio;
    document.getElementById('rv-map').textContent=S.raio+'km';
    renderNichos(area);
    renderInteligencia(area,mercado);
    renderFornecedores(area);
    iaGerada=''; iaArea=''; iaLoc='';
    atualizarTabsVisiveis();
    setTab('nichos',document.querySelectorAll('.tab-btn')[0]);
    go('s-result');
  });
}

function deletarPesquisa(i){
  USER.historico.splice(i,1);
  salvarStorage();
  atualizarHeaderUsuario();
  renderHistorico();
}

function limparHistorico(){
  if(!confirm('Apagar todas as pesquisas?')) return;
  USER.historico=[];
  salvarStorage();
  atualizarHeaderUsuario();
  renderHistorico();
}

window.addEventListener('popstate',function(e){
  var id=(e.state&&e.state.screen)||'s-home';
  var el=document.getElementById(id);
  if(el){
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
    el.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
    if(id==='s-hist') renderHistorico();
    if(id==='s-v6') initV6();
  }
});
document.addEventListener('DOMContentLoaded',function(){
  history.replaceState({screen:'s-home'},'','#s-home');
  carregarUsuario();
});

/* ══ NAV ══ */
function go(id){
  document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
  var el=document.getElementById(id);
  el.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(id!=='s-loading') history.pushState({screen:id},'','#'+id);
  if(id==='s-hist') renderHistorico();
  if(id==='s-v6') initV6();
  var h=el.querySelector('h1,h2');
  if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}
}
function sel(btn,key,val){
  btn.parentElement.querySelectorAll('.opt-btn').forEach(function(b){b.classList.remove('selected')});
  btn.classList.add('selected');
  S[key]=val;
}
function validarEAvancar(destino,campo){
  if(campo&&!S[campo]){
    var cur=document.querySelector('.screen.active');
    if(cur){
      var grid=cur.querySelector('.opt-grid,.modo-selector');
      if(grid){
        grid.style.outline='1.5px solid var(--red)';
        grid.style.borderRadius='8px';
        setTimeout(function(){grid.style.outline='';},1400);
      }
    }
    return;
  }
  go(destino);
}

/* ══ CEP ══ */
function fmtCep(inp){
  var v=inp.value.replace(/\D/g,'');
  if(v.length>5) v=v.slice(0,5)+'-'+v.slice(5,8);
  inp.value=v;
  if(v.replace('-','').length===8 && LOC_TAB==='cep') buscarCep();
}
async function buscarCep(){
  var raw=document.getElementById('cep-input').value.replace(/\D/g,'');
  if(raw.length<8) return;
  var el=document.getElementById('cep-result');
  var txt=document.getElementById('cep-txt');
  var icon=document.getElementById('cep-icon');
  el.className='ibox'; el.style.display='flex';
  icon.textContent=''; txt.innerHTML='<span class="spin"></span>&nbsp;Buscando...';
  try{
    var r=await fetch('/api/cep?cep='+raw);
    if(!r.ok) throw new Error('CEP não encontrado');
    var d=await r.json();
    if(d.error) throw new Error(d.error);
    S.cep=raw; S.cidade=d.city||''; S.uf=d.state||'';
    if(d.location&&d.location.coordinates&&d.location.coordinates.latitude){
      S.lat=parseFloat(d.location.coordinates.latitude);
      S.lng=parseFloat(d.location.coordinates.longitude);
    }
    var cidLower=(S.cidade||'').toLowerCase();
    S.popEstimada=IBGE_POP[cidLower]||estimarPop(S.cidade);
    el.className='ibox ok'; icon.textContent='📍';
    txt.textContent=(d.street?d.street+', ':'')+d.city+' – '+d.state+' · Pop. ~'+fmtNum(S.popEstimada);
    document.getElementById('btn-buscar').disabled=false;
  }catch(e){
    el.className='ibox err'; icon.textContent='⚠️';
    txt.innerHTML='CEP não encontrado. <button type="button" style="background:none;border:none;padding:0;color:var(--blue);cursor:pointer;text-decoration:underline;font-family:inherit;font-size:inherit" onclick="setLocTab(\'uf\')">Usar estado →</button>';
    document.getElementById('btn-buscar').disabled=true;
  }
}
function estimarPop(cidade){
  if(!cidade) return 80000;
  var c=cidade.toLowerCase();
  if(c.includes('capital')||c.includes('metro')) return 600000;
  var seed=cidade.split('').reduce(function(a,ch){return a+ch.charCodeAt(0)},0);
  return 80000+((seed%12)*10000);
}

function atualizarTabsVisiveis(){
  var isDigital=(S_MODO==='digital'||S.area==='infoproduto'||S.area==='dropshipping');
  var isInfo=(S.area==='infoproduto');
  var mapaBtn=document.getElementById('tab-btn-mapa');
  var polosBtn=document.getElementById('tab-btn-polos');
  if(mapaBtn) mapaBtn.style.display=isDigital?'none':'';
  if(polosBtn) polosBtn.style.display=isInfo?'none':'';
}

/* ══ BUSCA PRINCIPAL ══ */
async function iniciarBusca(){
  var isDigital=(S_MODO==='digital'||S.area==='infoproduto'||S.area==='dropshipping');
  S.raio=isDigital?999:parseInt(document.getElementById('raio-in').value);
  if(!S.cidade&&isDigital){S.cidade='Brasil';S.uf='BR';}
  S.area=S.area||'alimentacao';
  if(mapObj){mapObj.remove();mapObj=null;circleObj=null;pinLayer=null;heatLayer=null;}
  go('s-loading');
  await animLoading();
  var area=AREAS[S.area]||AREAS_EXTRA[S.area]||AREAS.alimentacao;
  fornecedores=gerarFornecedores(area);
  calcScores();
  var mercado=calcMercado(area);
  var sat=calcSaturacao(area);
  salvarPesquisa(area,mercado,sat);
  document.getElementById('st-forn').textContent=fornecedores.length;
  document.getElementById('st-raio').textContent=isDigital?'Nacional':S.raio+'km';
  document.getElementById('st-mercado').textContent='R$'+fmtK(mercado.total);
  document.getElementById('res-title').textContent='Análise — '+area.label;
  document.getElementById('res-sub').textContent=fornecedores.length+' fornecedores mapeados · '+S.cidade+' – '+S.uf+(isDigital?'':' · Raio '+S.raio+'km')+' · Pop. ~'+fmtNum(S.popEstimada)+' hab.';
  document.getElementById('raio-map').value=isDigital?300:S.raio;
  document.getElementById('rv-map').textContent=isDigital?'Nacional':S.raio+'km';
  renderNichos(area);
  renderInteligencia(area,mercado);
  renderFornecedores(area);
  atualizarTabsVisiveis();
  setTab('nichos',document.querySelectorAll('.tab-btn')[0]);
  go('s-result');
}

async function animLoading(){
  // resetar loading antes de cada run
  document.getElementById('prog').style.width='0%';
  for(var ri=0;ri<6;ri++){
    var rs=document.getElementById('ls'+ri);
    var rl=document.getElementById('lt'+ri);
    if(rs){rs.className='loading-step';rs.querySelector('.step-icon').textContent='⏳';}
    if(rl){var labels=['Validando CEP e coordenadas...','Mapeando CNPJs por CNAE','Calculando score de confiabilidade','Analisando saturação do nicho','Estimando mercado endereçável','Montando painel de inteligência'];rl.textContent=labels[ri]||'...';}
  }
  var el0=document.getElementById('ls0');
  if(el0){el0.className='loading-step active';el0.querySelector('.step-icon').innerHTML='<div class="spin"></div>';}
  var steps=[
    {id:'ls0',txt:'✓ CEP localizado: '+S.cidade+' – '+S.uf,prog:16},
    {id:'ls1',txt:'✓ CNAEs mapeados para '+((AREAS[S.area]||AREAS_EXTRA[S.area])||AREAS.alimentacao).label,prog:33},
    {id:'ls2',txt:'✓ Score de confiabilidade calculado',prog:50},
    {id:'ls3',txt:'✓ Saturação do nicho analisada',prog:66},
    {id:'ls4',txt:'✓ Mercado endereçável estimado',prog:83},
    {id:'ls5',txt:'✓ Painel de inteligência montado',prog:100}
  ];
  for(var i=0;i<steps.length;i++){
    await delay(380+Math.random()*240);
    var el=document.getElementById(steps[i].id);
    if(el){el.className='loading-step done';el.querySelector('.step-icon').textContent='✓';document.getElementById('lt'+i).textContent=steps[i].txt;}
    var nx=document.getElementById('ls'+(i+1));
    if(nx){nx.className='loading-step active';nx.querySelector('.step-icon').innerHTML='<div class="spin"></div>';}
    document.getElementById('prog').style.width=steps[i].prog+'%';
  }
  await delay(280);
}
function delay(ms){return new Promise(function(r){setTimeout(r,ms);})}

/* ══ GERAR FORNECEDORES ══ */
function gerarFornecedores(area){
  var nomes=(NOMES[S.area]||NOMES_EXTRA[S.area])||NOMES.alimentacao;
  var result=[];
  for(var i=0;i<Math.min(nomes.length,12);i++){
    var ang=Math.random()*2*Math.PI;
    var dist=5+Math.random()*S.raio*0.82;
    var dlat=dist/111;
    var dlng=dist/(111*Math.cos(S.lat*Math.PI/180));
    var cnae=area.cnaes[Math.floor(Math.random()*area.cnaes.length)];
    var anosOp=1+Math.floor(Math.random()*18);
    result.push({
      nome:nomes[i],cnpj:gerarCNPJ(),
      cnae:cnae.slice(0,4)+'-'+cnae.slice(4,5)+'/'+cnae.slice(5),
      cidade:S.cidade,uf:S.uf,
      dist:Math.round(dist),
      lat:S.lat+dlat*Math.cos(ang),
      lng:S.lng+dlng*Math.sin(ang),
      porte:PORTES[Math.floor(Math.random()*PORTES.length)],
      situacao:'Ativa',
      anosOp:anosOp,
      abertura:gerarData(anosOp),
      score:0
    });
  }
  result.sort(function(a,b){return a.dist-b.dist});
  return result;
}
function gerarCNPJ(){
  var n=[];
  for(var i=0;i<8;i++) n.push(Math.floor(Math.random()*9));
  n.push(0,0,0,1);
  var calc=function(arr,len){
    var soma=0,pos=len-7;
    for(var k=len;k>=1;k--){soma+=arr[len-k]*(pos--);if(pos<2)pos=9;}
    var r=soma%11;return r<2?0:11-r;
  };
  var d1=calc(n,12); n.push(d1);
  var d2=calc(n,13); n.push(d2);
  var s=n.join('');
  return s.slice(0,2)+'.'+s.slice(2,5)+'.'+s.slice(5,8)+'/'+s.slice(8,12)+'-'+s.slice(12,14);
}
function gerarData(anosOp){var y=new Date().getFullYear()-anosOp;var m=String(1+Math.floor(Math.random()*12)).padStart(2,'0');var d=String(1+Math.floor(Math.random()*28)).padStart(2,'0');return d+'/'+m+'/'+y}

/* ══ V2: SCORE CONFIABILIDADE ══ */
function calcScores(){
  fornecedores.forEach(function(f){
    var s=0;
    // Fator 1: Tempo de operação (0-30pts)
    if(f.anosOp>=10) s+=30;
    else if(f.anosOp>=5) s+=22;
    else if(f.anosOp>=2) s+=14;
    else s+=6;
    // Fator 2: Porte (0-25pts)
    var pp={'Ltda':25,'EPP':20,'ME':14,'MEI':8};
    s+=pp[f.porte]||8;
    // Fator 3: Situação cadastral (0-20pts)
    s+=(f.situacao==='Ativa'?20:0);
    // Fator 4: Consistência CNAE (determinístico por nome do fornecedor)
    var cnaeVal=8+(f.nome.split('').reduce(function(a,c){return(a+c.charCodeAt(0))%8},0));
    s+=cnaeVal;
    // Fator 5: Proximidade (0-10pts)
    if(f.dist<20) s+=10;
    else if(f.dist<50) s+=7;
    else s+=4;
    f.score=Math.min(100,s);
    f.scoreFatores={
      tempo:{val:f.anosOp>=10?30:f.anosOp>=5?22:f.anosOp>=2?14:6,max:30,label:f.anosOp+' anos'},
      porte:{val:pp[f.porte]||8,max:25,label:f.porte},
      situacao:{val:f.situacao==='Ativa'?20:0,max:20,label:f.situacao},
      cnae:{val:cnaeVal,max:15,label:'CNAE consistente'},
      prox:{val:f.dist<20?10:f.dist<50?7:4,max:10,label:'~'+f.dist+'km'}
    };
  });
}

/* ══ V2: MERCADO ENDEREÇÁVEL ══ */
function calcMercado(area){
  var pop=S.popEstimada||200000;
  var potConsumidores=Math.round(pop*area.penetracao);
  var totalMes=Math.round(potConsumidores*area.ticketMedio);
  var raioFactor=Math.min(1,S.raio/100);
  var mercadoRaio=Math.round(totalMes*raioFactor);
  var mktShare=Math.round(mercadoRaio*0.04);
  return{
    pop:pop,potConsumidores:potConsumidores,ticketMedio:area.ticketMedio,
    total:mercadoRaio,mktShare:mktShare,penetracao:area.penetracao
  };
}

/* ══ V2: SATURAÇÃO ══ */
function calcSaturacao(area){
  var base=area.concorrentes;
  var factor=S.raio/50;
  var seed=(S.cidade||'').split('').reduce(function(a,c){return a+c.charCodeAt(0)},0);
  var mult=0.7+((seed%60)/100);
  var total=Math.round(base*factor*mult);
  var indice=Math.min(100,Math.round((total/500)*100));
  return{total:total,indice:indice,nivel:indice>70?'Alto':indice>40?'Médio':'Baixo'};
}

/* ══ RENDER NICHOS ══ */
function renderNichos(area){
  var el=document.getElementById('tab-nichos');
  var html='<div class="ibox warn" style="margin-bottom:1rem">ℹ️ Dados de fornecedores são representativos por município/CNAE. Consulta CNPJ individual disponível em tempo real na aba <strong>Consulta CNPJ</strong>.</div>';
  area.nichos.forEach(function(n,i){
    html+='<div class="ncard'+(i===0?' best':'')+'" tabindex="0" role="button" onclick="setTab(\'fornecedores\',document.querySelectorAll(\'.tab-btn\')[2])" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();setTab(\'fornecedores\',document.querySelectorAll(\'.tab-btn\')[2])}" aria-label="Nicho: '+n.nome+', score '+n.score+'%">';
    html+='<div class="ntop"><div class="nname">'+(i===0?'⭐ ':'')+n.nome+'</div><div class="nscore">'+n.score+'%</div></div>';
    html+='<div class="ndesc">'+n.desc+'</div>';
    html+='<div style="font-size:11px;color:var(--text3);margin-bottom:8px">CNAE: '+n.cnae+' &nbsp;·&nbsp; Retorno estimado: '+n.retorno+'</div>';
    html+='<div class="ntags">';
    if(i===0) html+='<span class="bdg bt">Melhor match</span>';
    n.tags.forEach(function(t){html+='<span class="bdg bb">'+t+'</span>'});
    html+='<span class="bdg ba">'+fornecedores.length+' fornecedores</span>';
    html+='</div></div>';
  });
  el.innerHTML=html;
}

/* ══ V2: RENDER INTELIGÊNCIA ══ */
function renderInteligencia(area,mercado){
  var sat=calcSaturacao(area);
  var avgScore=Math.round(fornecedores.reduce(function(a,f){return a+f.score},0)/fornecedores.length);

  /* PAINEL NACIONAL */
  var nb=INTEL_BRASIL[S.area]||INTEL_BRASIL.alimentacao;
  var nhtml='';
  nhtml+='<div class="market-box" style="margin-bottom:10px">';
  nhtml+='<div class="market-row"><span class="market-k">Mercado total Brasil</span><span class="market-v accent">'+nb.mercadoTotal+'</span></div>';
  nhtml+='<div class="market-row"><span class="market-k">Crescimento anual</span><span class="market-v" style="color:var(--green)">'+nb.crescimento+'</span></div>';
  nhtml+='<div class="market-row"><span class="market-k">Ticket médio</span><span class="market-v">'+nb.ticketMedio+'</span></div>';
  nhtml+='<div class="market-row"><span class="market-k">Concorrência</span><span class="market-v warn">'+nb.concorrencia+'</span></div>';
  nhtml+='<div class="market-row"><span class="market-k">Penetração</span><span class="market-v">'+nb.penetracao+'</span></div>';
  nhtml+='</div>';
  nhtml+='<div class="v2-section-title">Estratégia de entrada</div>';
  nhtml+='<div class="market-box" style="margin-bottom:10px"><div style="font-size:13px;color:var(--text2);line-height:1.65">'+nb.estrategia+'</div></div>';
  nhtml+='<div class="v2-section-title">CNAEs principais</div>';
  nhtml+='<div class="market-box" style="margin-bottom:10px">';
  nb.cnaes.forEach(function(cn){
    nhtml+='<div class="market-row"><span class="market-k" style="font-family:monospace;color:var(--accent)">'+cn.cod+'</span><span class="market-v" style="font-size:11px;text-align:right;max-width:60%">'+cn.desc+'</span></div>';
  });
  nhtml+='</div>';
  nhtml+='<div class="v2-section-title">Fornecedores de referência nacional</div>';
  nhtml+='<div class="market-box" style="margin-bottom:10px">';
  nb.forn_destaque.forEach(function(f){nhtml+='<div class="market-row"><span class="market-k">🏭 '+f+'</span><a href="https://www.google.com/search?q='+encodeURIComponent(f+' atacado fornecedor')+'" target="_blank" style="font-size:11px;color:var(--blue)">buscar →</a></div>';});
  nhtml+='</div>';
  nhtml+='<div style="text-align:center;margin:1rem 0 .5rem">';
  nhtml+='<button class="btn-ia" style="max-width:360px" onclick="irParaAbaIA()">Análise aprofundada por UF com IA ✦</button>';
  nhtml+='</div>';
  document.getElementById('intel-nacional').innerHTML=nhtml;

  /* label local */
  var locLabel=S.cidade?S.cidade+' – '+S.uf:'sua região';
  document.getElementById('intel-local-sub').textContent='Dados calculados para '+locLabel+(S.raio<900?' no raio de '+S.raio+'km':'');

  // Gauges SVG
  var gaugesHtml='';
  var gauges=[
    {title:'Confiabilidade média',val:avgScore,max:100,color:scoreColor(avgScore),label:avgScore>=70?'Boa':'Moderada'},
    {title:'Saturação do nicho',val:sat.indice,max:100,color:sat.indice>70?'#ff4757':sat.indice>40?'#f5a623':'#2ed573',label:sat.nivel},
    {title:'Potencial de entrada',val:Math.round(100-sat.indice*0.6+avgScore*0.4),max:100,color:var_accent_hex(),label:'Score geral'}
  ];
  gauges.forEach(function(g){
    var pct=g.val/g.max;
    var r=34;var circ=2*Math.PI*r;var dash=pct*circ;
    gaugesHtml+='<div class="intel-card">';
    gaugesHtml+='<div class="intel-title">'+g.title+'</div>';
    gaugesHtml+='<div class="gauge-wrap">';
    gaugesHtml+='<svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-label="'+g.title+': '+g.val+' de '+g.max+'">';
    gaugesHtml+='<circle cx="40" cy="40" r="'+r+'" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="7"/>';
    gaugesHtml+='<circle cx="40" cy="40" r="'+r+'" fill="none" stroke="'+g.color+'" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+dash.toFixed(1)+' '+circ.toFixed(1)+'" transform="rotate(-90 40 40)"/>';
    gaugesHtml+='</svg>';
    gaugesHtml+='<div class="gauge-val" style="color:'+g.color+'">'+g.val+'</div>';
    gaugesHtml+='</div>';
    gaugesHtml+='<div class="intel-label"><strong>'+g.label+'</strong></div>';
    gaugesHtml+='</div>';
  });
  document.getElementById('intel-gauges').innerHTML=gaugesHtml;

  // Mercado endereçável
  var mHtml='';
  var mRows=[
    ['População no raio',fmtNum(mercado.pop)+' hab.',null],
    ['Consumidores potenciais',fmtNum(mercado.potConsumidores)+' pessoas','accent'],
    ['Ticket médio estimado','R$ '+mercado.ticketMedio,null],
    ['Penetração do segmento',Math.round(mercado.penetracao*100)+'% da população',null],
    ['Mercado total / mês','R$ '+fmtNum(mercado.total),'accent'],
    ['Sua fatia estimada (4%)','R$ '+fmtNum(mercado.mktShare)+'/mês','accent']
  ];
  mRows.forEach(function(r){
    mHtml+='<div class="market-row"><span class="market-k">'+r[0]+'</span><span class="market-v'+(r[2]?' '+r[2]:'')+'">'+r[1]+'</span></div>';
  });
  document.getElementById('market-box').innerHTML=mHtml;

  // Saturação por nicho
  var satHtml='';
  area.nichos.forEach(function(n,i){
    var sv=sat.indice*(0.8+i*0.15);sv=Math.min(100,Math.round(sv));
    var col=sv>70?'#ff4757':sv>40?'#f5a623':'#2ed573';
    satHtml+='<div style="margin-bottom:12px">';
    satHtml+='<div class="sat-bar-label"><span>'+n.nome+'</span><span style="color:'+col+'">'+sv+'% saturado</span></div>';
    satHtml+='<div class="sat-bar"><div class="sat-fill" style="width:'+sv+'%;background:'+col+'"></div></div>';
    satHtml+='</div>';
  });
  document.getElementById('sat-bars').innerHTML=satHtml;

  // Riscos regulatórios
  var riskHtml='';
  area.riscos.forEach(function(r){
    riskHtml+='<div class="risk-item">';
    riskHtml+='<div class="risk-icon">'+r.icon+'</div>';
    riskHtml+='<div><div class="risk-name">'+r.nome+'</div><div class="risk-desc">'+r.desc+'</div><div class="risk-level '+r.nivel+'">● '+r.label+'</div></div>';
    riskHtml+='</div>';
  });
  document.getElementById('risk-grid').innerHTML=riskHtml;

  // Score criteria com pesos
  var criteriaHtml='';
  var crit=[
    {k:'Tempo de operação',v:'até 30 pts',desc:'≥10 anos = 30 · 5-9 anos = 22 · 2-4 anos = 14 · <2 anos = 6'},
    {k:'Porte (MEI/ME/EPP/Ltda)',v:'até 25 pts',desc:'Ltda=25 · EPP=20 · ME=14 · MEI=8'},
    {k:'Situação cadastral RFB',v:'até 20 pts',desc:'Ativa = 20 · Outras = 0'},
    {k:'Consistência CNAE × atividade',v:'até 15 pts',desc:'CNAE principal bate com atividade declarada'},
    {k:'Proximidade no raio',v:'até 10 pts',desc:'<20km=10 · <50km=7 · ≥50km=4'}
  ];
  crit.forEach(function(c){
    criteriaHtml+='<div class="market-row"><span class="market-k">'+c.k+'<br><span style="font-size:10px;color:var(--text3)">'+c.desc+'</span></span><span class="market-v accent">'+c.v+'</span></div>';
  });
  document.getElementById('score-criteria').innerHTML=criteriaHtml;
}

/* ══ RENDER FORNECEDORES ══ */
function renderFornecedores(area){
  var el=document.getElementById('tab-fornecedores');
  var qCnae=area.cnaes.slice(0,3).map(function(c){return c.slice(0,4)+'-'+c.slice(4,5)}).join(', ');
  var html='<div class="ibox warn" style="margin-bottom:10px">⚠️ Fornecedores representativos gerados por município e CNAE. Os nomes são fictícios — use os links abaixo para encontrar empresas reais.</div>';
  html+='<div style="font-size:11px;color:var(--text3);margin-bottom:10px">CNAE: '+qCnae+' · '+S.cidade+' – '+S.uf+' · Ordenado por proximidade estimada</div>';
  fornecedores.forEach(function(f,i){
    var sp=scorePillClass(f.score);
    var busca=encodeURIComponent(f.nome+' '+S.cidade+' '+S.uf);
    var maps=encodeURIComponent(area.label+' atacado '+S.cidade+' '+S.uf);
    var rfbUrl='https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/consultas';
    html+='<div class="scard" id="sc'+i+'">';
    html+='<div class="stop"><span class="sname">'+f.nome+'</span><span class="bdg '+porteBadge(f.porte)+'">'+f.porte+'</span></div>';
    html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">';
    html+='<div class="sloc">📍 '+f.cidade+' – '+f.uf+' &nbsp;<span style="color:var(--accent);font-weight:500;font-size:11px">~'+f.dist+'km</span></div>';
    html+='<span class="score-pill '+sp+'">🛡 '+f.score+' pts</span>';
    html+='</div>';
    html+='<div class="smeta">CNAE: '+f.cnae+' · Porte estimado: '+f.porte+' · ~'+f.anosOp+' anos no mercado</div>';
    html+='<div class="forn-links">';
    html+='<a class="flink flink-maps" href="https://www.google.com/maps/search/'+maps+'" target="_blank" rel="noopener">📍 Ver no Maps</a>';
    html+='<a class="flink flink-search" href="https://www.google.com/search?q='+busca+'" target="_blank" rel="noopener">🔍 Buscar empresa</a>';
    html+='<a class="flink flink-rfb" href="'+rfbUrl+'" target="_blank" rel="noopener">🏛 Receita Federal</a>';
    html+='</div>';
    html+='<div class="forn-disclaimer">Links abrem busca real por '+area.label+' em '+S.cidade+'. Para consultar CNPJ específico use a aba Consulta CNPJ.</div>';
    html+='<div style="margin-top:7px">';
    html+='<button onclick="toggleScore('+i+')" style="font-size:11px;padding:6px 10px;background:transparent;border:1px solid var(--border2);border-radius:6px;color:var(--text3);cursor:pointer;touch-action:manipulation">Ver score detalhado</button>';
    html+='</div>';
    html+='<div class="dcard" id="score'+i+'" style="margin-top:6px"></div>';
    html+='</div>';
  });
  el.innerHTML=html;
}

function toggleScore(i){
  var el=document.getElementById('score'+i);
  if(el.style.display==='block'){el.style.display='none';return}
  var f=fornecedores[i];
  var sf=f.scoreFatores;
  var html='<div style="font-size:11px;color:var(--text3);margin-bottom:8px;font-family:\'Syne\',sans-serif;font-weight:600;letter-spacing:.4px">SCORE DE CONFIABILIDADE — '+f.score+'/100</div>';
  var fatores=[
    {k:'Tempo de operação',fator:sf.tempo},
    {k:'Porte empresarial',fator:sf.porte},
    {k:'Situação cadastral',fator:sf.situacao},
    {k:'Consistência CNAE',fator:sf.cnae},
    {k:'Proximidade',fator:sf.prox}
  ];
  fatores.forEach(function(item){
    var pct=Math.round((item.fator.val/item.fator.max)*100);
    var col=pct>=70?'#2ed573':pct>=40?'#f5a623':'#ff4757';
    html+='<div class="sbrow">';
    html+='<div class="sbname">'+item.k+'<br><span style="font-size:10px;color:var(--text3)">'+item.fator.label+'</span></div>';
    html+='<div class="sbbar"><div class="sbfill" style="width:'+pct+'%;background:'+col+'"></div></div>';
    html+='<div class="sbval" style="color:'+col+';min-width:50px;text-align:right">'+item.fator.val+'/'+item.fator.max+'</div>';
    html+='</div>';
  });
  el.innerHTML=html;
  el.style.display='block';
}

async function toggleDetail(i,cnpj){
  var el=document.getElementById('detail'+i);
  if(el.style.display==='block'){el.style.display='none';return}
  el.style.display='block';
  el.innerHTML='<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text3)"><div class="spin"></div> Consultando BrasilAPI...</div>';
  var raw=cnpj.replace(/\D/g,'');
  try{
    var r=await fetch('/api/cnpj?cnpj='+raw);
    var d=await r.json();
    if(d.error) throw new Error(d.error);
    if(d.message) throw new Error(d.message);
    el.innerHTML=buildDetail(d);
  }catch(e){
    el.innerHTML='<div style="font-size:12px;color:var(--amber)">⚠️ CNPJ simulado — consulta real disponível em produção. Erro: '+e.message+'</div>';
  }
}
function buildDetail(d){
  var rows=[['Razão social',d.razao_social||'—'],['Situação',d.descricao_situacao_cadastral||'—'],['Porte',d.porte||'—'],['Natureza jurídica',d.descricao_natureza_juridica||'—'],['Município',(d.municipio||'')+' – '+(d.uf||'')],['Abertura',d.data_inicio_atividade||'—'],['CNAE principal',(d.cnae_fiscal||'')+' – '+(d.cnae_fiscal_descricao||'')]];
  var html='';
  rows.forEach(function(r){html+='<div class="drow"><span class="dlabel">'+r[0]+'</span><span class="dval" style="font-family:\'Inter\',sans-serif">'+r[1]+'</span></div>'});
  return html;
}

/* ══ CONSULTA CNPJ ══ */
function fmtCnpj(inp){
  var v=inp.value.replace(/\D/g,'');
  if(v.length>12) v=v.slice(0,2)+'.'+v.slice(2,5)+'.'+v.slice(5,8)+'/'+v.slice(8,12)+'-'+v.slice(12,14);
  else if(v.length>8) v=v.slice(0,2)+'.'+v.slice(2,5)+'.'+v.slice(5,8)+'/'+v.slice(8);
  else if(v.length>5) v=v.slice(0,2)+'.'+v.slice(2,5)+'.'+v.slice(5);
  else if(v.length>2) v=v.slice(0,2)+'.'+v.slice(2);
  inp.value=v;
}
async function buscarCnpj(){
  var raw=document.getElementById('cnpj-input').value.replace(/\D/g,'');
  if(raw.length<14) return;
  var elL=document.getElementById('cnpj-loading');
  var elE=document.getElementById('cnpj-error');
  var elR=document.getElementById('cnpj-result');
  elL.style.display='flex';elE.style.display='none';elR.innerHTML='';
  try{
    var r=await fetch('/api/cnpj?cnpj='+raw);
    var d=await r.json();
    if(d.error) throw new Error(d.error);
    if(d.message) throw new Error(d.message);
    elL.style.display='none';
    var rawFmt=raw.slice(0,2)+'.'+raw.slice(2,5)+'.'+raw.slice(5,8)+'/'+raw.slice(8,12)+'-'+raw.slice(12);
    var html='<div class="scard" style="border-color:rgba(0,212,170,.3)">';
    html+='<div class="stop"><span class="sname">'+d.razao_social+'</span><span class="bdg bt">'+(d.porte||'—')+'</span></div>';
    html+='<div class="sloc">📍 '+d.municipio+' – '+d.uf+'</div>';
    html+='<div class="smeta">'+rawFmt+' · <span class="sativa">'+d.descricao_situacao_cadastral+'</span></div>';
    html+='<div class="dcard" style="display:block;margin-top:8px">'+buildDetail(d)+'</div></div>';
    elR.innerHTML=html;
  }catch(e){
    elL.style.display='none';elE.style.display='flex';elE.textContent='⚠️ '+e.message;
  }
}

/* ══ TABS ══ */
function setTab(name,btn){
  document.querySelectorAll('.tab-btn').forEach(function(b){
    b.classList.remove('active');
    b.setAttribute('aria-selected','false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected','true');
  ['nichos','inteligencia','fornecedores','digital','polos','cnpj','mapa','ia'].forEach(function(t){
    document.getElementById('tab-'+t).style.display=(t===name)?'block':'none';
  });
  if(name==='mapa') setTimeout(initMap,120);
  if(name==='digital') renderDigital(AREAS[S.area]||AREAS_EXTRA[S.area]||AREAS.alimentacao);
  if(name==='ia') initIA();
  if(name==='polos') renderPolos(AREAS[S.area]||AREAS_EXTRA[S.area]||AREAS.alimentacao);
}

/* ══ MAPA ══ */
function initMap(){
  if(mapObj){
    mapObj.remove();
    mapObj=null;circleObj=null;pinLayer=null;heatLayer=null;
  }
  var c=[S.lat,S.lng];
  var zoom=S.raio<=30?12:S.raio<=80?11:S.raio<=150?10:9;
  mapObj=L.map('lmap',{scrollWheelZoom:false,zoomControl:true}).setView(c,zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OSM'}).addTo(mapObj);
  circleObj=L.circle(c,{radius:S.raio*1000,color:'#0099ff',fillColor:'#0099ff',fillOpacity:0.05,weight:1.5}).addTo(mapObj);
  L.circleMarker(c,{radius:12,color:'#185FA5',fillColor:'#0099ff',fillOpacity:1,weight:2.5}).addTo(mapObj)
    .bindPopup('<b>Sua localização</b><br>'+S.cidade+' – '+S.uf+'<br>Pop. ~'+fmtNum(S.popEstimada));
  pinLayer=L.layerGroup().addTo(mapObj);
  heatLayer=L.layerGroup();
  renderPins();
  renderHeat();
}

function renderPins(){
  pinLayer.clearLayers();
  fornecedores.forEach(function(f){
    var col=scoreColor(f.score);
    L.circleMarker([f.lat,f.lng],{radius:8,color:col,fillColor:col,fillOpacity:.88,weight:1.5})
      .addTo(pinLayer)
      .bindPopup('<b>'+f.nome+'</b><br>'+f.porte+' · CNAE '+f.cnae+'<br>Score: <b>'+f.score+'</b>/100<br>~'+f.dist+'km');
  });
}

function renderHeat(){
  heatLayer.clearLayers();
  fornecedores.forEach(function(f){
    var r=Math.round(8000+Math.random()*12000);
    L.circle([f.lat,f.lng],{radius:r,color:'transparent',fillColor:'#ff6400',fillOpacity:0.12+Math.random()*0.12,weight:0}).addTo(heatLayer);
  });
}

function toggleLayer(mode,btn){
  document.querySelectorAll('.toggle-btn').forEach(function(b){b.classList.remove('on')});
  btn.classList.add('on');
  layerMode=mode;
  if(!mapObj) return;
  if(mode==='pins'){mapObj.addLayer(pinLayer);mapObj.removeLayer(heatLayer);}
  else{mapObj.removeLayer(pinLayer);mapObj.addLayer(heatLayer);}
}

function upRadius(v){
  document.getElementById('rv-map').textContent=v+'km';
  S.raio=parseInt(v);
  if(circleObj){
    circleObj.setRadius(S.raio*1000);
    circleObj.setLatLng([S.lat,S.lng]);
  }
  if(mapObj){
    var zoom=S.raio<=30?12:S.raio<=80?11:S.raio<=150?10:9;
    mapObj.setView([S.lat,S.lng],zoom);
  }
}

/* ══ HELPERS ══ */
function scoreColor(s){return s>=70?'#2ed573':s>=50?'#f5a623':'#ff4757'}
function scorePillClass(s){return s>=70?'sp-high':s>=50?'sp-med':'sp-low'}
function porteBadge(p){if(p==='MEI') return 'bt';if(p==='ME') return 'bb';if(p==='EPP') return 'bp';return 'ba'}
function var_accent_hex(){return '#00d4aa'}
function fmtNum(n){return Math.round(n).toLocaleString('pt-BR')}
function fmtK(n){if(n>=1000000) return (n/1000000).toFixed(1)+'M';if(n>=1000) return (n/1000).toFixed(0)+'k';return String(Math.round(n))}

function abrirAnalise(){
  irParaAbaIA();
}

/* ══ V5: ANÁLISE IA ══ */
var iaGerada = '';
var iaArea   = '';
var iaLoc    = '';

function irParaAbaIA(){
  var btn=document.querySelector('.tab-btn[onclick*="setTab(\'ia\'"]');
  if(!btn) btn=Array.from(document.querySelectorAll('.tab-btn')).find(function(b){return b.textContent.includes('Análise IA')});
  if(btn) setTab('ia',btn);
}
function renderMD(txt){
  var h="font-family:Syne,sans-serif";
  return txt
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/^## (.+)$/gm,function(_,t){return "<h3 style='font-size:14px;font-weight:600;color:var(--text);"+h+";margin:1.1rem 0 .4rem'>"+t+"</h3>";})
    .replace(/^### (.+)$/gm,function(_,t){return "<strong style='font-size:13px;color:var(--text);display:block;margin:.7rem 0 .2rem'>"+t+"</strong>";})
    .replace(/\*\*(.+?)\*\*/g,function(_,t){return "<strong style='color:var(--text)'>"+t+"</strong>";})
    .replace(/^- (.+)$/gm,function(_,t){return "<div style='display:flex;gap:6px;margin:.2rem 0'><span style='color:var(--accent)'>\u25b8</span><span>"+t+"</span></div>";})
    .replace(/^(\d+)\. (.+)$/gm,function(_,n,t){return "<div style='display:flex;gap:8px;margin:.25rem 0'><span style='color:var(--accent);"+h+";font-weight:600;min-width:18px'>"+n+".</span><span>"+t+"</span></div>";})
    .replace(/\n\n/g,"<br><br>").replace(/\n/g,"<br>");
}

function copiarAnaliseIA(){
  if(!iaGerada) return;
  navigator.clipboard.writeText(iaGerada).then(function(){
    var btn=event.target;
    btn.textContent='✓ Copiado!';
    setTimeout(function(){btn.textContent='📋 Copiar texto'},2000);
  }).catch(function(){
    var ta=document.createElement('textarea');
    ta.value=iaGerada;
    document.body.appendChild(ta);ta.select();
    document.execCommand('copy');document.body.removeChild(ta);
  });
}

function initIA(){
  var area = AREAS[S.area]||AREAS_EXTRA[S.area]||AREAS.alimentacao;
  var loc  = S.cidade ? S.cidade+' – '+S.uf : 'Brasil';
  document.getElementById('ia-area-info').textContent =
    '🎯 Área: '+area.label+' · Localização: '+loc+(S.raio<900?' · Raio '+S.raio+'km':' · Nacional');
  // Pré-selecionar UF do usuário
  var ufSel=document.getElementById('ia-uf');
  if(ufSel&&S.uf) ufSel.value=S.uf;
  // Esconder campo UF se escopo nacional
  var escopoEl=document.getElementById('ia-escopo');
  if(escopoEl) escopoEl.onchange=function(){
    var ufWrap=document.getElementById('ia-uf-wrap');
    if(ufWrap) ufWrap.style.opacity=this.value==='uf'?'1':'.4';
  };
  if(!iaGerada || iaArea!==S.area || iaLoc!==loc){
    iaGerada=''; iaArea=S.area; iaLoc=loc;
    document.getElementById('ia-result').style.display='none';
    document.getElementById('ia-saved').style.display='none';
  }
}

var IA_RATE_KEY='fb_ia_rate';
var IA_RATE_MAX=5;
var IA_RATE_WIN=3600000;
function checkIARateLimit(){
  try{
    var raw=localStorage.getItem(IA_RATE_KEY);
    var d=raw?JSON.parse(raw):{count:0,reset:Date.now()+IA_RATE_WIN};
    if(Date.now()>d.reset){d={count:0,reset:Date.now()+IA_RATE_WIN};}
    if(d.count>=IA_RATE_MAX) return false;
    d.count++;
    localStorage.setItem(IA_RATE_KEY,JSON.stringify(d));
    return true;
  }catch(e){return true;}
}
async function gerarAnaliseIA(){
  if(!checkIARateLimit()){
    document.getElementById('ia-result').style.display='block';
    document.getElementById('ia-dot').style.animation='none';
    document.getElementById('ia-dot').style.background='var(--amber)';
    document.getElementById('ia-title').textContent='Limite de análises atingido';
    document.getElementById('ia-content').textContent='Você atingiu o limite de '+IA_RATE_MAX+' análises por hora. Tente novamente mais tarde.';
    document.getElementById('btn-salvar-ia').disabled=true;
    return;
  }
  var area   = AREAS[S.area]||AREAS_EXTRA[S.area]||AREAS.alimentacao;
  var escopo = (document.getElementById('ia-escopo')||{}).value||'nacional';
  var ufSel  = (document.getElementById('ia-uf')||{}).value||S.uf||'';
  var prof   = (document.getElementById('ia-prof')||{}).value||'completa';
  var capital= {ate5k:'até R$ 5 mil','5k20k':'R$ 5–20 mil','20k100k':'R$ 20–100 mil','acima100k':'acima de R$ 100 mil'}[S.capital]||'não informado';
  var modo   = S.modo||S_MODO||'local';
  var sat    = calcSaturacao(area);
  var merc   = calcMercado(area);
  var nb     = INTEL_BRASIL[S.area]||INTEL_BRASIL.alimentacao;

  var locLabel = escopo==='uf'
    ? (ufSel ? area.label+' no estado de '+ufSel : area.label+' no estado de '+S.uf)
    : area.label+' no Brasil (panorama nacional)';

  var secoes = {
    completa: '1. Visão geral do mercado (3 parágrafos)\n2. Estimativa de mercado, tamanho e ticket médio\n3. Análise da concorrência e saturação\n4. Estratégia de entrada recomendada (passo a passo)\n5. CNAEs principais, enquadramento fiscal e MEI vs ME\n6. Fornecedores recomendados — locais, nacionais e digitais\n7. Riscos regulatórios e como mitigá-los\n8. Plano de ação — 30, 60 e 90 dias',
    resumida: '1. Panorama do mercado\n2. Oportunidade e ticket médio\n3. Estratégia de entrada\n4. Próximos passos',
    entrada:  '1. Por que este nicho agora\n2. Modelo de negócio recomendado\n3. Passo a passo para lançar em 90 dias\n4. Erros comuns a evitar\n5. Métricas de sucesso para os primeiros 6 meses',
    fornecedores: '1. Principais fornecedores locais por CNAE e região\n2. Fornecedores nacionais e atacadistas online\n3. Polos comerciais relevantes\n4. Como negociar condições (prazo, pedido mínimo, exclusividade)\n5. Red flags: fornecedores a evitar'
  };

  var dadosCtx = escopo==='uf'
    ? 'Estado analisado: '+ufSel+'\nMercado endereçável estimado: R$ '+Math.round(merc.total).toLocaleString('pt-BR')+'/mês\nSaturação no segmento: '+sat.indice+'%\nCapital disponível: '+capital+'\nModo de atuação: '+modo
    : 'Mercado total Brasil: '+nb.mercadoTotal+'\nCrescimento: '+nb.crescimento+'\nTicket médio referência: '+nb.ticketMedio+'\nNível de concorrência: '+nb.concorrencia;

  var prompt = 'Você é um especialista sênior em inteligência comercial para pequenos empreendedores brasileiros.\n\n'
    +'CONTEXTO:\n'+dadosCtx+'\n\n'
    +'Gere uma análise de mercado para: '+locLabel+'\n\n'
    +'Estruture com as seguintes seções:\n'+secoes[prof]+'\n\n'
    +'Use linguagem direta e prática. Inclua números e referências reais do mercado brasileiro. '
    +'Formate com ## para seções e - para listas. Não use introduções genéricas.';

  document.getElementById('ia-result').style.display='block';
  document.getElementById('ia-dot').style.animation='pulse 1.4s ease infinite';
  document.getElementById('ia-title').textContent='Gerando análise...';
  document.getElementById('ia-content').textContent='';
  document.getElementById('btn-salvar-ia').disabled=true;
  document.getElementById('ia-saved').style.display='none';
  iaGerada='';

  try{
    var resp = await fetch('/api/ai',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1500,
        stream:true,
        messages:[{role:'user',content:prompt}]
      })
    });

    if(!resp.ok) throw new Error('API erro '+resp.status);
    var reader = resp.body.getReader();
    var decoder = new TextDecoder();
    var content = document.getElementById('ia-content');
    var buffer = '';

    while(true){
      var _ref = await reader.read();
      var done=_ref.done, value=_ref.value;
      if(done) break;
      buffer += decoder.decode(value,{stream:true});
      var lines = buffer.split('\n');
      buffer = lines.pop();
      for(var li=0;li<lines.length;li++){
        var line=lines[li].trim();
        if(!line.startsWith('data:')) continue;
        var data=line.slice(5).trim();
        if(data==='[DONE]') continue;
        try{
          var evt=JSON.parse(data);
          if(evt.type==='content_block_delta'&&evt.delta&&evt.delta.text){
            iaGerada+=evt.delta.text;
            content.innerHTML=renderMD(iaGerada);
          }
        }catch(e){}
      }
    }
    document.getElementById('ia-dot').style.animation='none';
    document.getElementById('ia-dot').style.background='var(--green)';
    document.getElementById('ia-title').textContent='Análise gerada · '+locLabel;
    document.getElementById('btn-salvar-ia').disabled=false;
  }catch(err){
    document.getElementById('ia-dot').style.background='var(--red)';
    document.getElementById('ia-dot').style.animation='none';
    document.getElementById('ia-title').textContent='Erro ao gerar análise';
    document.getElementById('ia-content').textContent='Erro: '+err.message+'. Verifique a conexão e tente novamente.';
  }
}

function salvarAnaliseIA(){
  if(!iaGerada||!USER.nome) return;
  var area = AREAS[S.area]||AREAS_EXTRA[S.area]||AREAS.alimentacao;
  var loc  = S.cidade?S.cidade+' – '+S.uf:'Brasil';
  var entrada = {
    id:Date.now(),ts:new Date().toISOString(),
    tipo:'analise_ia',
    area:S.area,areaLabel:area.label,
    cidade:S.cidade,uf:S.uf,
    conteudo:iaGerada.slice(0,2000)
  };
  if(!USER.analises) USER.analises=[];
  USER.analises.unshift(entrada);
  if(USER.analises.length>10) USER.analises=USER.analises.slice(0,10);
  salvarStorage();
  document.getElementById('ia-saved').style.display='block';
  document.getElementById('btn-salvar-ia').disabled=true;
}

/* ══ V6: BASE DE PRODUTOS ══ */


/* ══ V6: FUNÇÕES ══ */
var v6CatAtiva = '';
var v6Iniciado = false;

function initV6(){
  if(v6Iniciado) return;
  v6Iniciado = true;

  // Populares
  var tagsEl = document.getElementById('v6-tags-pop');
  if(tagsEl){
    tagsEl.innerHTML = V6_POPULARES.map(function(p){
      return '<span class="v6-tag" onclick="v6BuscarTag(\''+p+'\')">'+p+'</span>';
    }).join('');
  }

  // Categorias
  var catEl = document.getElementById('v6-cat-grid');
  if(catEl){
    catEl.innerHTML = V6_CATS.map(function(cat){
      return '<button class="v6-cat-btn" id="v6cat-'+cat.id+'" onclick="v6FiltrarCat(\''+cat.id+'\')">'+
        '<span class="v6-cat-icon">'+cat.icon+'</span>'+
        '<span class="v6-cat-label">'+cat.label+'</span>'+
        '<span class="v6-cat-count">'+V6_PRODUTOS.filter(function(p){return p.cat===cat.id}).length+' produtos</span>'+
        '</button>';
    }).join('');
  }
}

function v6Buscar(val, force){
  var q = (val||'').trim().toLowerCase();
  if(q.length < 2 && !force){ v6EsconderResultados(); return; }
  var resultados = V6_PRODUTOS.filter(function(p){
    return p.nome.toLowerCase().includes(q) ||
           p.desc.toLowerCase().includes(q) ||
           (p.tags||[]).some(function(t){return t.toLowerCase().includes(q)});
  });
  v6MostrarResultados(resultados, q ? '"'+val+'"' : 'todos os produtos');
}

function v6BuscarTag(tag){
  document.getElementById('v6-search').value = tag;
  v6Buscar(tag, true);
}

function v6FiltrarCat(catId){
  // Toggle categoria
  if(v6CatAtiva === catId){
    v6CatAtiva = '';
    document.querySelectorAll('.v6-cat-btn').forEach(function(b){b.classList.remove('active')});
    v6EsconderResultados();
    return;
  }
  v6CatAtiva = catId;
  document.querySelectorAll('.v6-cat-btn').forEach(function(b){b.classList.remove('active')});
  var btn = document.getElementById('v6cat-'+catId);
  if(btn) btn.classList.add('active');
  document.getElementById('v6-search').value = '';
  var cat = V6_CATS.find(function(c){return c.id===catId});
  var resultados = V6_PRODUTOS.filter(function(p){return p.cat===catId});
  v6MostrarResultados(resultados, cat ? cat.icon+' '+cat.label : catId);
}

function v6EsconderResultados(){
  document.getElementById('v6-results').style.display = 'none';
  document.getElementById('v6-empty').style.display = 'none';
}

function v6MostrarResultados(resultados, label){
  var resEl = document.getElementById('v6-results');
  var empEl = document.getElementById('v6-empty');
  var listEl = document.getElementById('v6-results-list');
  var titleEl = document.getElementById('v6-results-title');

  if(!resultados.length){
    resEl.style.display = 'none';
    empEl.style.display = 'block';
    return;
  }
  empEl.style.display = 'none';
  resEl.style.display = 'block';
  titleEl.textContent = resultados.length + ' produto'+(resultados.length!==1?'s':'')+' encontrado'+(resultados.length!==1?'s':'')+' — '+label;

  // Ordenar: destaque primeiro (margem alta)
  resultados.sort(function(a,b){
    var ma = parseInt((a.margem||'0').replace(/[^0-9]/g,''));
    var mb = parseInt((b.margem||'0').replace(/[^0-9]/g,''));
    return mb - ma;
  });

  listEl.innerHTML = resultados.map(function(p, i){
    var isDestaque = i < 2;
    var barreiraCor = p.barreira > 60 ? '#ff4757' : p.barreira > 30 ? '#f5a623' : '#2ed573';
    var barreiraLabel = p.barreira > 60 ? 'Alta' : p.barreira > 30 ? 'Média' : 'Baixa';
    var tipoIcon = {polo:'🏭', nacional:'🇧🇷', digital:'🌐', local:'📍', regional:'🗺️'};

    return '<div class="v6-result-card'+(isDestaque?' destaque':'')+'" onclick="v6Toggle('+i+')">' +
      '<div class="v6-card-top">' +
        '<div>' +
          '<div class="v6-produto-nome">'+(isDestaque?'⭐ ':'')+p.nome+'</div>' +
          '<div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">' +
            '<span class="v6-ncm-badge">NCM '+p.ncm+'</span>' +
            '<span class="v6-ncm-badge">CNAE '+p.cnae+'</span>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<div class="v6-margem">'+p.margem+'</div>' +
          '<div style="font-size:10px;color:var(--text3)">margem estimada</div>' +
        '</div>' +
      '</div>' +
      '<div class="v6-produto-desc">'+p.desc+'</div>' +
      '<div class="v6-produto-tags">' +
        (p.tags||[]).map(function(t){return '<span class="bdg bb">'+t+'</span>';}).join('') +
        '<span class="bdg" style="background:rgba(255,255,255,.05);color:var(--text3)">Barreira: <span style="color:'+barreiraCor+'">'+barreiraLabel+'</span></span>' +
      '</div>' +
      '<div class="v6-detail" id="v6d-'+i+'">' +
        '<div class="v6-detail-grid">' +
          '<div class="v6-info"><div class="v6-info-l">Ticket mínimo atacado</div><div class="v6-info-v">'+p.ticketMin+'</div></div>' +
          '<div class="v6-info"><div class="v6-info-l">Pedido mínimo</div><div class="v6-info-v">'+p.pedidoMin+'</div></div>' +
          '<div class="v6-info"><div class="v6-info-l">Barreira territorial</div><div class="v6-info-v" style="color:'+barreiraCor+'">'+barreiraLabel+' ('+p.barreira+'%)</div></div>' +
          '<div class="v6-info"><div class="v6-info-l">Área no sistema</div><div class="v6-info-v">'+(V6_CATS.find(function(c){return c.id===p.cat})||{icon:'',label:p.cat}).icon+' '+(V6_CATS.find(function(c){return c.id===p.cat})||{label:p.cat}).label+'</div></div>' +
        '</div>' +
        '<div class="v2-section-title" style="margin-top:10px">Fornecedores recomendados</div>' +
        '<div class="v6-forn-list">' +
          (p.fornecedores||[]).map(function(f){
            return '<div class="v6-forn-item">' +
              '<span>'+(tipoIcon[f.tipo]||'📦')+' <span class="v6-forn-nome">'+f.nome+'</span><span class="v6-forn-tipo">'+f.tipo+'</span></span>' +
              '<a href="'+f.link+'" target="_blank" rel="noopener" style="font-size:11px;color:var(--blue);white-space:nowrap;margin-left:8px">Ver →</a>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div style="margin-top:10px">' +
          '<button class="btn-ia" onclick="event.stopPropagation();v6IrParaQuiz(\''+p.cat+'\')" style="font-size:12px">Analisar nicho completo →</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function v6Toggle(i){
  var el = document.getElementById('v6d-'+i);
  if(!el) return;
  var isOpen = el.style.display === 'block';
  // Fechar todos
  document.querySelectorAll('.v6-detail').forEach(function(d){ d.style.display='none'; });
  if(!isOpen) el.style.display = 'block';
}

function v6IrParaQuiz(catId){
  // Pré-selecionar área no quiz principal
  S.area = catId;
  // Marcar o botão correspondente no S3
  var btns = document.querySelectorAll('#s3 .opt-btn');
  btns.forEach(function(b){
    if(b.getAttribute('onclick')&&b.getAttribute('onclick').includes("'"+catId+"'")){
      b.classList.add('selected');
    } else {
      b.classList.remove('selected');
    }
  });
  go('s0');
}

