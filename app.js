/* BeanCraft Artisan Roastery — shared script (vanilla JS) */
const IMG = {
 "colombian": "https://lh3.googleusercontent.com/aida-public/AB6AXuBC6HpIKVEfjZoEeteuJ9JFWT5BoQfZRmJgyDZwHd05fGwmR-CzDemW0rfzSPNi-h6th3nLtyhhHBFEGuyvwlP-G10i73D_srYh2Mqo8-dtZhGkVWkive5q2fU_fXpjDurWGK6wzRBFsgSf4pLZcOnjCuGq0IOM4DbaA7s57HVLpDOup8UP6L7rTovF-6scsyzdyoN7MrrIqYUPnG8YakZJLN1Vlt2EFNy-CJebGJB-uPWaSEBQm0eJEg",
 "vanilla": "https://lh3.googleusercontent.com/aida-public/AB6AXuCW8qgQT0Ux8MrmQvd8rcjfq72JgX9aB7Ubpt-2I4Sel_9f1pXLCXl6I8Rnm-MeKgV2YNmqJkbnbXWtGTZeTUacpYjyJ7p-wCLc_7c2I6qTHTT6mDBQw6eQ2ow241WJYMGk3SnRm8hMaSOCP8J8ifglbJmyeKsG97B0GxHMal3ksn2CJ0ed7wySn5T6rkEW5nuHxUO-UvCrw0YrbWP7e2A9f7i3Phc50udodWVEoNImPgekegOAeQ3vkQ",
 "espresso": "https://lh3.googleusercontent.com/aida-public/AB6AXuALuFCQKEx5AnJrF0-sPUYxqLzSgKmpcefo9v8SAfvhXi81rS5XeLl4t516VZAqtxRsqCkIz2oOR6Nc49w8nVu3dhilXWAZtD8xR3nbmM36V2E6ZdDfLqublN5lFZ5nZlMsl9hMKjJkw6GnboCgN4j2vVCd2w4bNC9p4yNRe5yCPLA4jXsNfNkOBVLejkEWW6HyO-BTMIdsQA-SnuLO1iubsVY5h_3uE0lWmL23KrtXfx3AHYskC5Xa_Q"
};
const TAGS = {colombian:'Dark roast',vanilla:'House infused',espresso:'Reserve blend'};
const PROFILE = {
 colombian:[['Roast depth','Dark',88],['Body','Full and heavy',85],['Sweetness','Brown sugar',65],['Acidity','Low',25]],
 vanilla:[['Roast depth','Medium',55],['Body','Smooth',60],['Sweetness','Vanilla caramel',85],['Acidity','Low',30]],
 espresso:[['Roast depth','Medium-dark',72],['Body','Syrupy',80],['Sweetness','Cocoa and cherry',70],['Acidity','Balanced',45]]};
/* One product, three roast variants */
const PRODUCTS = [
 {id:'colombian',name:'Colombian Dark Roast',price:1500,origin:'Huila, Colombia',roast:'Dark',notes:'Dark chocolate, toasted walnut, brown sugar',desc:'Slow-roasted until the oils just begin to shine. Heavy-bodied and low in acidity, it stands up to milk and suits an early morning.'},
 {id:'vanilla',name:'Vanilla Hazelnut Latte',price:1650,origin:'Brazil and Colombia',roast:'Medium',notes:'Real vanilla, roasted hazelnut, caramel',desc:'A medium roast scented with real vanilla and hazelnut. Sweet without sugar, and made for steamed milk.'},
 {id:'espresso',name:'Espresso Blend',price:1800,origin:'Brazil, Ethiopia, Guatemala',roast:'Medium-dark',notes:'Cocoa, black cherry, long caramel finish',desc:'Our house blend, built for the machine: thick crema, balanced sweetness and enough backbone for a flat white.'}
];
const GRINDS = {'Whole Bean':'Grind fresh at home','Ground':'Medium grind for drip and moka','French Press':'Coarse grind for plunger pots'};
const DELIVERY = 250, FREE_OVER = 5000, KEY = 'beancraft_cart';

const $ = (s, r = document) => r.querySelector(s);
const money = n => 'Rs. ' + n.toLocaleString('en-PK');
const find = id => PRODUCTS.find(p => p.id === id);
const pic = p => `<img src="${IMG[p.id]}" alt="${p.name} pouch with coffee" loading="lazy" onerror="this.remove()">`;

