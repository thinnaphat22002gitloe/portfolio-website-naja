// Shared UI kit: tiny HTML component helpers used to build static mock apps.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const iconDir = path.join(here, '..', 'node_modules', 'lucide-static', 'icons');

const iconCache = {};
export function ic(name, size = 16, cls = '') {
  if (!iconCache[name]) {
    const f = path.join(iconDir, name + '.svg');
    if (!fs.existsSync(f)) { console.warn('missing icon', name); return ''; }
    let s = fs.readFileSync(f, 'utf8');
    s = s.replace(/<!--.*?-->/s, '').replace(/\s+/g, ' ').trim();
    iconCache[name] = s;
  }
  return iconCache[name].replace('width="24"', `width="${size}"`).replace('height="24"', `height="${size}"`).replace('class="', `class="${cls} `);
}

// seeded random
export function rng(seed = 7) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
export const pick = (r, a) => a[Math.floor(r() * a.length)];
export const thb = (n, d = 0) => '฿' + Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const num = (n) => Number(n).toLocaleString('en-US');

export const TH_FIRST = ['สมชาย', 'สุภาวดี', 'ณัฐพงศ์', 'กมลชนก', 'ธนากร', 'พิมพ์ชนก', 'วรวุฒิ', 'อรอุมา', 'ศุภชัย', 'ปิยะนุช', 'กิตติพัฒน์', 'ชลธิชา', 'อนุชา', 'มณีรัตน์', 'ภาณุวัฒน์', 'จิราพร', 'ธีรเดช', 'ศิริพร', 'ปวีณ์กร', 'นันทวัฒน์'];
export const TH_LAST = ['ใจดี', 'ศรีสุข', 'วงศ์ไทย', 'รุ่งเรือง', 'บุญมา', 'แก้วประเสริฐ', 'ทองดี', 'สายสุวรรณ', 'จันทร์เพ็ญ', 'พรหมมา', 'เกษมสุข', 'อินทร์แก้ว', 'ชัยมงคล', 'ศักดิ์สิทธิ์'];
export const EN_NAMES = ['Siriporn Kaewmanee', 'Anan Phongsri', 'Mali Srisawat', 'Krit Wongsakul', 'Ploy Chaiyaporn', 'Nattapong Rattanakul', 'Kanya Muangthai', 'Thanawat Boonyarit', 'Pimchanok Sukjai', 'Chaiya Fongsamut', 'Warisa Intharawong', 'Tanakorn Limpakul', 'Sarah Lim', 'James Carter', 'Napat Somboon', 'Orawan Detchai'];
export function thName(r) { return pick(r, TH_FIRST) + ' ' + pick(r, TH_LAST); }

