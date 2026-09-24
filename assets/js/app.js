/* =========================================================================
   LEGUSTE PIZZARIA — Apresentação (front-end)
   Carrinho, pedido simulado, filtros, revelações e microinterações.
   Nenhum dado é enviado a servidor: é uma demonstração.
   ========================================================================= */
(function () {
  'use strict';

  var MENU = window.LEGUSTE_MENU;

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var REAL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  function moeda(v) { return REAL.format(v); }

  function icone(id) { return '<svg><use href="#' + id + '"/></svg>'; }

  /* ---------------------------------------------------------------- TOPO */
  var topo   = $('#topo');
  var nav    = $('#nav');
  var burger = $('#burger');

  function aoRolar() {
    if (!topo) return;
    topo.classList.toggle('solido', window.scrollY > 26);
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var aberto = nav.classList.toggle('aberto');
      burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    $$('#nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('aberto');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------ REVELAR */
  var observador = null;
  if ('IntersectionObserver' in window) {
    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          observador.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  }
  function observar(alvos) {
    alvos.forEach(function (el) {
      if (!el) return;
      if (observador) observador.observe(el);
      else el.classList.add('vis');
    });
  }
  observar($$('.rev'));

  /* ------------------------------------------------------------- AVISOS
     O balão flutuante "Item adicionado" foi REMOVIDO a pedido da casa: ele
     cobria a barra fixa do celular. O aviso agora vai para uma região
     aria-live que não aparece na tela, mantendo o feedback para leitores
     de tela sem desenhar nada por cima do conteúdo. */
  var aviso = $('#aviso');
  if (!aviso) {
    aviso = document.createElement('p');
    aviso.id = 'aviso';
    aviso.className = 'so-leitor';
    aviso.setAttribute('role', 'status');
    aviso.setAttribute('aria-live', 'polite');
    document.body.appendChild(aviso);
  }
  var avisoTimer = null;
  function mostrarToast(msg) {
    if (!aviso) return;
    aviso.textContent = msg;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { aviso.textContent = ''; }, 2300);
  }

  /* ------------------------------------------------------------ CARRINHO */
  var carrinho = [];                 // { id, nome, preco, img, qtd, massa }
  var carrinhoEl = $('#carrinho');
  var veu = $('#veu');
  var corpo = $('#carrinhoCorpo');
  var pe = $('#carrinhoPé');
  var contador = $('#contador');
  var carrinhoBtn = $('#abrirCarrinho');
  var etapa = 'carrinho';            // 'carrinho' | 'recibo'

  function acharItem(id) {
    for (var i = 0; i < MENU.itens.length; i++) if (MENU.itens[i].id === id) return MENU.itens[i];
    return null;
  }
  function acharMassa(id) {
    for (var i = 0; i < MENU.massas.length; i++) if (MENU.massas[i].id === id) return MENU.massas[i];
    return MENU.massas[0];
  }

  function totalItens() {
    return carrinho.reduce(function (n, l) { return n + l.qtd; }, 0);
  }
  function subtotal() {
    return carrinho.reduce(function (n, l) { return n + l.preco * l.qtd; }, 0);
  }
  function entregaAtual() {
    var s = subtotal();
    if (!carrinho.length) return 0;
    return s >= MENU.entrega.gratisAcima ? 0 : MENU.entrega.taxa;
  }

  function abrirCarrinho() {
    carrinhoEl.classList.add('aberto');
    veu.classList.add('aberto');
    carrinhoEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('travado');
    var f = $('#fecharCarrinho');
    if (f) f.focus();
  }
  function fecharCarrinho() {
    carrinhoEl.classList.remove('aberto');
    veu.classList.remove('aberto');
    carrinhoEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('travado');
  }

  if (carrinhoBtn) carrinhoBtn.addEventListener('click', abrirCarrinho);
  if (veu) veu.addEventListener('click', fecharCarrinho);
  var btnFechar = $('#fecharCarrinho');
  if (btnFechar) btnFechar.addEventListener('click', fecharCarrinho);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && carrinhoEl.classList.contains('aberto')) fecharCarrinho();
  });

  function atualizarContador() {
    var n = totalItens();
    if (!contador) return;
    contador.textContent = n;
    contador.classList.toggle('on', n > 0);
  }

  function animarCarrinho() {
    if (!carrinhoBtn) return;
    carrinhoBtn.classList.remove('pulso');
    void carrinhoBtn.offsetWidth;
    carrinhoBtn.classList.add('pulso');
  }

  function adicionar(id, massaId, silencioso) {
    var item = acharItem(id);
    if (!item) return;
    var massa = item.massa ? acharMassa(massaId || 'tradicional') : null;
    var chave = massa ? id + '::' + massa.id : id;
    var existente = null;
    for (var i = 0; i < carrinho.length; i++) if (carrinho[i].chave === chave) existente = carrinho[i];

    if (existente) {
      existente.qtd += 1;
    } else {
      carrinho.push({
        chave: chave,
        id: id,
        nome: item.nome,
        preco: item.preco + (massa ? massa.extra : 0),
        img: item.img,
        qtd: 1,
        massa: massa ? massa.nome : null
      });
    }
    atualizarContador();
    animarCarrinho();
    if (etapa === 'recibo') etapa = 'carrinho';   // recomeça o pedido depois do recibo
    render();
    if (!silencioso) mostrarToast(item.nome + ' no carrinho');
  }

  function mudarQtd(chave, delta) {
    for (var i = 0; i < carrinho.length; i++) {
      if (carrinho[i].chave === chave) {
        carrinho[i].qtd += delta;
        if (carrinho[i].qtd <= 0) carrinho.splice(i, 1);
        break;
      }
    }
    atualizarContador();
    render();
  }

  /* -------------------------------------------------- CARDÁPIO (GRADE) */
  var grade = $('#grade');
  var filtrosEl = $('#filtros');
  var filtroAtivo = 'todas';
  var massas = {};

  function montarFiltros() {
    if (!filtrosEl) return;
    var html = '';
    MENU.categorias.forEach(function (c) {
      var n = c.id === 'todas' ? MENU.itens.length : MENU.itens.filter(function (i) { return i.cat === c.id; }).length;
      html += '<button class="filtro' + (c.id === filtroAtivo ? ' on' : '') + '" type="button" data-cat="' + c.id + '" role="tab" aria-selected="' + (c.id === filtroAtivo) + '">'
            + c.nome + ' <span class="filtro__n">' + n + '</span></button>';
    });
    filtrosEl.innerHTML = html;

    $$('.filtro', filtrosEl).forEach(function (b) {
      b.addEventListener('click', function () {
        filtroAtivo = b.getAttribute('data-cat');
        $$('.filtro', filtrosEl).forEach(function (x) {
          var ativo = x === b;
          x.classList.toggle('on', ativo);
          x.setAttribute('aria-selected', ativo ? 'true' : 'false');
        });
        desenharGrade(true);
      });
    });
  }

  function desenharGrade(animar) {
    if (!grade) return;
    var lista = MENU.itens.filter(function (i) { return filtroAtivo === 'todas' || i.cat === filtroAtivo; });

    grade.innerHTML = lista.map(function (i, k) {
      var faixa = '';
      if (i.tags && i.tags.length) {
        var cls = i.cat === 'doces' ? ' prato__faixa--vermelho' : (i.tags[0].indexOf('R$') === 0 ? ' prato__faixa--verde' : '');
        faixa = '<span class="prato__faixa' + cls + '">' + i.tags[0] + '</span>';
      }
      return ''
        + '<article class="prato' + (animar ? ' rev' : '') + '" data-id="' + i.id + '"' + (animar ? ' style="--d:' + (k % 8) * 55 + 'ms"' : '') + '>'
        +   '<div class="prato__foto">'
        +     faixa
        +     '<img src="' + i.img + '" alt="' + i.nome + ' — Leguste Pizzaria" loading="lazy" width="800" height="600">'
        +   '</div>'
        +   '<div class="prato__corpo">'
        +     '<h3 class="prato__nome">' + i.nome + '</h3>'
        +     '<p class="prato__desc">' + i.desc + '</p>'
        +     '<div class="prato__pe">'
        +       '<div class="prato__preco"><small>' + (i.massa ? 'a partir de' : 'preço') + '</small>' + moeda(i.preco) + '</div>'
        +       '<button class="add" type="button" data-add="' + i.id + '" aria-label="Adicionar ' + i.nome + ' ao carrinho">' + icone('i-plus') + '</button>'
        +     '</div>'
        +   '</div>'
        + '</article>';
    }).join('');

    observar($$('.prato.rev', grade));

    $$('[data-add]', grade).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-add');
        var item = acharItem(id);
        if (item && item.massa) {
          abrirEscolhaMassa(item, b);
        } else {
          adicionar(id, null);
          b.classList.add('feito');
          setTimeout(function () { b.classList.remove('feito'); }, 900);
        }
      });
    });
  }

  /* modal leve de escolha de massa */
  function abrirEscolhaMassa(item, botao) {
    var cx = document.createElement('div');
    cx.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(4,3,2,.78);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px';
    cx.innerHTML = ''
      + '<div role="dialog" aria-modal="true" aria-label="Escolha a massa" style="width:100%;max-width:420px;background:var(--carvao-900);border:1px solid var(--linha);border-radius:var(--raio-lg);padding:24px;box-shadow:var(--sombra)">'
      +   '<h3 style="font-size:1.25rem">' + item.nome + '</h3>'
      +   '<p style="font-size:.85rem;color:var(--txt-mute);margin-top:6px">Escolha o tipo de massa — a casa oferece 3 tipos.</p>'
      +   '<div class="opcoes" style="margin-top:18px">'
      +     MENU.massas.map(function (m, k) {
              return '<label class="opcao' + (k === 0 ? ' on' : '') + '">'
                + '<input type="radio" name="massa" value="' + m.id + '"' + (k === 0 ? ' checked' : '') + '>'
                + '<span><b style="color:var(--creme-100);font-weight:700">' + m.nome + '</b>'
                + '<small style="display:block;color:var(--txt-mute);font-size:.78rem">' + m.desc + '</small></span>'
                + '<span class="opcao__p">' + (m.extra ? '+ ' + moeda(m.extra) : 'incluso') + '</span>'
                + '</label>';
            }).join('')
      +   '</div>'
      +   '<div style="display:flex;gap:10px;margin-top:20px">'
      +     '<button class="btn btn--vazio" type="button" data-fecha style="flex:1">Cancelar</button>'
      +     '<button class="btn" type="button" data-confirma style="flex:1.4">Adicionar</button>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(cx);
    document.body.classList.add('travado');

    function sair() {
      cx.remove();
      document.body.classList.remove('travado');
      document.removeEventListener('keydown', tecla);
    }
    function tecla(e) { if (e.key === 'Escape') sair(); }
    document.addEventListener('keydown', tecla);
    cx.addEventListener('click', function (e) { if (e.target === cx) sair(); });
    $('[data-fecha]', cx).addEventListener('click', sair);
    $$('.opcao input', cx).forEach(function (r) {
      r.addEventListener('change', function () {
        $$('.opcao', cx).forEach(function (o) { o.classList.remove('on'); });
        r.closest('.opcao').classList.add('on');
      });
    });
    $('[data-confirma]', cx).addEventListener('click', function () {
      var sel = $('input[name="massa"]:checked', cx);
      adicionar(item.id, sel ? sel.value : 'tradicional');
      if (botao) {
        botao.classList.add('feito');
        setTimeout(function () { botao.classList.remove('feito'); }, 900);
      }
      sair();
    });
  }

  /* --------------------------------------------------- RENDER CARRINHO */
  function render() {
    if (!corpo || !pe) return;
    atualizarContador();

    if (etapa === 'recibo') return; // o recibo se desenha sozinho

    if (!carrinho.length) {
      corpo.innerHTML = ''
        + '<div class="carrinho__vazio">' + icone('i-cart')
        + '<p style="font-weight:800;color:var(--creme-200)">Seu carrinho está vazio</p>'
        + '<p style="font-size:.86rem">Escolha uma pizza no cardápio para começar o pedido.</p>'
        + '<a class="btn btn--pequeno" href="#cardapio" data-fechar-cta>Ver o cardápio</a>'
        + '</div>';
      pe.hidden = true;
      var link = $('[data-fechar-cta]', corpo);
      if (link) link.addEventListener('click', fecharCarrinho);
      return;
    }

    corpo.innerHTML = ''
      + '<div class="itens">'
      + carrinho.map(function (l) {
          return ''
          + '<div class="item">'
          +   '<img class="item__foto" src="' + l.img + '" alt="' + l.nome + '" loading="lazy">'
          +   '<div>'
          +     '<div class="item__nome">' + l.nome + '</div>'
          +     '<div class="item__preco">' + (l.massa ? 'Massa ' + l.massa + ' · ' : '') + moeda(l.preco) + ' cada</div>'
          +   '</div>'
          +   '<div class="item__dir">'
          +     '<span class="item__sub">' + moeda(l.preco * l.qtd) + '</span>'
          +     '<span class="qtd">'
          +       '<button type="button" data-menos="' + l.chave + '" aria-label="Tirar um ' + l.nome + '">' + icone('i-minus') + '</button>'
          +       '<span>' + l.qtd + '</span>'
          +       '<button type="button" data-mais="' + l.chave + '" aria-label="Adicionar mais um ' + l.nome + '">' + icone('i-plus') + '</button>'
          +     '</span>'
          +   '</div>'
          + '</div>';
        }).join('')
      + '</div>'
      + '<div class="dados">'
      +   '<h4>Entrega</h4>'
      +   '<div class="campo"><label for="f-nome">Nome</label><input id="f-nome" type="text" placeholder="Seu nome completo" autocomplete="name"></div>'
      +   '<div class="linha2">'
      +     '<div class="campo"><label for="f-tel">Telefone</label><input id="f-tel" type="tel" placeholder="(21) 90000-0000" autocomplete="tel"></div>'
      +     '<div class="campo"><label for="f-pag">Pagamento</label>'
      +       '<select id="f-pag">'
      +         '<option>Pix</option><option>Cartão de crédito</option><option>Cartão de débito</option><option>Dinheiro</option>'
      +       '</select>'
      +     '</div>'
      +   '</div>'
      +   '<div class="campo"><label for="f-end">Endereço</label><input id="f-end" type="text" placeholder="Rua, número, bairro"></div>'
      +   '<div class="campo"><label for="f-obs">Observações</label><textarea id="f-obs" placeholder="Sem cebola, ponto da massa, ponto de referência..."></textarea></div>'
      +   '<div class="opcoes">'
      +     '<label class="opcao on"><input type="radio" name="modo" value="entrega" checked> Entrega em casa <span class="opcao__p">' + MENU.entrega.tempo + '</span></label>'
      +     '<label class="opcao"><input type="radio" name="modo" value="retirada"> Retirar na pizzaria <span class="opcao__p">Rua Geni Saraiva, 1430</span></label>'
      +   '</div>'
      + '</div>';

    $$('[data-mais]', corpo).forEach(function (b) {
      b.addEventListener('click', function () { mudarQtd(b.getAttribute('data-mais'), 1); });
    });
    $$('[data-menos]', corpo).forEach(function (b) {
      b.addEventListener('click', function () { mudarQtd(b.getAttribute('data-menos'), -1); });
    });
    $$('input[name="modo"]', corpo).forEach(function (r) {
      r.addEventListener('change', function () {
        $$('.opcao', corpo).forEach(function (o) { o.classList.remove('on'); });
        r.closest('.opcao').classList.add('on');
        pintarPe();
      });
    });

    pintarPe();
  }

  function modoAtual() {
    var r = $('input[name="modo"]:checked', corpo);
    return r ? r.value : 'entrega';
  }

  function pintarPe() {
    if (!pe) return;
    if (!carrinho.length) { pe.hidden = true; return; }
    pe.hidden = false;

    var s = subtotal();
    var modo = modoAtual();
    var entrega = modo === 'entrega' ? entregaAtual() : 0;

    pe.innerHTML = ''
      + '<div class="resumo">'
      +   '<div><span>Subtotal</span><span>' + moeda(s) + '</span></div>'
      +   (modo === 'entrega'
            ? '<div><span>Taxa de entrega</span><span>' + (entrega === 0 ? '<b style="color:var(--verde-400)">Grátis</b>' : moeda(entrega)) + '</span></div>'
            : '<div><span>Retirada no balcão</span><span>' + '<b style="color:var(--verde-400)">Sem taxa</b>' + '</span></div>')
      +   (modo === 'entrega' && s < MENU.entrega.gratisAcima
            ? '<div style="font-size:.76rem;color:var(--txt-mute)">Faltam ' + moeda(MENU.entrega.gratisAcima - s) + ' para entrega grátis</div>'
            : '')
      +   '<div class="total"><span>Total</span><b>' + moeda(s + entrega) + '</b></div>'
      + '</div>'
      + '<button class="btn btn--verde btn--bloco" type="button" id="btnFinalizar">' + icone('i-check') + ' Finalizar pedido</button>'
      + '<p style="font-size:.72rem;color:var(--txt-mute);text-align:center">Simulação — o pedido não é enviado.</p>';

    $('#btnFinalizar').addEventListener('click', finalizar);
  }

  /* --------------------------------------------------------- FINALIZAR */
  function finalizar() {
    var nome = ($('#f-nome') || {}).value || '';
    var tel  = ($('#f-tel') || {}).value || '';
    var end  = ($('#f-end') || {}).value || '';

    if (nome.trim().length < 2) { mostrarToast('Digite seu nome para continuar'); var f = $('#f-nome'); if (f) f.focus(); return; }
    if (tel.trim().length < 8)  { mostrarToast('Digite um telefone de contato'); var t = $('#f-tel'); if (t) t.focus(); return; }
    var modo = modoAtual();
    if (modo === 'entrega' && end.trim().length < 6) { mostrarToast('Informe o endereço de entrega'); var e2 = $('#f-end'); if (e2) e2.focus(); return; }

    var s = subtotal();
    var entrega = modo === 'entrega' ? entregaAtual() : 0;
    var total = s + entrega;
    var numero = 'LGS-' + String(Math.floor(1000 + Math.random() * 8999));

    etapa = 'recibo';
    pe.hidden = true;

    corpo.innerHTML = ''
      + '<div class="recibo">'
      +   '<div class="recibo__tick">' + icone('i-check') + '</div>'
      +   '<h3>Pedido confirmado!</h3>'
      +   '<p>Obrigado, ' + nome.split(' ')[0] + '. Sua pizza já entrou na fila do forno.</p>'
      +   '<div class="recibo__cx">'
      +     '<div><span>Pedido</span><b>' + numero + '</b></div>'
      +     '<div><span>Itens</span><b>' + totalItens() + '</b></div>'
      +     '<div><span>' + (modo === 'entrega' ? 'Tempo estimado' : 'Retirada') + '</span><b>' + (modo === 'entrega' ? MENU.entrega.tempo : 'na loja') + '</b></div>'
      +     '<div><span>Total</span><b>' + moeda(total) + '</b></div>'
      +   '</div>'
      +   '<div class="passos">'
      +     '<span class="passo on"><i>1</i> Escolher</span>'
      +     '<span class="passo on"><i>2</i> Pedido</span>'
      +     '<span class="passo"><i>3</i> Entrega</span>'
      +     '<span class="passo"><i>4</i> Avaliar</span>'
      +   '</div>'
      +   '<div style="display:flex;flex-direction:column;gap:10px;margin-top:26px">'
      +     '<button class="btn" type="button" id="btnAvaliarFlow">' + icone('i-star') + ' Avaliar no Google</button>'
      +     '<button class="btn btn--vazio" type="button" id="btnNovo">' + icone('i-pizza') + ' Fazer outro pedido</button>'
      +   '</div>'
      + '</div>';

    carrinho = [];
    atualizarContador();

    var bAv = $('#btnAvaliarFlow');
    if (bAv) bAv.addEventListener('click', function () {
      fecharCarrinho();
      irAvaliar();
    });
    var bNovo = $('#btnNovo');
    if (bNovo) bNovo.addEventListener('click', function () {
      etapa = 'carrinho';
      render();
      fecharCarrinho();
    });

    mostrarToast('Pedido ' + numero + ' confirmado!');
  }

  function irAvaliar() {
    var alvo = $('#avaliar');
    if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var primeiro = posEstrelas ? $('button', posEstrelas) : null;
    if (primeiro) setTimeout(function () { primeiro.focus(); }, 700);
  }

  /* -------------------------------------------------- AVALIAR NO GOOGLE */
  var posEstrelas = $('#posEstrelas');
  var posDica = $('#posDica');
  var dicas = {
    1: 'Poxa… conte o que deu errado para a gente melhorar.',
    2: 'Vamos trabalhar para merecer mais estrelas.',
    3: 'Bom! Queremos chegar no cinco.',
    4: 'Quase perfeito — obrigado!',
    5: 'Maravilha! Isso ajuda demais a Leguste.'
  };
  var notaAtual = 0;

  function estrelas(n) {
    notaAtual = n;
    if (!posEstrelas) return;
    $$('button', posEstrelas).forEach(function (b) {
      b.classList.toggle('on', Number(b.getAttribute('data-nota')) <= n);
    });
    if (posDica) posDica.textContent = dicas[n] || '';
  }

  if (posEstrelas) {
    $$('button', posEstrelas).forEach(function (b) {
      b.addEventListener('click', function () { estrelas(Number(b.getAttribute('data-nota'))); });
      b.addEventListener('mouseenter', function () {
        var n = Number(b.getAttribute('data-nota'));
        $$('button', posEstrelas).forEach(function (x) {
          x.classList.toggle('on', Number(x.getAttribute('data-nota')) <= n);
        });
      });
    });
    posEstrelas.addEventListener('mouseleave', function () { estrelas(notaAtual); });
  }

  var btnGoogle = $('#btnGoogle');
  if (btnGoogle) btnGoogle.addEventListener('click', function () {
    if (!notaAtual) {
      mostrarToast('Escolha de 1 a 5 estrelas para continuar');
      var primeiro = posEstrelas ? $('button', posEstrelas) : null;
      if (primeiro) primeiro.focus();
      return;
    }
    if (notaAtual <= 3) {
      mostrarToast('Obrigado pelo retorno — vamos melhorar!');
    } else {
      mostrarToast('Abrindo o Google para sua avaliação…');
    }
    /* O perfil oficial da Leguste no Google é a fonte das avaliações reais.
       Mantenha este link apontando para lá quando a URL definitiva estiver definida. */
    var urlGoogle = 'https://www.google.com/search?q=Leguste+Pizzaria+Nova+Igua%C3%A7u';
    setTimeout(function () { window.open(urlGoogle, '_blank', 'noopener'); }, 700);
  });

  /* ------------------------------------------------------------- INÍCIO */
  if ($('#ano')) $('#ano').textContent = String(new Date().getFullYear());

  montarFiltros();
  desenharGrade(true);
  atualizarContador();
  render();

  /* atalho: abre o carrinho já com um item de demonstração? Não — mantém vazio. */
  console.log('%cLeguste Pizzaria', 'color:#efb02c;font-weight:800', '— apresentação front-end (pedido simulado, sem envio de dados).');
})();
