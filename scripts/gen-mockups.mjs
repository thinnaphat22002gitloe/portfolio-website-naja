// Renders polished mockup images for sample portfolio projects -> public/picture/mock-*.png
// Usage: node gen-mockups.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const outDir = process.argv[2];
const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const P = [
  { key: 'nova-commerce', name: 'Nova Commerce', title: 'E-Commerce Command Center', c1: '#ff8c35', c2: '#e8405a', icon: '🛍️',
    nav: ['Overview', 'Orders', 'Products', 'Customers', 'Marketing', 'Reports'],
    kpis: [['Revenue', '฿2.48M', '+18.2%'], ['Orders', '12,904', '+9.4%'], ['AOV', '฿1,920', '+3.1%'], ['Conversion', '4.8%', '+0.6%']],
    table: ['Order', 'Customer', 'Channel', 'Total'], rows: [['#TH-20931', 'Siriporn K.', 'Shopee', '฿3,240'], ['#TH-20930', 'Anan P.', 'Website', '฿1,180'], ['#TH-20929', 'Mali S.', 'LINE OA', '฿5,920'], ['#TH-20928', 'Krit W.', 'Lazada', '฿860']],
    mobile: 'shop' },
  { key: 'paysmart-banking', name: 'PaySmart', title: 'Mobile Banking App', c1: '#6c63ff', c2: '#00d4ff', icon: '💳',
    nav: ['Home', 'Accounts', 'Transfer', 'Cards', 'Invest', 'Security'],
    kpis: [['Active users', '384K', '+12.5%'], ['Transfers / day', '1.2M', '+7.9%'], ['Fraud blocked', '99.97%', '+0.02%'], ['App rating', '4.8★', '+0.3']],
    table: ['Transaction', 'Type', 'Status', 'Amount'], rows: [['PromptPay → Ploy', 'Transfer', 'Success', '฿1,500'], ['7-Eleven', 'QR Pay', 'Success', '฿89'], ['Salary Oct', 'Income', 'Success', '฿45,000'], ['Netflix', 'Card', 'Pending', '฿419']],
    mobile: 'bank' },
  { key: 'pulse-analytics', name: 'Pulse', title: 'SaaS Product Analytics', c1: '#a855f7', c2: '#6c63ff', icon: '📈',
    nav: ['Dashboard', 'Funnels', 'Retention', 'Cohorts', 'Events', 'Settings'],
    kpis: [['MRR', '$184K', '+11.3%'], ['Active accounts', '2,931', '+6.0%'], ['Churn', '1.9%', '-0.4%'], ['NPS', '62', '+5']],
    table: ['Account', 'Plan', 'Seats', 'MRR'], rows: [['Acme Corp', 'Enterprise', '240', '$9,600'], ['Siam Logistics', 'Business', '85', '$3,400'], ['Bloom Studio', 'Pro', '12', '$480'], ['NorthWind', 'Business', '64', '$2,560']],
    mobile: 'analytics' },
  { key: 'tablefy-booking', name: 'Tablefy', title: 'Restaurant Booking Platform', c1: '#f59e0b', c2: '#ef4444', icon: '🍽️',
    nav: ['Tonight', 'Reservations', 'Floor plan', 'Guests', 'Menu', 'Reviews'],
    kpis: [['Covers today', '286', '+14%'], ['Occupancy', '87%', '+6%'], ['No-show rate', '2.1%', '-1.3%'], ['Avg. rating', '4.9★', '+0.1']],
    table: ['Time', 'Guest', 'Party', 'Table'], rows: [['18:30', 'Nattapong R.', '4 ppl', 'T12'], ['19:00', 'Sarah L.', '2 ppl', 'B03'], ['19:15', 'Chaiya F.', '6 ppl', 'VIP-1'], ['19:45', 'Kanya M.', '3 ppl', 'T07']],
    mobile: 'food' },
  { key: 'estatia-realestate', name: 'Estatia', title: 'Real-Estate Marketplace', c1: '#10b981', c2: '#0ea5e9', icon: '🏙️',
    nav: ['Explore', 'Listings', 'Map view', 'Leads', 'Viewings', 'Agents'],
    kpis: [['Active listings', '8,420', '+9.1%'], ['Leads / week', '1,276', '+22%'], ['Avg. price/m²', '฿118K', '+2.4%'], ['Closed deals', '312', '+15%']],
    table: ['Property', 'Area', 'Type', 'Price'], rows: [['The Line Asoke', 'Sukhumvit', 'Condo', '฿8.9M'], ['Baan Rim Nam', 'Nonthaburi', 'House', '฿14.5M'], ['Ari Loft', 'Phaya Thai', 'Condo', '฿5.2M'], ['Villa Kata', 'Phuket', 'Villa', '฿32M']],
    mobile: 'estate' },
  { key: 'atlas-ai-console', name: 'Atlas AI', title: 'AI Chatbot Console', c1: '#00d4ff', c2: '#a855f7', icon: '🤖',
    nav: ['Conversations', 'Knowledge base', 'Flows', 'Analytics', 'Integrations', 'API keys'],
    kpis: [['Conversations', '48.2K', '+31%'], ['Auto-resolved', '82%', '+8%'], ['Avg. response', '1.2s', '-0.4s'], ['CSAT', '4.7★', '+0.2']],
    table: ['Channel', 'Intent', 'Confidence', 'Status'], rows: [['LINE OA', 'Order status', '0.97', 'Resolved'], ['Website', 'Refund policy', '0.92', 'Resolved'], ['Facebook', 'Book demo', '0.88', 'Handoff'], ['API', 'Pricing', '0.95', 'Resolved']],
    mobile: 'chat' },
];