const AV = ['#f97316', '#0ea5e9', '#8b5cf6', '#10b981', '#e11d48', '#f59e0b', '#14b8a6', '#6366f1', '#ec4899', '#64748b'];
export function avatar(name, size = 28) {
  const h = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const parts = name.trim().split(/\s+/);
  const ini = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  return `<span class="av" style="width:${size}px;height:${size}px;background:${AV[h % AV.length]};font-size:${Math.round(size * 0.4)}px">${ini}</span>`;
}
export const badge = (t, tone = 'gray', dot = true) => `<span class="bd bd-${tone}">${dot ? '<i></i>' : ''}${t}</span>`;
export const btn = (t, kind = 'sec', icon) => `<button class="btn btn-${kind}">${icon ? ic(icon, 15) : ''}${t ? `<span>${t}</span>` : ''}</button>`;
export const card = (title, body, extra = '', cls = '') => `<section class="card ${cls}">${title ? `<header class="card-h"><h3>${title}</h3><div class="card-x">${extra}</div></header>` : ''}<div class="card-b">${body}</div></section>`;
export function kpi(label, value, delta, up = true, sub = 'vs last month', icon) {
  return `<div class="card kpi"><div class="kpi-l">${icon ? `<span class="kpi-ic">${ic(icon, 16)}</span>` : ''}${label}</div><div class="kpi-v">${value}</div><div class="kpi-d"><span class="${up ? 'up' : 'down'}">${ic(up ? 'trending-up' : 'trending-down', 13)} ${delta}</span> <span class="muted">${sub}</span></div></div>`;
}
export function table(cols, rows, { check = false, cls = '' } = {}) {
  const th = cols.map((c) => { const [t, a] = Array.isArray(c) ? c : [c, '']; return `<th class="${a}">${t}</th>`; }).join('');
  const al = cols.map((c) => (Array.isArray(c) ? c[1] : ''));
  const tr = rows.map((r, i) => `<tr class="${r._sel ? 'sel' : ''}">${check ? `<td class="ck"><span class="cb ${r._sel ? 'on' : ''}">${r._sel ? ic('check', 11) : ''}</span></td>` : ''}${(r.cells || r).map((c, j) => `<td class="${al[j] || ''}">${c}</td>`).join('')}</tr>`).join('');
  return `<div class="tbl-w ${cls}"><table class="tbl"><thead><tr>${check ? '<th class="ck"><span class="cb"></span></th>' : ''}${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
}
export function pager(from, to, total, page = 1, pages = 8) {
  const nums = [1, 2, 3, '…', pages].map((p) => `<span class="pg ${p === page ? 'on' : ''}">${p}</span>`).join('');
  return `<div class="pager"><span class="muted">แสดง ${from}–${to} จาก ${num(total)} รายการ</span><div class="pgs"><span class="pg">${ic('chevron-left', 14)}</span>${nums}<span class="pg">${ic('chevron-right', 14)}</span></div></div>`;
}
export const tabs = (list, active = 0, cls = '') => `<div class="tabs ${cls}">${list.map((t, i) => `<span class="tab ${i === active ? 'on' : ''}">${t}</span>`).join('')}</div>`;
export const field = (label, value, { ph = '', type = 'text', hint = '', icon = '', w = '' } = {}) => `<label class="fld" style="${w ? 'grid-column:span ' + w : ''}"><span class="fl">${label}</span><span class="inp ${value ? '' : 'ph'} ${type === 'select' ? 'sel' : ''}">${icon ? ic(icon, 15) : ''}<span class="iv">${value || ph}</span>${type === 'select' ? ic('chevron-down', 15, 'caret') : ''}</span>${hint ? `<span class="hint">${hint}</span>` : ''}</label>`;
export const area = (label, value, h = 80) => `<label class="fld" style="grid-column:1/-1"><span class="fl">${label}</span><span class="inp ta" style="height:${h}px">${value}</span></label>`;
export const toggle = (on) => `<span class="tg ${on ? 'on' : ''}"><i></i></span>`;
export const progress = (pct, color) => `<span class="prog"><i style="width:${pct}%;${color ? 'background:' + color : ''}"></i></span>`;
export function chart(id, cfg, h = 260) {
  return `<div class="chart" style="height:${h}px"><canvas id="${id}"></canvas></div><script>window.__charts=(window.__charts||[]);window.__charts.push(["${id}",${JSON.stringify(cfg)}]);</script>`;
}
export const toast = (title, msg, tone = 'ok') => `<div class="toast t-${tone}">${ic(tone === 'ok' ? 'circle-check' : tone === 'warn' ? 'triangle-alert' : 'info', 18)}<div><b>${title}</b><div class="muted">${msg}</div></div>${ic('x', 14, 'tx')}</div>`;
export const modal = (title, body, foot, w = 560, sub = '') => `<div class="ovl"><div class="mdl" style="width:${w}px"><header class="mdl-h"><div><h3>${title}</h3>${sub ? `<p class="muted">${sub}</p>` : ''}</div>${ic('x', 18, 'mx')}</header><div class="mdl-b">${body}</div><footer class="mdl-f">${foot}</footer></div></div>`;

export function shell(app, active, content, { title = '', crumbs = [], actions = '', overlay = '', search = 'ค้นหา…' } = {}) {
  const nav = app.nav.map((g) => `${g.group ? `<div class="ng">${g.group}</div>` : ''}${g.items.map(([t, icn, cnt]) => `<a class="ni ${t === active ? 'on' : ''}">${ic(icn, 17)}<span>${t}</span>${cnt ? `<em>${cnt}</em>` : ''}</a>`).join('')}`).join('');
  return page(app, `<div class="app"><aside class="side"><div class="brand"><span class="logo">${app.logo}</span><div><b>${app.name}</b><small>${app.org}</small></div>${ic('chevrons-up-down', 14, 'muted')}</div><nav>${nav}</nav><div class="side-f">${app.sideFoot || ''}<div class="me">${avatar(app.user[0], 32)}<div><b>${app.user[0]}</b><small>${app.user[1]}</small></div>${ic('ellipsis-vertical', 16, 'muted')}</div></div></aside><main class="main"><div class="top"><div class="srch">${ic('search', 15)}<span>${search}</span><kbd>Ctrl K</kbd></div><div class="top-r">${app.topExtra || ''}<span class="ib">${ic('circle-help', 18)}</span><span class="ib dot">${ic('bell', 18)}</span>${avatar(app.user[0], 30)}</div></div><div class="content"><div class="ph-h"><div>${crumbs.length ? `<div class="crumbs">${crumbs.join(` ${ic('chevron-right', 12)} `)}</div>` : ''}<h1>${title}</h1></div><div class="acts">${actions}</div></div>${content}</div></main></div>${overlay}`);
}

export function page(app, body, extraCss = '') {
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>${app.name}</title><style>${BASE_CSS}${app.css || ''}${extraCss}</style><script src="../_shared/chart.umd.js"></script></head><body class="${app.theme || ''}">${body}<script>
Chart.defaults.font.family="Inter, 'Noto Sans Thai', Sarabun, 'Leelawadee UI', sans-serif";Chart.defaults.font.size=11.5;Chart.defaults.animation=false;Chart.defaults.responsive=true;Chart.defaults.maintainAspectRatio=false;
var dark=document.body.classList.contains('dark');Chart.defaults.color=dark?'#94a3b8':'#64748b';Chart.defaults.borderColor=dark?'rgba(148,163,184,.12)':'#eef0f4';Chart.defaults.plugins.legend.labels.boxWidth=8;Chart.defaults.plugins.legend.labels.boxHeight=8;Chart.defaults.plugins.legend.labels.usePointStyle=true;
var F={k:function(v){return Math.abs(v)>=1000?(v/1000)+'k':v},thb:function(v){return '฿'+Number(v).toLocaleString()},pct:function(v){return v+'%'},m:function(v){return '฿'+v+'M'},usd:function(v){return '$'+(v>=1000?(v/1000)+'k':v)},s:function(v){return v+'s'}};function fix(o){if(o&&typeof o=='object'){for(var k in o){if(k=='callback'&&typeof o[k]=='string')o[k]=F[o[k]];else fix(o[k]);}}}
(window.__charts||[]).forEach(function(c){fix(c[1]);new Chart(document.getElementById(c[0]),c[1]);});window.__ready=true;</script></body></html>`;
}