/* cart (kept in localStorage so it travels between pages) */
const getCart = () => { try { return (JSON.parse(localStorage.getItem(KEY)) || []).filter(i => find(i.id)); } catch { return []; } };
const saveCart = c => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {} updateBadge(); };
function updateBadge() {
  const n = getCart().reduce((s, i) => s + i.qty, 0), b = $('#cartCount');
  if (b) { b.textContent = n; b.hidden = !n; }
}
function addToCart(id, grind, qty) {
  const cart = getCart(), hit = cart.find(i => i.id === id && i.grind === grind);
  hit ? hit.qty += qty : cart.push({id, grind, qty});
  saveCart(cart);
}
function toast(msg, link) {
  const t = $('#toast');
  t.innerHTML = msg + (link ? ` <a href="order.html">View order</a>` : '');
  t.classList.add('toast--show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('toast--show'), 3500);
}

/* nav */
const toggle = $('.nav__toggle');
toggle?.addEventListener('click', () => {
  const open = $('.nav').classList.toggle('nav--open');
  toggle.setAttribute('aria-expanded', open);
});
updateBadge();

/* ---------- product page: one product, choose a roast variant ---------- */
const box = $('#product');
if (box) {
  let p = find(new URLSearchParams(location.search).get('v')) || PRODUCTS[0], qty = 1;
  box.innerHTML = `<fieldset class="detail__choose"><legend class="detail__legend">Choose your blend</legend><div class="variants">
      ${PRODUCTS.map(v => `<label class="variant"><input type="radio" name="variant" value="${v.id}"><span class="variant__img">${pic(v)}</span>
        <span class="variant__body"><span class="chip">${TAGS[v.id]}</span><b>${v.name}</b><span class="text-muted">${v.notes}</span><strong>${money(v.price)} <small>per 250 g pack</small></strong></span></label>`).join('')}
    </div></fieldset>
    <div class="panel detail__info">
      <div class="detail__about">
        <h2 id="pname"></h2>
        <p id="pdesc"></p>
        <p class="detail__price" id="pprice"></p>
        <dl class="modal__meta" id="pmeta"></dl>
      </div>
      <div class="detail__options">
        <fieldset><legend>Grind</legend><div class="grind">
          ${Object.keys(GRINDS).map((g, i) => `<label class="grind__option"><input type="radio" name="grind" value="${g}" ${i ? '' : 'checked'}><span>${g}</span></label>`).join('')}
        </div><p class="text-muted" id="gh">${GRINDS['Whole Bean']}</p></fieldset>
        <div class="modal__row"><div class="qty" role="group" aria-label="Quantity">
          <button type="button" data-d="-1" aria-label="Fewer">&minus;</button><output id="q" aria-live="polite">1</output><button type="button" data-d="1" aria-label="More">+</button></div>
          <p class="modal__total">Total <strong id="tot"></strong></p></div>
        <div class="hero__cta"><button class="btn" type="button" id="add">Add to order</button><a class="btn btn--ghost" href="order.html">Go to order</a></div>
      </div>
    </div>`;
  const show = () => {
    $('#pname', box).textContent = p.name;
    $('#pdesc', box).textContent = p.desc; $('#pprice', box).innerHTML = `${money(p.price)} <small>per 250 g pack</small>`;
    $('#pmeta', box).innerHTML = `<dt>Origin</dt><dd>${p.origin}</dd><dt>Roast</dt><dd>${p.roast}</dd><dt>Tasting notes</dt><dd>${p.notes}</dd>`;
    $('#q', box).textContent = qty; $('#tot', box).textContent = money(p.price * qty);
    $(`input[name=variant][value=${p.id}]`, box).checked = true;
  };
  box.addEventListener('click', e => {
    const d = e.target.closest('[data-d]');
    if (d) { qty = Math.min(20, Math.max(1, qty + +d.dataset.d)); show(); }
  });
  box.addEventListener('change', e => {
    if (e.target.name === 'grind') $('#gh', box).textContent = GRINDS[e.target.value];
    if (e.target.name === 'variant') { p = find(e.target.value); show(); }
  });
  $('#add', box).addEventListener('click', () => {
    addToCart(p.id, $('input[name=grind]:checked', box).value, qty);
    toast(`${qty} × ${p.name} added.`, true);
  });
  show();
}

/* ---------- home page: variant cards + roast profile ---------- */
const vbox = $('#variants');
if (vbox) vbox.innerHTML = PRODUCTS.map(p => `<li><a class="product-card" href="product.html?v=${p.id}"><span class="product-card__visual">${pic(p)}</span>
  <span class="product-card__body"><span class="chip">${TAGS[p.id]}</span><strong>${p.name}</strong><span class="text-muted">${p.notes}</span>
  <span class="product-card__price">${money(p.price)} <small>per 250 g pack</small></span></span></a></li>`).join('');
const lab = $('#lab');
if (lab) {
  const tabs = $('#labtabs');
  tabs.innerHTML = PRODUCTS.map(p => `<button type="button" class="lab__tab" data-id="${p.id}">${p.name}</button>`).join('');
  lab.innerHTML = PROFILE.colombian.map(() => `<div><span><em></em><b></b></span><i></i></div>`).join('');
  const draw = id => {
    tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === id));
    [...lab.children].forEach((row, n) => {
      const [k, v, pct] = PROFILE[id][n];
      row.querySelector('em').textContent = k; row.querySelector('b').textContent = v; row.querySelector('i').style.setProperty('--v', pct + '%');
    });
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) draw(b.dataset.id); });
  draw('colombian');
}