const linePath = (pts, w, h) => pts.map((v, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1)) * w},${h - v * h}`).join(' ');
const series = (seed, n = 12) => Array.from({ length: n }, (_, i) => 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(i * 0.7 + seed)) * (0.6 + i / n * 0.5) * 0.9);

function sidebar(p) {
  return `<aside class="side"><div class="brand"><span class="logo" style="background:linear-gradient(135deg,${p.c1},${p.c2})">${p.icon}</span>${p.name}</div>
  ${p.nav.map((n, i) => `<div class="nav ${i === 0 ? 'on' : ''}"><span class="dot"></span>${n}</div>`).join('')}
  <div class="upgrade" style="background:linear-gradient(135deg,${p.c1}33,${p.c2}33)"><b>Pro workspace</b><span>All modules active</span></div></aside>`;
}
function kpis(p) {
  return `<div class="kpis">${p.kpis.map(([l, v, d], i) => `<div class="card kpi"><span class="lbl">${l}</span><b>${v}</b><span class="delta ${d.startsWith('-') && i !== 2 ? 'neg' : ''}">${d}</span>
  <svg viewBox="0 0 120 30" class="spark"><path d="${linePath(series(i + 1, 10), 120, 30)}" stroke="${i % 2 ? p.c2 : p.c1}" fill="none" stroke-width="2.5" stroke-linecap="round"/></svg></div>`).join('')}</div>`;
}
function bigChart(p) {
  const a = series(1), b = series(2.4).map(v => v * 0.7);
  const W = 640, H = 200;
  return `<div class="card chart"><div class="ch-head"><b>Performance</b><div class="pills"><span class="pill on">12M</span><span class="pill">6M</span><span class="pill">30D</span></div></div>
  <svg viewBox="0 0 ${W} ${H + 20}" class="big"><defs><linearGradient id="g${p.key}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${p.c1}" stop-opacity=".45"/><stop offset="1" stop-color="${p.c1}" stop-opacity="0"/></linearGradient></defs>
  ${[0, 1, 2, 3].map(i => `<line x1="0" x2="${W}" y1="${i * H / 3}" y2="${i * H / 3}" stroke="#ffffff10"/>`).join('')}
  <path d="${linePath(a, W, H)} L${W},${H} L0,${H} Z" fill="url(#g${p.key})"/>
  <path d="${linePath(a, W, H)}" stroke="${p.c1}" stroke-width="3.5" fill="none"/>
  <path d="${linePath(b, W, H)}" stroke="${p.c2}" stroke-width="3" fill="none" stroke-dasharray="8 7"/>
  ${['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m, i) => `<text x="${i * W / 5.4 + 4}" y="${H + 18}" fill="#8b93a7" font-size="13">${m}</text>`).join('')}
  </svg></div>`;
}
function donut(p) {
  const segs = [0.42, 0.28, 0.18, 0.12], cols = [p.c1, p.c2, '#ffffff55', '#ffffff22'];
  let acc = 0; const R = 54, C = 2 * Math.PI * R;
  return `<div class="card donut"><b>Breakdown</b><svg viewBox="0 0 140 140"><g transform="rotate(-90 70 70)">${segs.map((s, i) => { const el = `<circle cx="70" cy="70" r="${R}" fill="none" stroke="${cols[i]}" stroke-width="18" stroke-dasharray="${s * C - 3} ${C}" stroke-dashoffset="${-acc * C}"/>`; acc += s; return el; }).join('')}</g>
  <text x="70" y="76" text-anchor="middle" fill="#fff" font-size="22" font-weight="800">42%</text></svg>
  <div class="legend">${p.nav.slice(1, 5).map((n, i) => `<span><i style="background:${cols[i]}"></i>${n}</span>`).join('')}</div></div>`;
}
function table(p) {
  return `<div class="card tbl"><div class="ch-head"><b>Recent activity</b><span class="pill">View all</span></div><table><tr>${p.table.map(t => `<th>${t}</th>`).join('')}</tr>
  ${p.rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 2 ? `<span class="tag" style="color:${p.c1};background:${p.c1}1f">${c}</span>` : c}</td>`).join('')}</tr>`).join('')}</table></div>`;
}
function bars(p) {
  const v = [0.5, 0.72, 0.6, 0.9, 0.66, 0.8, 0.95];
  return `<div class="card bars"><b>Weekly volume</b><div class="barrow">${v.map((x, i) => `<div class="bar" style="height:${x * 100}%;background:linear-gradient(180deg,${i === 6 ? p.c1 : p.c2},${i === 6 ? p.c2 : p.c2 + '55'})"></div>`).join('')}</div>
  <div class="days">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<span>${d}</span>`).join('')}</div></div>`;
}
function dashboard(p) {
  return `<div class="app">${sidebar(p)}<main><div class="top"><div><span class="crumb">${p.name} / ${p.nav[0]}</span><h2>${p.title}</h2></div>
  <div class="search">🔍  Search anything…</div><div class="avatar" style="background:linear-gradient(135deg,${p.c1},${p.c2})">N</div></div>
  ${kpis(p)}<div class="grid2">${bigChart(p)}${donut(p)}</div><div class="grid3">${table(p)}${bars(p)}</div></main></div>`;
}
function mobileScreen(p, v = 0) {
  const items = {
    shop: [['Wireless Earbuds', '฿1,290', '🎧'], ['Smart Watch S2', '฿3,990', '⌚'], ['Desk Lamp', '฿790', '💡']],
    bank: [['PromptPay', '-฿1,500', '⚡'], ['Salary', '+฿45,000', '🏦'], ['Coffee', '-฿65', '☕']],
    analytics: [['Signups', '+1,204', '🧩'], ['Activation', '63%', '🚀'], ['Retention D30', '48%', '🔁']],
    food: [['Sushi Omakase', '19:00 · 2', '🍣'], ['Thai Fine Dining', '19:30 · 4', '🍜'], ['Rooftop Bar', '21:00 · 3', '🍸']],
    estate: [['Condo · Asoke', '฿8.9M', '🏢'], ['House · Bangna', '฿6.4M', '🏡'], ['Villa · Phuket', '฿32M', '🏝️']],
    chat: [['สวัสดีครับ เช็กสถานะออเดอร์', 'user', '🙂'], ['ออเดอร์ #TH-20931 กำลังจัดส่ง ถึงพรุ่งนี้ครับ', 'bot', '🤖'], ['ขอบคุณครับ!', 'user', '🙂']],
  }[p.mobile];
  const hero = v % 3;
  if (p.mobile === 'chat') {
    return `<div class="m"><div class="mhead"><b>${p.name}</b><span>online</span></div>${items.map(([t, who]) => `<div class="bubble ${who}" style="${who === 'bot' ? `background:linear-gradient(135deg,${p.c1},${p.c2})` : ''}">${t}</div>`).join('')}
    <div class="bubble bot" style="background:linear-gradient(135deg,${p.c1},${p.c2})">ต้องการให้ช่วยอะไรเพิ่มเติมไหมครับ? ✨</div><div class="minput">Type a message…<span style="background:${p.c1}">➤</span></div></div>`;
  }
  return `<div class="m"><div class="mhead"><b>${hero === 1 ? p.nav[1] : 'Hi, Naja 👋'}</b><span class="mav" style="background:linear-gradient(135deg,${p.c1},${p.c2})"></span></div>
  <div class="mhero" style="background:linear-gradient(135deg,${p.c1},${p.c2})"><span>${p.kpis[hero][0]}</span><b>${p.kpis[hero][1]}</b><em>${p.kpis[hero][2]} this month</em>
  <svg viewBox="0 0 200 40"><path d="${linePath(series(hero + 3, 10), 200, 40)}" stroke="#fff" stroke-width="3" fill="none"/></svg></div>
  <div class="mchips">${p.nav.slice(1, 4).map((n, i) => `<span class="${i === 0 ? 'on' : ''}" style="${i === 0 ? `background:${p.c1}` : ''}">${n}</span>`).join('')}</div>
  ${items.map(([a, b, ic]) => `<div class="mrow"><span class="mic" style="background:${p.c1}22">${ic}</span><div><b>${a}</b><small>${p.name}</small></div><em>${b}</em></div>`).join('')}
  <div class="mtab">${['⌂', '◎', '＋', '♡', '☰'].map((t, i) => `<span style="${i === 2 ? `background:linear-gradient(135deg,${p.c1},${p.c2});color:#fff` : ''}">${t}</span>`).join('')}</div></div>`;
}
const phone = (p, v, cls = '') => `<div class="phone ${cls}"><div class="notch"></div>${mobileScreen(p, v)}</div>`;
const browser = (p, cls = '') => `<div class="browser ${cls}"><div class="bar3"><i></i><i></i><i></i><span class="url">app.${p.key.split('-')[0]}.co.th</span></div>${dashboard(p)}</div>`;