const BASE_CSS = `
*{box-sizing:border-box}html,body{margin:0;height:100%}
body{font-family:Inter,'Noto Sans Thai',Sarabun,'Leelawadee UI',system-ui,sans-serif;font-size:13px;color:var(--tx);background:var(--bg);-webkit-font-smoothing:antialiased;--tx:#0f172a;--mu:#64748b;--bg:#f6f7f9;--pn:#fff;--ln:#e6e8ec;--side:#fff;--hv:#f1f5f9;--ac:#2563eb;--acs:#eff6ff}
body.dark{--tx:#e2e8f0;--mu:#8b98ab;--bg:#0b1120;--pn:#111827;--ln:#1f2a3b;--side:#0d1424;--hv:#172033}
.muted{color:var(--mu)}b{font-weight:600}svg{flex:none;vertical-align:middle}
h1{font-size:22px;margin:2px 0 0;font-weight:650;letter-spacing:-.01em}h3{font-size:14px;margin:0;font-weight:600}
.app{display:flex;height:100vh;overflow:hidden}
.side{width:240px;flex:none;background:var(--side);border-right:1px solid var(--ln);display:flex;flex-direction:column;padding:14px 12px}
.brand{display:flex;align-items:center;gap:10px;padding:4px 6px 16px}.brand b{display:block;font-size:14px}.brand small{color:var(--mu);font-size:11.5px}.brand>div{flex:1}
.logo{width:32px;height:32px;border-radius:8px;background:var(--ac);color:#fff;display:grid;place-items:center}
.ng{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mu);padding:14px 10px 6px;font-weight:600}
.ni{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:7px;color:var(--mu);font-weight:500;margin-bottom:1px}
.ni span{flex:1;color:var(--tx);opacity:.82}.ni em{font-style:normal;font-size:11px;background:var(--hv);color:var(--mu);padding:1px 7px;border-radius:10px;font-weight:600}
.ni.on{background:var(--acs);color:var(--ac)}.ni.on span{color:var(--ac);opacity:1;font-weight:600}.ni.on em{background:var(--ac);color:#fff}
.side-f{margin-top:auto}.me{display:flex;align-items:center;gap:10px;padding:10px 6px 2px;border-top:1px solid var(--ln)}.me div{flex:1;min-width:0}.me b{display:block;font-size:12.5px}.me small{color:var(--mu);font-size:11.5px}
.av{border-radius:50%;color:#fff;display:inline-grid;place-items:center;font-weight:600;flex:none;letter-spacing:.02em}
.main{flex:1;display:flex;flex-direction:column;min-width:0}
.top{height:58px;flex:none;border-bottom:1px solid var(--ln);background:var(--pn);display:flex;align-items:center;justify-content:space-between;padding:0 24px}
.srch{display:flex;align-items:center;gap:8px;width:380px;height:36px;border:1px solid var(--ln);border-radius:8px;padding:0 10px;color:var(--mu);background:var(--bg)}.srch span{flex:1}
kbd{font-family:inherit;font-size:10.5px;border:1px solid var(--ln);border-radius:4px;padding:1px 5px;background:var(--pn)}
.top-r{display:flex;align-items:center;gap:14px;color:var(--mu)}.ib{position:relative;display:grid;place-items:center;width:34px;height:34px;border-radius:8px}.ib.dot:after{content:'';position:absolute;top:7px;right:8px;width:7px;height:7px;border-radius:50%;background:#ef4444;border:2px solid var(--pn)}
.content{flex:1;overflow:hidden;padding:22px 28px}
.ph-h{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:18px}.crumbs{display:flex;gap:6px;align-items:center;color:var(--mu);font-size:12px}.acts{display:flex;gap:8px}
.btn{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 13px;border-radius:8px;font:inherit;font-weight:550;font-size:12.5px;border:1px solid var(--ln);background:var(--pn);color:var(--tx);cursor:pointer;white-space:nowrap}
.btn-pri{background:var(--ac);border-color:var(--ac);color:#fff}.btn-ghost{border-color:transparent;background:transparent;color:var(--mu)}.btn-dan{background:#dc2626;border-color:#dc2626;color:#fff}.btn-sm{height:28px;padding:0 9px;font-size:12px}
.card{background:var(--pn);border:1px solid var(--ln);border-radius:12px;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.card-h{display:flex;justify-content:space-between;align-items:center;padding:14px 18px 0}.card-x{display:flex;gap:8px;align-items:center;color:var(--mu);font-size:12px}.card-b{padding:14px 18px 16px}
.grid{display:grid;gap:16px}.g4{grid-template-columns:repeat(4,1fr)}.g3{grid-template-columns:repeat(3,1fr)}.g2{grid-template-columns:1fr 1fr}.g21{grid-template-columns:2fr 1fr}.g12{grid-template-columns:1fr 2fr}.mt{margin-top:16px}
.kpi{padding:16px 18px}.kpi-l{display:flex;align-items:center;gap:8px;color:var(--mu);font-weight:500}.kpi-ic{width:28px;height:28px;border-radius:7px;background:var(--acs);color:var(--ac);display:grid;place-items:center}
.kpi-v{font-size:25px;font-weight:650;margin:10px 0 6px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.kpi-d{font-size:12px}.up{color:#059669;font-weight:600}.down{color:#dc2626;font-weight:600}
.tbl-w{overflow:hidden}.tbl{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
.tbl th{text-align:left;font-weight:550;color:var(--mu);font-size:12px;padding:9px 12px;background:var(--bg);border-bottom:1px solid var(--ln);white-space:nowrap}
.tbl td{padding:10px 12px;border-bottom:1px solid var(--ln);white-space:nowrap;vertical-align:middle}.tbl tr:last-child td{border-bottom:0}.tbl tr.sel td{background:var(--acs)}
.r{text-align:right!important}.c{text-align:center!important}.ck{width:36px}
.cb{width:16px;height:16px;border:1.5px solid #cbd5e1;border-radius:4px;display:inline-grid;place-items:center;vertical-align:middle}.cb.on{background:var(--ac);border-color:var(--ac);color:#fff}
.cell{display:flex;align-items:center;gap:10px}.cell small{display:block;color:var(--mu);font-size:11.5px}
.bd{display:inline-flex;align-items:center;gap:6px;padding:2px 9px;border-radius:999px;font-size:11.5px;font-weight:550;white-space:nowrap}.bd i{width:6px;height:6px;border-radius:50%;background:currentColor}
.bd-green{background:#ecfdf5;color:#047857}.bd-amber{background:#fffbeb;color:#b45309}.bd-red{background:#fef2f2;color:#b91c1c}.bd-blue{background:#eff6ff;color:#1d4ed8}.bd-gray{background:#f1f5f9;color:#475569}.bd-violet{background:#f5f3ff;color:#6d28d9}.bd-teal{background:#f0fdfa;color:#0f766e}
.dark .bd-green{background:rgba(16,185,129,.12);color:#34d399}.dark .bd-amber{background:rgba(245,158,11,.12);color:#fbbf24}.dark .bd-red{background:rgba(239,68,68,.12);color:#f87171}.dark .bd-blue{background:rgba(59,130,246,.14);color:#60a5fa}.dark .bd-gray{background:rgba(148,163,184,.12);color:#94a3b8}.dark .bd-violet{background:rgba(139,92,246,.14);color:#a78bfa}.dark .bd-teal{background:rgba(20,184,166,.14);color:#2dd4bf}
.pager{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-top:1px solid var(--ln);font-size:12.5px}.pgs{display:flex;gap:4px}.pg{min-width:30px;height:30px;border:1px solid var(--ln);border-radius:7px;display:grid;place-items:center;font-size:12px;color:var(--mu)}.pg.on{background:var(--ac);border-color:var(--ac);color:#fff;font-weight:600}
.tabs{display:flex;gap:2px;border-bottom:1px solid var(--ln)}.tab{padding:10px 14px;color:var(--mu);font-weight:550;border-bottom:2px solid transparent;margin-bottom:-1px}.tab.on{color:var(--ac);border-color:var(--ac)}
.pills{display:inline-flex;background:var(--hv);border-radius:8px;padding:3px;border:0}.pills .tab{border:0;padding:5px 12px;border-radius:6px;margin:0;font-size:12px}.pills .tab.on{background:var(--pn);color:var(--tx);box-shadow:0 1px 2px rgba(0,0,0,.08)}
.fbar{display:flex;gap:8px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--ln)}.fbar .inp{height:34px}
.fld{display:flex;flex-direction:column;gap:6px}.fl{font-weight:550;font-size:12.5px}.hint{font-size:11.5px;color:var(--mu)}
.inp{display:flex;align-items:center;gap:8px;height:38px;border:1px solid #d5dae1;border-radius:8px;padding:0 11px;background:var(--pn);color:var(--tx)}.dark .inp{border-color:#2a3648}.inp.ph{color:#94a3b8}.inp .iv{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.inp svg{color:var(--mu)}
.inp.ta{align-items:flex-start;padding:9px 11px;line-height:1.55;white-space:normal}.inp.focus{border-color:var(--ac);box-shadow:0 0 0 3px var(--acs)}
.form{display:grid;grid-template-columns:1fr 1fr;gap:14px 16px}
.tg{width:34px;height:20px;border-radius:10px;background:#cbd5e1;position:relative;display:inline-block;flex:none}.tg i{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2)}.tg.on{background:var(--ac)}.tg.on i{left:16px}
.prog{display:inline-block;width:100%;height:6px;border-radius:3px;background:var(--hv);overflow:hidden;vertical-align:middle}.prog i{display:block;height:100%;background:var(--ac);border-radius:3px}
.chart{position:relative}
.ovl{position:fixed;inset:0;background:rgba(15,23,42,.45);display:grid;place-items:center;z-index:10}.mdl{background:var(--pn);border-radius:14px;box-shadow:0 24px 60px rgba(15,23,42,.3)}
.mdl-h{display:flex;justify-content:space-between;align-items:flex-start;padding:18px 22px 4px}.mdl-h h3{font-size:16px}.mdl-h p{margin:4px 0 0}.mx{color:var(--mu)}.mdl-b{padding:14px 22px}.mdl-f{display:flex;justify-content:flex-end;gap:8px;padding:14px 22px;border-top:1px solid var(--ln);background:var(--bg);border-radius:0 0 14px 14px}
.toast{position:fixed;right:24px;bottom:24px;z-index:20;display:flex;gap:12px;align-items:flex-start;width:360px;padding:14px 16px;background:var(--pn);border:1px solid var(--ln);border-radius:10px;box-shadow:0 12px 32px rgba(15,23,42,.16)}.toast>div{flex:1}.toast .muted{font-size:12px;margin-top:2px}.t-ok>svg:first-child{color:#059669}.t-warn>svg:first-child{color:#d97706}.tx{color:var(--mu)}
.list-i{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--ln)}.list-i:last-child{border-bottom:0}.list-i .grow{flex:1;min-width:0}.list-i small{display:block;color:var(--mu);font-size:11.5px;margin-top:1px}
.thumb{width:40px;height:40px;border-radius:8px;object-fit:cover;flex:none;background:var(--hv)}
.dl{display:grid;grid-template-columns:130px 1fr;gap:9px 12px;font-size:12.5px}.dl dt{color:var(--mu)}.dl dd{margin:0;font-weight:500}
.sep{height:1px;background:var(--ln);margin:14px 0}
.flush .card-b{padding:10px 0 0}.flush .tbl th:first-child,.flush .tbl td:first-child{padding-left:18px}.flush .tbl th:last-child,.flush .tbl td:last-child{padding-right:18px}
.row{display:flex;align-items:center;gap:8px}.sb{justify-content:space-between}.grow{flex:1}
.tl{position:relative;padding-left:22px}.tl-i{position:relative;padding-bottom:16px}.tl-i:before{content:'';position:absolute;left:-17px;top:4px;width:10px;height:10px;border-radius:50%;background:var(--pn);border:2px solid var(--ac)}.tl-i:after{content:'';position:absolute;left:-12px;top:16px;bottom:-2px;width:1.5px;background:var(--ln)}.tl-i:last-child:after{display:none}.tl-i.off:before{border-color:#cbd5e1}.tl-i small{display:block;color:var(--mu);font-size:11.5px}
/* auth */
.auth{display:grid;grid-template-columns:1fr 1fr;height:100vh}.auth-l{display:flex;flex-direction:column;padding:40px 64px}.auth-f{width:380px;margin:auto}.auth-f h1{font-size:26px}.auth-r{background:var(--acs);display:flex;flex-direction:column;justify-content:center;padding:60px;border-left:1px solid var(--ln)}
/* mobile */
.m{width:390px;height:844px;display:flex;flex-direction:column;background:var(--bg);overflow:hidden}.m-h{padding:14px 18px 10px;display:flex;align-items:center;gap:10px;background:var(--pn);border-bottom:1px solid var(--ln)}.m-h h2{font-size:17px;margin:0;flex:1;font-weight:650}.m-b{flex:1;overflow:hidden;padding:14px 16px}
.m-tab{height:64px;flex:none;background:var(--pn);border-top:1px solid var(--ln);display:flex;justify-content:space-around;align-items:center;padding-bottom:6px}.m-tab span{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10.5px;color:var(--mu);font-weight:500}.m-tab span.on{color:var(--ac)}
`;