/* ---------- order page ---------- */
const list = $('#items');
function render() {
  const cart = getCart(), form = $('#checkout');
  const sub = cart.reduce((s, i) => s + find(i.id).price * i.qty, 0);
  const ship = !sub || sub >= FREE_OVER ? 0 : DELIVERY;
  list.innerHTML = cart.length ? cart.map((i, n) => {
    const p = find(i.id);
    return `<div class="order-item"><div><strong>${p.name}</strong><br><span class="text-muted">${i.grind}, 250 g, ${money(p.price)} each</span></div><b>${money(p.price * i.qty)}</b>
      <div><span class="qty"><button type="button" data-n="${n}" data-d="-1" aria-label="Fewer ${p.name}">&minus;</button><output>${i.qty}</output><button type="button" data-n="${n}" data-d="1" aria-label="More ${p.name}">+</button></span>
      <button type="button" class="order-item__remove" data-n="${n}" data-rm>Remove</button></div></div>`;
  }).join('') : `<div class="order__empty"><p>Your order is empty. Pick a blend to get started.</p><p><a class="btn" href="product.html">Browse blends</a></p></div>`;
  $('#sub').textContent = money(sub);
  $('#ship').textContent = ship ? money(ship) : 'Free';
  $('#grand').textContent = money(sub + ship);
  $('#hint').textContent = sub && !ship ? '' : sub ? `Free delivery on orders over ${money(FREE_OVER)}.` : '';
  form.querySelector('button[type=submit]').disabled = !cart.length;
}
if (list) {
  list.addEventListener('click', e => {
    const b = e.target.closest('button[data-n]'); if (!b) return;
    const cart = getCart(), it = cart[b.dataset.n];
    if (b.hasAttribute('data-rm')) cart.splice(b.dataset.n, 1);
    else it.qty = Math.min(20, Math.max(1, it.qty + +b.dataset.d));
    saveCart(cart); render();
  });
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your full name.',
    phone: v => /^(\+92|0)?3\d{2}[- ]?\d{7}$/.test(v.trim()) || 'Enter a mobile number like 0300-1234567.',
    email: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email like name@example.com.',
    address: v => v.trim().length >= 10 || 'Enter your full delivery address, including area and city.'
  };
  const check = f => {
    const r = rules[f.name]?.(f.value), ok = r === true || r === undefined;
    f.setAttribute('aria-invalid', !ok); $('#e-' + f.name).textContent = ok ? '' : r; return ok;
  };
  const form = $('#checkout');
  form.addEventListener('focusout', e => e.target.name in rules && check(e.target));
  form.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true' && e.target.name in rules) check(e.target); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [...form.elements].filter(f => f.name in rules && !check(f));
    if (bad.length) return bad[0].focus();
    const id = 'BC-' + Date.now().toString().slice(-6), total = $('#grand').textContent;
    $('#order-main').innerHTML = `<div class="panel order__done" role="status"><h2>Thank you, ${form.name.value.trim().split(' ')[0]}.</h2>
      <p>Order <strong>${id}</strong> is confirmed. We will roast your beans fresh and call ${form.phone.value.trim()} before delivery.</p>
      <p>Total to pay on delivery: <strong>${total}</strong></p><a class="btn" href="product.html">Order more coffee</a></div>`;
    saveCart([]); toast(`Order ${id} placed successfully.`); window.scrollTo({top: 0, behavior: 'smooth'});
  });
  render();
}
