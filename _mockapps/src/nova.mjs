import { ic, rng, pick, thb, num, avatar, badge, btn, card, kpi, table, pager, tabs, field, area, toggle, progress, chart, toast, modal, shell, page, EN_NAMES, thName } from './kit.mjs';
const A = {
  name: 'Nova Commerce', org: 'Baan Craft Co., Ltd.', logo: ic('shopping-bag', 17), user: ['Siriporn Kaewmanee', 'Store Owner'],
  css: `body{--ac:#ea580c;--acs:#fff4ed}`,
  nav: [{ items: [['Overview', 'layout-dashboard'], ['Orders', 'receipt', '38'], ['Products', 'package'], ['Inventory', 'warehouse', '6'], ['Customers', 'users']] },
    { group: 'Growth', items: [['Marketing', 'megaphone'], ['Discounts', 'ticket-percent'], ['Reports', 'chart-column']] },
    { group: 'Channels', items: [['Website', 'globe'], ['Shopee', 'store'], ['Lazada', 'store'], ['LINE OA', 'message-circle']] }],
  sideFoot: `<a class="ni">${ic('settings', 17)}<span>Settings</span></a>`,
  topExtra: `<span class="bd bd-green">Live · 4 channels synced</span>`,
};
const r = rng(11);
const CH = [['Website', 'blue'], ['Shopee', 'amber'], ['Lazada', 'violet'], ['LINE OA', 'green']];
const PRODUCTS = [
  ['Handwoven Rattan Tote — Natural', 'BC-RT-001', 1290, 'Bags', 0], ['Ceramic Mug Set (4 pcs) Celadon', 'BC-CM-014', 890, 'Kitchen', 30], ['Teak Serving Board Large', 'BC-TK-022', 1450, 'Kitchen', 26],
  ['Indigo Cotton Throw 130×170', 'BC-IN-008', 2190, 'Home', 175], ['Bamboo Desk Organizer', 'BC-BD-031', 590, 'Office', 48], ['Leather Card Holder — Tan', 'BC-LC-005', 690, 'Accessories', 21],
  ['Scented Candle Lemongrass 200g', 'BC-SC-040', 450, 'Home', 63], ['Woven Placemat Set (6)', 'BC-WP-017', 780, 'Kitchen', 102], ['Mini Analog Wall Clock', 'BC-CL-009', 1190, 'Home', 175], ['Canvas Laptop Sleeve 14"', 'BC-LS-012', 990, 'Office', 1]];
const ph = (id) => `../_shared/photos/${id}.jpg`;
const ST = [['Paid', 'green'], ['To ship', 'blue'], ['Pending payment', 'amber'], ['Shipped', 'teal'], ['Delivered', 'gray'], ['Cancelled', 'red']];
function orders(n, seed) {
  const r = rng(seed); const out = [];
  for (let i = 0; i < n; i++) {
    const nm = pick(r, EN_NAMES); const ch = pick(r, CH); const st = i < 3 ? ST[i % 3] : pick(r, ST); const items = 1 + Math.floor(r() * 4);
    const tot = Math.round((300 + r() * 5200) / 10) * 10; const d = 31 - Math.floor(i / 3);
    out.push({ no: '#NV-' + (20931 - i), nm, ch, st, items, tot, date: `${d} ต.ค. 2026, ${String(9 + Math.floor(r() * 12)).padStart(2, '0')}:${String(Math.floor(r() * 60)).padStart(2, '0')}`, pay: pick(r, ['PromptPay', 'Credit card', 'COD', 'TrueMoney', 'ShopeePay']) });
  }
  return out;
}
const days = Array.from({ length: 30 }, (_, i) => `${i + 2} ต.ค.`);
const ser = (base, amp, seed) => { const r = rng(seed); return days.map((_, i) => Math.round(base + Math.sin(i / 3) * amp * 0.4 + r() * amp + (i % 7 >= 5 ? amp * 0.6 : 0) + i * base * 0.01)); };

