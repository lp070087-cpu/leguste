/* =========================================================================
   LEGUSTE PIZZARIA — Dados do cardápio
   Regra desta apresentação: cada item usa a FOTO REAL que corresponde ao
   sabor. Nada de reaproveitar imagem de uma pizza para nomear outra.

   Fontes reais usadas aqui:
   · "imagens dos produtos"  → as 10 fotos de pizza e 6 de bebida
   · material oficial Leguste → "+40 sabores tradicionais", "3 tipos de massa",
     "Rodízio da Cerâmica", "Maracanã R$ 59,99", "Maracanã + pizza média
     R$ 86,90", "exceto banana nevada", iFood/99Food, Rua Geni Saraiva 1430.

   Os valores abaixo são referência de apresentação (o dono ajusta os preços
   no cardápio definitivo). Só os dois valores que constam no material da casa
   — R$ 59,99 e R$ 86,90 — são tratados como oficiais.
   ========================================================================= */
window.LEGUSTE_MENU = {
  categorias: [
    { id: 'todas',     nome: 'Todas' },
    { id: 'salgadas',  nome: 'Salgadas' },
    { id: 'especiais', nome: 'Especiais' },
    { id: 'doces',     nome: 'Doces' },
    { id: 'bebidas',   nome: 'Bebidas' }
  ],

  itens: [
    /* ---------- SALGADAS (foto real = sabor do nome) ---------- */
    {
      id: 'p-pepperoni', nome: 'Pepperoni', cat: 'salgadas',
      desc: 'Fatias de pepperoni sobre mussarela derretida, com borda dourada e pimenta calabresa.',
      preco: 62.90, img: 'assets/img/pizza-pepperoni.jpg',
      tags: ['Mais pedida'], massa: true
    },
    {
      id: 'p-presunto-catupiry', nome: 'Presunto com Catupiry', cat: 'salgadas',
      desc: 'Presunto, catupiry cremoso e azeitona preta sobre a mussarela.',
      preco: 60.90, img: 'assets/img/pizza-presunto.jpg',
      tags: [], massa: true
    },
    {
      id: 'p-frango-catupiry', nome: 'Frango com Catupiry', cat: 'salgadas',
      desc: 'Frango desfiado temperado, catupiry por cima e um toque de orégano.',
      preco: 63.90, img: 'assets/img/pizza-frango-catupiry.jpg',
      tags: ['Campeã da casa'], massa: true
    },
    {
      id: 'p-frango-milho', nome: 'Frango com Milho', cat: 'salgadas',
      desc: 'Frango desfiado, milho verde e mussarela — leve e cremosa.',
      preco: 62.90, img: 'assets/img/pizza-frango-milho.jpg',
      tags: [], massa: true
    },
    {
      id: 'p-quatro-queijos', nome: 'Quatro Queijos', cat: 'salgadas',
      desc: 'Mussarela, parmesão, provolone e catupiry na medida para o queijo esticar bem alto.',
      preco: 68.90, img: 'assets/img/pizza-quatro-queijos.jpg',
      tags: ['Queijo'], massa: true
    },
    {
      id: 'p-rucula', nome: 'Rúcula com Tomate Seco', cat: 'salgadas',
      desc: 'Mussarela coberta com rúcula fresca e tomate — finalização da casa.',
      preco: 66.90, img: 'assets/img/pizza-rucula.jpg',
      tags: [], massa: true
    },

    /* ---------- ESPECIAIS ---------- */
    {
      id: 'p-maracana', nome: 'Maracanã', cat: 'especiais',
      desc: 'A pizza grande que dá nome à promoção da casa: pepperoni generoso e massa no ponto.',
      preco: 59.99, img: 'assets/img/pizza-especial-casa.jpg',
      tags: ['R$ 59,99'], massa: true
    },
    {
      id: 'p-pepperoni-catupiry', nome: 'Pepperoni com Bordas Fofas', cat: 'especiais',
      desc: 'Pepperoni na borda alta, massa macia por dentro e crocante por fora.',
      preco: 67.90, img: 'assets/img/pizza-pepperoni-catupiry.jpg',
      tags: [], massa: true
    },
    {
      id: 'p-combo-duplo', nome: 'Dupla Leguste', cat: 'especiais',
      desc: 'Duas pizzas em uma só pedida — combinação perfeita para dividir a mesa.',
      preco: 96.90, img: 'assets/img/combo-duplo.jpg',
      tags: ['Para dividir'], massa: true
    },
    {
      id: 'p-combo-familia', nome: 'Trio da Família', cat: 'especiais',
      desc: 'Três pizzas salgadas para a mesa cheia. Ideal para grupos e aniversários.',
      preco: 138.90, img: 'assets/img/combo-familia.jpg',
      tags: ['Família'], massa: true
    },

    /* ---------- DOCES ----------
       Os arquivos de imagem disponíveis são de pizza salgada; por isso estes
       itens ficam marcados com a etiqueta "inclusa no rodízio" e usam a arte
       de sobremesa da casa (combo 02), sem fingir foto do sabor.
       Substituir pelas fotos oficiais das doces antes de publicar. */
    {
      id: 'p-doce-rodizio', nome: 'Pizzas Doces do Rodízio', cat: 'doces',
      desc: 'Banana nevada, chocolate com granulado e prestígio entram no rodízio. Exceto banana nevada em algumas promoções.',
      preco: 44.90, img: 'assets/img/combo-doce.jpg',
      tags: ['Inclusa no rodízio'], massa: false
    },

    /* ---------- BEBIDAS ---------- */
    { id: 'b-guarana-350', nome: 'Guaraná Antarctica Lata', cat: 'bebidas',
      desc: '350 ml, bem gelada.', preco: 7.50, img: 'assets/img/bebida-guarana-350.jpg', tags: [], massa: false },
    { id: 'b-guarana-1l', nome: 'Guaraná Antarctica 1 L', cat: 'bebidas',
      desc: 'Garrafa de 1 litro para dividir a mesa.', preco: 12.90, img: 'assets/img/bebida-guarana-1l.jpg', tags: [], massa: false },
    { id: 'b-coca-350', nome: 'Coca-Cola Lata', cat: 'bebidas',
      desc: '350 ml, sabor original.', preco: 8.00, img: 'assets/img/bebida-coca-350.jpg', tags: [], massa: false },
    { id: 'b-coca-1l', nome: 'Coca-Cola 1 L', cat: 'bebidas',
      desc: 'Garrafa de 1 litro.', preco: 13.50, img: 'assets/img/bebida-coca-1l.jpg', tags: [], massa: false },
    { id: 'b-pepsi-lata', nome: 'Pepsi Lata', cat: 'bebidas',
      desc: '350 ml, bem gelada.', preco: 7.50, img: 'assets/img/bebida-pepsi-lata.jpg', tags: [], massa: false },
    { id: 'b-pepsi-1l', nome: 'Pepsi 1 L', cat: 'bebidas',
      desc: 'Garrafa PET de 1 litro.', preco: 12.50, img: 'assets/img/bebida-pepsi-1l.jpg', tags: [], massa: false }
  ],

  /* Massas — o material oficial da Leguste informa "3 tipos de massa" */
  massas: [
    { id: 'tradicional', nome: 'Tradicional',       desc: 'Massa fina e crocante', extra: 0 },
    { id: 'grossa',      nome: 'Grossa',            desc: 'Borda alta e macia',    extra: 6 },
    { id: 'catupiry',    nome: 'Borda de Catupiry', desc: 'Borda recheada',        extra: 12 }
  ],

  entrega: {
    taxa: 8.90,
    gratisAcima: 120,
    tempo: '45–70 min'
  }
};