function page(p, variant) {
  let body;
  if (variant === 1) {
    body = `<div class="cover"><div class="copy"><span class="eyebrow" style="color:${p.c1}">TMRW · Sample work</span><h1>${p.name}<br><span style="background:linear-gradient(90deg,${p.c1},${p.c2});-webkit-background-clip:text;color:transparent">${p.title}</span></h1>
    <p>UX/UI Design · Web & Mobile · Cloud API</p><div class="chips">${['React', 'TypeScript', 'FastAPI', 'Realtime'].map(t => `<span>${t}</span>`).join('')}</div></div>
    <div class="stage">${browser(p, 'tilt')}${phone(p, 0, 'float')}</div></div>`;
  } else if (variant === 2) {
    body = `<div class="solo">${browser(p, 'wide')}</div>`;
  } else {
    body = `<div class="trio">${phone(p, 1, 'p1')}${phone(p, 0, 'p2')}${phone(p, 2, 'p3')}<div class="caption"><b>${p.name} Mobile</b><span>iOS & Android · ${p.title}</span></div></div>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:1600px;height:1000px;overflow:hidden;font-family:'Segoe UI','Leelawadee UI',system-ui,sans-serif;color:#e9ecf5;
   background:radial-gradient(900px 600px at 15% 10%,${p.c1}55,transparent 60%),radial-gradient(900px 700px at 90% 90%,${p.c2}55,transparent 60%),#0b0e1a;position:relative}
  body:before{content:'';position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:48px 48px;mask:radial-gradient(circle at 50% 50%,#000,transparent 80%)}
  .browser{position:absolute;border-radius:18px;overflow:hidden;background:#11152a;border:1px solid #ffffff1f;box-shadow:0 40px 120px -20px #000c,0 0 0 1px #ffffff08}
  .bar3{height:40px;display:flex;align-items:center;gap:8px;padding:0 16px;background:#0d1124;border-bottom:1px solid #ffffff12}
  .bar3 i{width:12px;height:12px;border-radius:50%;background:#ff5f57}.bar3 i:nth-child(2){background:#febc2e}.bar3 i:nth-child(3){background:#28c840}
  .url{margin-left:20px;padding:5px 18px;border-radius:8px;background:#ffffff0d;color:#8b93a7;font-size:13px;width:340px}
  .app{display:flex;height:calc(100% - 40px)}
  .side{width:210px;padding:22px 14px;background:#0e1226;border-right:1px solid #ffffff10;display:flex;flex-direction:column;gap:4px}
  .brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px;margin-bottom:22px}
  .logo{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-size:17px}
  .nav{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:#8b93a7;font-size:14px}
  .nav .dot{width:8px;height:8px;border-radius:3px;background:#ffffff22}.nav.on{background:#ffffff10;color:#fff;font-weight:600}.nav.on .dot{background:${p.c1}}
  .upgrade{margin-top:auto;padding:14px;border-radius:14px;font-size:12px;display:flex;flex-direction:column;gap:3px;border:1px solid #ffffff14}.upgrade span{color:#aab}
  main{flex:1;padding:22px 26px;display:flex;flex-direction:column;gap:16px;min-width:0}
  .top{display:flex;align-items:center;gap:16px}.top h2{font-size:24px;font-weight:800}.crumb{font-size:12px;color:#8b93a7}
  .search{margin-left:auto;padding:9px 16px;border-radius:10px;background:#ffffff0b;border:1px solid #ffffff12;color:#8b93a7;font-size:13px;width:240px}
  .avatar{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-weight:800}
  .card{background:linear-gradient(180deg,#ffffff0c,#ffffff05);border:1px solid #ffffff14;border-radius:16px;padding:16px}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  .kpi{display:flex;flex-direction:column;gap:4px;position:relative}.kpi .lbl{font-size:12px;color:#8b93a7}.kpi b{font-size:26px;font-weight:800;letter-spacing:-.5px}
  .delta{font-size:12px;color:#34d399;font-weight:700}.delta.neg{color:#f87171}.spark{position:absolute;right:12px;bottom:14px;width:90px}
  .grid2{display:grid;grid-template-columns:2.1fr 1fr;gap:14px}.grid3{display:grid;grid-template-columns:1.6fr 1fr;gap:14px}
  .ch-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .pills{display:flex;gap:6px}.pill{font-size:11px;padding:4px 10px;border-radius:20px;background:#ffffff0d;color:#aab}.pill.on{background:${p.c1};color:#fff}
  svg.big{width:100%;height:190px}
  .donut{display:flex;flex-direction:column;gap:8px}.donut svg{width:130px;align-self:center}
  .legend{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;color:#aab}.legend i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:6px}
  table{width:100%;border-collapse:collapse;font-size:13px}th{text-align:left;color:#8b93a7;font-weight:600;padding:7px 4px;border-bottom:1px solid #ffffff12}td{padding:8px 4px;border-bottom:1px solid #ffffff08}
  .tag{padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700}
  .bars{display:flex;flex-direction:column}.barrow{flex:1;display:flex;align-items:flex-end;gap:10px;height:120px;margin-top:12px}.bar{flex:1;border-radius:8px 8px 4px 4px}
  .days{display:flex;gap:10px;margin-top:6px}.days span{flex:1;text-align:center;font-size:11px;color:#8b93a7}
  .phone{position:absolute;width:300px;height:620px;border-radius:46px;background:#0a0d1a;border:10px solid #1c2136;box-shadow:0 40px 100px -20px #000d,inset 0 0 0 1px #ffffff14;overflow:hidden}
  .notch{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:92px;height:26px;border-radius:20px;background:#000;z-index:2}
  .m{padding:48px 16px 16px;height:100%;display:flex;flex-direction:column;gap:12px;background:linear-gradient(180deg,#121731,#0a0d1a)}
  .mhead{display:flex;justify-content:space-between;align-items:center}.mhead b{font-size:18px}.mhead span{font-size:11px;color:#34d399}.mav{width:30px;height:30px;border-radius:50%}
  .mhero{border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:2px;box-shadow:0 14px 30px -10px ${p.c1}aa}.mhero span{font-size:12px;opacity:.85}.mhero b{font-size:28px}.mhero em{font-size:11px;font-style:normal;opacity:.9}.mhero svg{margin-top:6px}
  .mchips{display:flex;gap:6px}.mchips span{font-size:11px;padding:6px 10px;border-radius:20px;background:#ffffff10;color:#ccd}.mchips span.on{color:#fff}
  .mrow{display:flex;align-items:center;gap:10px;padding:10px;border-radius:14px;background:#ffffff08;border:1px solid #ffffff0d}
  .mic{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:18px}.mrow div{flex:1;display:flex;flex-direction:column}.mrow b{font-size:13px}.mrow small{font-size:10px;color:#8b93a7}.mrow em{font-style:normal;font-weight:800;font-size:13px}
  .mtab{margin-top:auto;display:flex;justify-content:space-around;padding:8px;border-radius:20px;background:#ffffff0d}.mtab span{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;color:#aab}
  .bubble{max-width:82%;padding:10px 13px;border-radius:16px;font-size:13px;line-height:1.4}.bubble.user{align-self:flex-end;background:#ffffff14}.bubble.bot{align-self:flex-start;color:#fff}
  .minput{margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding:8px 8px 8px 14px;border-radius:20px;background:#ffffff10;color:#8b93a7;font-size:12px}.minput span{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:#fff}
  .cover .copy{position:absolute;left:90px;top:150px;width:520px}
  .eyebrow{font-weight:800;letter-spacing:.3em;text-transform:uppercase;font-size:14px}
  h1{font-size:64px;line-height:1.05;font-weight:900;margin:18px 0 22px;letter-spacing:-1.5px}.copy p{color:#aab3c8;font-size:20px}
  .chips{display:flex;gap:10px;margin-top:28px;flex-wrap:wrap}.chips span{padding:8px 16px;border-radius:30px;background:#ffffff10;border:1px solid #ffffff1a;font-size:15px}
  .tilt{left:640px;top:150px;width:1180px;height:740px;transform:perspective(2000px) rotateY(-14deg) rotateX(4deg);transform-origin:left center}
  .float{left:600px;top:330px;transform:rotate(-6deg)}
  .wide{left:80px;top:60px;width:1440px;height:880px}
  .p1{left:260px;top:220px;transform:rotate(-8deg) scale(.92)}.p2{left:650px;top:160px;transform:scale(1.05)}.p3{left:1040px;top:220px;transform:rotate(8deg) scale(.92)}
  .caption{position:absolute;left:0;right:0;bottom:60px;text-align:center;display:flex;flex-direction:column;gap:4px}.caption b{font-size:28px}.caption span{color:#aab3c8}
  .trio .phone{top:100px}.trio .p1,.trio .p3{top:150px}
  </style></head><body>${body}</body></html>`;
}

const browserInst = await chromium.launch({ executablePath: chromePath });
const pg = await browserInst.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
fs.mkdirSync(outDir, { recursive: true });
for (const p of P) {
  for (const v of [1, 2, 3]) {
    const file = path.join(outDir, `mock-${p.key}-${v}.png`);
    if (fs.existsSync(file) && !process.env.FORCE) { console.log('skip existing', file); continue; }
    await pg.setContent(page(p, v), { waitUntil: 'load' });
    await pg.screenshot({ path: file });
    console.log('wrote', file);
  }
}
await browserInst.close();