export const pages = {};
pages['dashboard'] = () => {
  const od = orders(6, 3);
  const body = `<div class="grid g4">${kpi('Net revenue', '฿2,483,920', '18.2%', true, 'vs ก.ย. 2026', 'banknote')}${kpi('Orders', '1,294', '9.4%', true, 'vs ก.ย. 2026', 'receipt')}${kpi('Avg. order value', '฿1,919', '3.1%', true, 'vs ก.ย. 2026', 'shopping-cart')}${kpi('Refund rate', '1.8%', '0.4%', false, 'vs ก.ย. 2026', 'rotate-ccw')}</div>
  <div class="grid g21 mt">${card('Revenue by channel', chart('rev', { type: 'line', data: { labels: days, datasets: [
    { label: 'Website', data: ser(32000, 14000, 1), borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.08)', fill: true, tension: .35, pointRadius: 0, borderWidth: 2 },
    { label: 'Shopee', data: ser(26000, 12000, 2), borderColor: '#ea580c', tension: .35, pointRadius: 0, borderWidth: 2 },
    { label: 'Lazada', data: ser(14000, 7000, 3), borderColor: '#7c3aed', tension: .35, pointRadius: 0, borderWidth: 2 },
    { label: 'LINE OA', data: ser(8000, 5000, 4), borderColor: '#16a34a', tension: .35, pointRadius: 0, borderWidth: 2 }] },
    options: { plugins: { legend: { position: 'top', align: 'end' } }, scales: { y: { ticks: { callback: 'k' } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } } } } }, 268), `<div class="pills tabs"><span class="tab">7D</span><span class="tab on">30D</span><span class="tab">QTD</span><span class="tab">YTD</span></div>`)}
  ${card('Sales by channel', chart('ch', { type: 'doughnut', data: { labels: ['Website', 'Shopee', 'Lazada', 'LINE OA'], datasets: [{ data: [38, 31, 18, 13], backgroundColor: ['#2563eb', '#ea580c', '#7c3aed', '#16a34a'], borderWidth: 0 }] }, options: { cutout: '72%', plugins: { legend: { position: 'bottom' } } } }, 268), 'ต.ค. 2026')}</div>
  <div class="grid g21 mt">${card('Recent orders', table(['Order', 'Customer', 'Channel', 'Status', ['Total', 'r']], od.map((o) => [`<b>${o.no}</b>`, `<div class="cell">${avatar(o.nm, 24)}${o.nm}</div>`, badge(o.ch[0], o.ch[1], false), badge(o.st[0], o.st[1]), `<b>${thb(o.tot)}</b>`])), `<a style="color:var(--ac);font-weight:600">View all</a>`, 'flush')}
  ${card('Top products', PRODUCTS.slice(0, 5).map((p, i) => `<div class="list-i"><img class="thumb" src="${ph(p[4])}"><div class="grow"><b>${p[0]}</b><small>${p[1]} · ${[412, 356, 298, 241, 198][i]} sold</small></div><b>${thb(p[2] * [412, 356, 298, 241, 198][i])}</b></div>`).join(''), 'This month')}</div>`;
  return shell(A, 'Overview', body, { title: 'สวัสดีตอนเย็น, Siriporn 👋', crumbs: ['Baan Craft', 'Overview'], actions: btn('2 – 31 ต.ค. 2026', 'sec', 'calendar') + btn('Export', 'sec', 'download') + btn('Create order', 'pri', 'plus') });
};
pages['orders'] = () => {
  const od = orders(13, 9);
  const t = table(['Order', 'Date', 'Customer', 'Channel', ['Items', 'c'], 'Payment', 'Status', ['Total', 'r'], ''], od.map((o, i) => ({ _sel: i === 2 || i === 4, cells: [`<b style="color:var(--ac)">${o.no}</b>`, `<span class="muted">${o.date}</span>`, `<div class="cell">${avatar(o.nm, 26)}<div>${o.nm}<small>${o.nm.split(' ')[0].toLowerCase()}@gmail.com</small></div></div>`, badge(o.ch[0], o.ch[1], false), o.items, o.pay, badge(o.st[0], o.st[1]), `<b>${thb(o.tot)}</b>`, ic('ellipsis', 16, 'muted')] })), { check: true });
  const body = `<div class="card">${tabs(['All orders <span class="muted">1,294</span>', 'Pending payment <span class="muted">12</span>', 'To ship <span class="muted">38</span>', 'Shipped <span class="muted">164</span>', 'Delivered', 'Cancelled / Returned'], 0)}
  <div class="fbar"><span class="inp" style="width:300px">${ic('search', 15)}<span class="iv muted">Search order no., customer, phone…</span></span>${btn('Channel: All', 'sec', 'list-filter')}${btn('Payment', 'sec', 'credit-card')}${btn('Date: Oct 2026', 'sec', 'calendar')}<span class="grow"></span><span class="muted">2 selected</span>${btn('Print labels', 'sec', 'printer')}${btn('Mark as shipped', 'pri', 'truck')}</div>${t}${pager(1, 13, 1294, 1, 100)}</div>`;
  return shell(A, 'Orders', body, { title: 'Orders', crumbs: ['Sales', 'Orders'], actions: btn('Import', 'sec', 'upload') + btn('Export CSV', 'sec', 'download') + btn('Create order', 'pri', 'plus') });
};
pages['order-detail'] = () => {
  const items = [PRODUCTS[0], PRODUCTS[3], PRODUCTS[6]]; const q = [1, 1, 2];
  const sub = items.reduce((a, p, i) => a + p[2] * q[i], 0);
  const body = `<div class="grid" style="grid-template-columns:1fr 360px">
  <div>${card('Items <span class="muted" style="font-weight:400">· 4 units</span>', items.map((p, i) => `<div class="list-i"><img class="thumb" style="width:52px;height:52px" src="${ph(p[4])}"><div class="grow"><b>${p[0]}</b><small>SKU ${p[1]} · ${p[3]}</small></div><span class="muted">${thb(p[2])} × ${q[i]}</span><b style="width:90px;text-align:right">${thb(p[2] * q[i])}</b></div>`).join('') +
    `<div class="sep"></div><dl class="dl" style="grid-template-columns:1fr 120px;text-align:right"><dt>Subtotal</dt><dd>${thb(sub)}</dd><dt>Shipping (Kerry Express)</dt><dd>฿60</dd><dt>Discount · NOVA10</dt><dd style="color:#059669">−${thb(Math.round(sub * .1))}</dd><dt style="color:var(--tx);font-weight:600">Total paid</dt><dd style="font-size:16px;font-weight:700">${thb(sub + 60 - Math.round(sub * .1))}</dd></dl>`, badge('Paid', 'green'))}
  ${card('Timeline', `<div class="tl">${[['Order placed via Website', '28 ต.ค. 2026, 19:42'], ['Payment confirmed · PromptPay ref 0428-7719', '28 ต.ค. 2026, 19:43'], ['Packed by Warehouse BKK-1 (Anan P.)', '29 ต.ค. 2026, 10:15'], ['Handed to Kerry Express · KEX 8823 1904 552', '29 ต.ค. 2026, 15:02'], ['Out for delivery', 'Estimated 31 ต.ค. 2026']].map((t, i) => `<div class="tl-i ${i > 3 ? 'off' : ''}"><b>${t[0]}</b><small>${t[1]}</small></div>`).join('')}</div>`, '', 'mt')}</div>
  <div>${card('Customer', `<div class="row" style="gap:12px">${avatar('Mali Srisawat', 44)}<div><b style="font-size:14px">Mali Srisawat</b><div class="muted">7 orders · Customer since มี.ค. 2025</div></div></div><div class="sep"></div><dl class="dl" style="grid-template-columns:90px 1fr"><dt>Email</dt><dd>mali.sri@gmail.com</dd><dt>Phone</dt><dd>081-462-9937</dd><dt>Segment</dt><dd>${badge('Loyal', 'violet', false)}</dd></dl>`, ic('ellipsis', 16))}
  ${card('Shipping address', `<div style="line-height:1.7">มาลี ศรีสวัสดิ์<br>88/142 หมู่บ้านพฤกษาวิลล์ ซ.รามอินทรา 40<br>แขวงนวลจันทร์ เขตบึงกุ่ม<br>กรุงเทพมหานคร 10230</div>`, `<a style="color:var(--ac);font-weight:600">Edit</a>`, 'mt')}
  ${card('Notes', `<div class="muted">ฝากไว้กับ รปภ. หน้าหมู่บ้านได้ค่ะ ถ้าไม่อยู่บ้าน</div>`, '', 'mt')}</div></div>`;
  return shell(A, 'Orders', body, { title: `Order #NV-20927 ${badge('In transit', 'teal')}`, crumbs: ['Orders', '#NV-20927'], actions: btn('', 'sec', 'printer') + btn('Refund', 'sec', 'rotate-ccw') + btn('Send update to customer', 'pri', 'send') });
};
function productsTable() {
  const stock = [42, 118, 3, 26, 210, 0, 64, 9, 37, 85];
  return table(['Product', 'SKU', 'Category', 'Channels', ['Price', 'r'], 'Stock', 'Status'], PRODUCTS.map((p, i) => [`<div class="cell"><img class="thumb" src="${ph(p[4])}"><b>${p[0]}</b></div>`, `<span class="muted">${p[1]}</span>`, p[3], '<span class="row" style="gap:4px">' + CH.slice(0, 2 + (i % 3)).map((c) => badge(c[0], c[1], false)).join('') + '</span>', `<b>${thb(p[2])}</b>`, `<div style="width:120px"><div class="row sb" style="font-size:12px;margin-bottom:4px"><span>${stock[i]} pcs</span></div>${progress(Math.min(100, stock[i] / 2.2), stock[i] < 10 ? '#dc2626' : stock[i] < 30 ? '#f59e0b' : '#16a34a')}</div>`, stock[i] === 0 ? badge('Out of stock', 'red') : stock[i] < 10 ? badge('Low stock', 'amber') : badge('Active', 'green')]), { check: true });
}
pages['products'] = () => shell(A, 'Products', `<div class="card"><div class="fbar"><span class="inp" style="width:300px">${ic('search', 15)}<span class="iv muted">Search products or SKU</span></span>${btn('Category: All', 'sec', 'list-filter')}${btn('Stock status', 'sec')}<span class="grow"></span>${tabs(['<span>' + ic('list', 14) + '</span>', '<span>' + ic('layout-grid', 14) + '</span>'], 0, 'pills')}</div>${productsTable()}${pager(1, 10, 248, 1, 25)}</div>`, { title: 'Products', crumbs: ['Catalog', 'Products'], actions: btn('Sync channels', 'sec', 'refresh-cw') + btn('Add product', 'pri', 'plus') });
pages['add-product'] = () => {
  const m = modal('Add new product', `<div class="form">${field('Product name', 'Hand-painted Benjarong Bowl 6"', { w: 2 })}${field('SKU', 'BC-BJ-046')}${field('Category', 'Kitchen', { type: 'select' })}${field('Price (THB)', '1,890.00', { icon: 'banknote' })}${field('Compare-at price', '2,290.00')}${field('Initial stock', '24', { hint: 'Warehouse BKK-1' })}${field('Weight (g)', '480')}${area('Description', 'ชามเบญจรงค์เขียนลายมือ จากช่างฝีมือสมุทรสาคร เคลือบทองแท้ 18K เหมาะเป็นของขวัญ ใช้ได้กับอาหารร้อน ไม่เหมาะกับไมโครเวฟ', 74)}
  <div style="grid-column:1/-1"><span class="fl">Publish to channels</span><div class="row" style="gap:18px;margin-top:8px">${CH.map((c, i) => `<span class="row">${toggle(i !== 2)} ${c[0]}</span>`).join('')}</div></div></div>`, btn('Cancel', 'sec') + btn('Save as draft', 'sec') + btn('Publish product', 'pri'), 620, 'Product will be synced to selected marketplaces within ~2 minutes.');
  return shell(A, 'Products', `<div class="card">${productsTable()}</div>`, { title: 'Products', crumbs: ['Catalog', 'Products'], actions: btn('Add product', 'pri', 'plus'), overlay: m });
};
pages['customers'] = () => {
  const r = rng(5);
  const rows = Array.from({ length: 9 }, (_, i) => { const n = EN_NAMES[(i * 3 + 1) % EN_NAMES.length]; const o = 2 + Math.floor(r() * 20); return [`<div class="cell">${avatar(n, 28)}<div><b>${n}</b><small>08${Math.floor(r() * 10)}-${100 + Math.floor(r() * 899)}-${1000 + Math.floor(r() * 8999)}</small></div></div>`, pick(r, ['กรุงเทพฯ', 'เชียงใหม่', 'ขอนแก่น', 'ภูเก็ต', 'นนทบุรี', 'ชลบุรี']), o, `<b>${thb(o * (900 + Math.floor(r() * 1400)))}</b>`, badge(...pick(r, [['VIP', 'violet'], ['Loyal', 'blue'], ['New', 'green'], ['At risk', 'amber']]), false), `<span class="muted">${1 + Math.floor(r() * 28)} ต.ค. 2026</span>`]; });
  const body = `<div class="grid g4">${kpi('Total customers', '18,402', '6.1%', true, '', 'users')}${kpi('Repeat purchase', '34.7%', '2.3%', true, '', 'repeat')}${kpi('Customer LTV', '฿4,860', '4.0%', true, '', 'gem')}${kpi('At-risk', '1,128', '3.2%', false, '', 'user-x')}</div>
  <div class="grid g12 mt">${card('New vs returning', chart('nr', { type: 'bar', data: { labels: ['พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.'], datasets: [{ label: 'New', data: [820, 910, 1040, 980, 1210, 1302], backgroundColor: '#fdba74', borderRadius: 4 }, { label: 'Returning', data: [430, 520, 610, 640, 702, 811], backgroundColor: '#ea580c', borderRadius: 4 }] }, options: { plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true } } } }, 330))}
  ${card('Customers', table(['Customer', 'Province', ['Orders', 'c'], ['Total spent', 'r'], 'Segment', 'Last order'], rows), btn('Filter', 'sec btn-sm', 'list-filter'), 'flush')}</div>`;
  return shell(A, 'Customers', body, { title: 'Customers', crumbs: ['Customers'], actions: btn('Create segment', 'sec', 'users') + btn('Add customer', 'pri', 'user-plus') });
};
pages['reports'] = () => {
  const mo = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.'];
  const rev = [1.42, 1.38, 1.61, 1.55, 1.72, 1.69, 1.88, 1.97, 2.1, 2.48];
  const body = `<div class="grid g21">${card('Gross sales 2026 (THB, millions)', chart('gs', { type: 'bar', data: { labels: mo, datasets: [{ label: '2026', data: rev, backgroundColor: '#ea580c', borderRadius: 5, barPercentage: .6 }, { label: '2025', data: [1.1, 1.05, 1.2, 1.28, 1.31, 1.4, 1.45, 1.52, 1.6, 1.81], backgroundColor: '#fed7aa', borderRadius: 5, barPercentage: .6 }] }, options: { plugins: { legend: { position: 'top', align: 'end' } }, scales: { x: { grid: { display: false } } } } }, 300), btn('Monthly', 'sec btn-sm', 'chevron-down'))}
  ${card('Summary · YTD', `<dl class="dl" style="grid-template-columns:1fr auto;gap:12px"><dt>Gross sales</dt><dd>฿17,800,400</dd><dt>Discounts</dt><dd>−฿842,310</dd><dt>Returns</dt><dd>−฿311,920</dd><dt>Net sales</dt><dd>฿16,646,170</dd><dt>Marketplace fees</dt><dd>−฿1,204,660</dd><dt>Shipping</dt><dd>฿688,240</dd><dt>VAT 7%</dt><dd>฿1,165,231</dd></dl><div class="sep"></div><div class="row sb"><b>Total collected</b><b style="font-size:18px">฿17,295,000</b></div>`)}</div>
  <div class="card mt">${table(['Month', ['Orders', 'r'], ['Gross sales', 'r'], ['Discounts', 'r'], ['Net sales', 'r'], ['AOV', 'r'], ['Growth', 'r']], mo.slice(4).reverse().map((m, i) => { const v = rev[9 - i] * 1e6; return [`<b>${m} 2026</b>`, num(Math.round(v / 1919)), thb(v), '−' + thb(Math.round(v * .048)), `<b>${thb(Math.round(v * .952))}</b>`, thb(1919 - i * 23), `<span class="${i === 4 ? 'down' : 'up'}">${i === 4 ? '−1.7%' : '+' + (4 + i * 2.1).toFixed(1) + '%'}</span>`]; }))}</div>`;
  return shell(A, 'Reports', body, { title: 'Sales report', crumbs: ['Reports', 'Sales'], actions: btn('ม.ค. – ต.ค. 2026', 'sec', 'calendar') + btn('Download PDF', 'sec', 'file-down') + btn('Schedule email', 'pri', 'mail') });
};
pages['login'] = () => page(A, `<div class="auth"><div class="auth-l"><div class="row"><span class="logo">${A.logo}</span><b style="font-size:16px">Nova Commerce</b></div><div class="auth-f"><h1>เข้าสู่ระบบ</h1><p class="muted" style="margin:6px 0 24px">Sign in to manage your store, orders and channels.</p><div class="form" style="grid-template-columns:1fr">${field('Email', 'siriporn@baancraft.co.th', { icon: 'mail' })}${field('Password', '••••••••••', { icon: 'lock' })}</div><div class="row sb" style="margin:14px 0 20px"><span class="row"><span class="cb on">${ic('check', 11)}</span> Remember me</span><a style="color:var(--ac);font-weight:600">Forgot password?</a></div><button class="btn btn-pri" style="width:100%;height:42px;justify-content:center">Sign in</button><div class="row" style="margin:20px 0;color:var(--mu)"><span class="sep grow" style="margin:0"></span>or<span class="sep grow" style="margin:0"></span></div><button class="btn" style="width:100%;height:42px;justify-content:center">${ic('message-circle', 16)} Continue with LINE</button><p class="muted" style="text-align:center;margin-top:24px">New to Nova? <a style="color:var(--ac);font-weight:600">Create a store</a></p></div><div class="muted" style="font-size:12px">© 2026 Nova Commerce · Privacy · Terms</div></div>
  <div class="auth-r"><div style="max-width:520px"><img src="${ph(26)}" style="width:100%;height:300px;object-fit:cover;border-radius:14px;margin-bottom:28px"><h2 style="font-size:24px;margin:0 0 10px">ขายทุกช่องทาง จัดการได้ในที่เดียว</h2><p class="muted" style="font-size:14px;line-height:1.7">Orders from Shopee, Lazada, LINE OA and your website land in one queue. Stock updates everywhere the moment something sells.</p><div class="row" style="gap:28px;margin-top:22px"><div><b style="font-size:20px">3,200+</b><div class="muted">Thai brands</div></div><div><b style="font-size:20px">฿4.1B</b><div class="muted">GMV processed 2026</div></div></div></div></div></div>`);
export const shots = [['dashboard'], ['orders'], ['order-detail'], ['products'], ['add-product'], ['customers'], ['reports'], ['login']];
