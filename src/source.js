import { encryptJson, decryptJson } from './cryption.js'

// --- Configurable pricing defaults ---
const defaults = {
    currency: 'EUR',
    baseRatePerM2: 1200,       // base build €/m²
    fixedCharge: 6000,
    cladRate: 80,
    bathTypeOneCharge: 2500,
    bathTypeTwoCharge: 4500,
    windowCharge: 500,
    windowRate: 400,
    floor: { none: 0, wooden: 30, tile: 50 },
    switch: 50,
    doubeSocket: 60,
    innerDoorChar: 500,
    innerWallType: { none: 0, inner_wall_type_p: 200, inner_wall_type_s:300 },
    ex_door: { minimal: 600, standard: 1800, panoramic: 3800, 'bi-fold': 5200 },
    floor: { none: 0, wooden: 40, tile: 60},
    deliveryFreeKm: 30,
    deliveryRatePerKm: 2.2,    // €/km beyond free radius
    ex_ESPInstRate: 40,
    ex_renderRate: 120,
    ex_steelDoorCharge: 500,
    vatPct: 0,
    discountPct: 0
};

// --- Helpers ---
const qs = (sel, root = document) => root.querySelector(sel);
const isClientMode = () => new URLSearchParams(location.search).get('mode') === 'client';

const fmtCurrency = (v) => {
    const cur = qs('#currency').value;
    const sym = cur === 'GBP' ? '£' : '€';
    return sym + new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v);
};

function areaM2() {
    const w = parseFloat(qs('#width').value) || 0;
    const d = parseFloat(qs('#depth').value) || 0;
    return Math.max(0, w * d);
}

async function getRate() {
    try {
    const res = await fetch("https://api.exchangerate.host/latest?base=GBP&symbols=EUR");
    const data = await res.json();
    const rate = data.rates.EUR;
    return rate; // <-- return value
    } catch (err) {
    console.error("Error fetching exchange rate:", err);
    return null;
    }
}

function calcWinRow(wEl, hEl) {
    const w = parseFloat(wEl.value) || 0;
    const h = parseFloat(hEl.value) || 0;
    const area = (w > 0 && h > 0) ? (w * h) : 0;
    const price = area > 0 ? (area * defaults.windowRate) + defaults.windowCharge : 0;
    
    return {area, price};
}

function getWinData() {
    const list = qs('#windowsList');
    if (!list) {
        console.warn('#windowsList not found');
        return { winPriceSum: 0, winAreaSum: 0, winCount: 0 };
    }
    let winPriceSum = 0;

    [...list.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        if (!wEl || !hEl) return;

        const { area, price } = calcWinRow(wEl, hEl);

        if (area > 0) {
            winPriceSum += price;
        }       
    });
    
    return winPriceSum;
}

function addWindow(prefill = { width: '', height: '' }) {
    const list = qs('#windowsList');
    const rowTpl = qs('#windowRowTpl');

    const node = rowTpl.content.firstElementChild.cloneNode(true);
    const wEl = qs('[data-field="width"]', node);
    const hEl = qs('[data-field="height"]', node);
    const rmBtn = qs('[data-action="remove"]', node);

    if (prefill.width !== undefined)  wEl.value = prefill.width;
    if (prefill.height !== undefined) hEl.value = prefill.height;

    ['input','change'].forEach(ev => {
        wEl.addEventListener(ev, compute);
        hEl.addEventListener(ev, compute);
    });

    rmBtn.addEventListener('click', () => { node.remove(); });

    list.appendChild(node);
    compute();
}

function compute() {
    const a = areaM2();

    // Fetch config panel value
    const baseRate = parseFloat(qs('#cfg_baseRate').value) || defaults.baseRatePerM2;
    const fixedCharge = parseFloat(qs('#cfg_fixedCharge').value) || defaults.fixedCharge;
    const cladRate = parseFloat(qs('#cfg_cladRate').value) || defaults.cladRate;
    const windowCharge = parseFloat(qs('#cfg_windowCharge').value) || defaults.windowCharge;;
    const windowRate = parseFloat(qs('#cfg_windowRate').value) || defaults.windowRate;
    const freeKm = parseFloat(qs('#cfg_freeKm').value) || defaults.deliveryFreeKm;
    const rateKm = parseFloat(qs('#cfg_ratePerKm').value) || defaults.deliveryRatePerKm;
    const vatPct = parseFloat(qs('#cfg_vat').value) || defaults.vatPct;
    const defaultDiscountPct = parseFloat(qs('#cfg_discount').value) || defaults.discountPct;

    // Fetch Left Inputs
    const cladSize = parseFloat(qs('#cladding').value) || 0;
    const bathTypeOne = qs('#bathroom_1').value || 0;
    const bathTypeTwo = qs('#bathroom_2').value || 0;
    const eSwitch = qs('#switch').value;
    const dSocket = qs('#d_socket').value;
    const innerDoor = qs('#inner_door').value || 0;
    const innerWallType = qs('#inner_wall_type').value;
    const innerWallQuan = qs('#wall_quan').value || 0;
    const exDoor = qs('#ex_door').value;
    const floorType = qs('#floor_type').value;
    const floorSize = qs('#floor_size').value || 0;
    const distance = parseFloat(qs('#distance').value) || 0;
    const EPSInsulation = parseFloat(qs('#ex_EPSInsulation').value) || 0;
    const renderFinish = parseFloat(qs('#ex_renderFinish').value) || 0;
    const steelDoor = qs('#ex_steelDoor').value || 0;

    // Calculation of non extra
    const base = a * baseRate + fixedCharge;
    const cladCost = cladSize * cladRate;
    const bathCost = bathTypeOne * defaults.bathTypeOneCharge + bathTypeTwo * defaults.bathTypeTwoCharge ; // FIX THIS
    const eleCost = eSwitch * defaults.switch + dSocket * defaults.doubeSocket;
    const innerDoorCost = innerDoor * defaults.innerDoorChar;
    const innerWallCost = defaults.innerWallType[innerWallType] * innerWallQuan;
    const windowCost = getWinData();
    const exterDoorCost = defaults.ex_door[exDoor];
    const floorCost = defaults.floor[floorType] * floorSize; //floor type * floor size
    const deliveryExtraKm = Math.max(0, distance - freeKm);;
    const deliverCost = deliveryExtraKm * rateKm;

    // Calculation of extra
    const ex_espCost = EPSInsulation * defaults.ex_ESPInstRate;
    const ex_renderCost = renderFinish * defaults.ex_renderRate;
    const ex_steelDoorCost = steelDoor * defaults.ex_steelDoorCharge;

    // Total Calculation
    let noneExtraSubtotal = base + cladCost + bathCost + eleCost + innerDoorCost + innerWallCost + windowCost + exterDoorCost + floorCost + deliverCost;
    let extraSubtotal  = ex_espCost + ex_renderCost + ex_steelDoorCost;
    let subtotal = noneExtraSubtotal + extraSubtotal;

    const discountPct = parseFloat(qs('#discountPct').value);
    const appliedDiscountPct = isFinite(discountPct) && discountPct >= 0 ? discountPct : defaultDiscountPct;
    const discountAmt = subtotal * (appliedDiscountPct / 100);

    const net = subtotal - discountAmt;
    const vat = vatPct > 0 ? net * (vatPct / 100) : 0;
    const total = net + vat;

    const lines = [
        { label: `Base build (${a.toFixed(2)} m² @ ${fmtCurrency(baseRate)} /m²)`, amount: base },
        { label: `Cladding (${cladSize.toFixed(2)} m²)`, amount: cladCost },
        { label: `Bathrooms`, amount: bathCost },
        { label: `Electrical`, amount: eleCost },
        { label: `Internal doors`, amount: innerDoorCost },
        { label: `Internal walls`, amount: innerWallCost },
        { label: `Windows`, amount: windowCost },
        { label: `External door`, amount: exterDoorCost },
        { label: `Flooring`, amount: floorCost },
        { label: deliveryExtraKm > 0 ? `Delivery (${deliveryExtraKm} km beyond ${freeKm} km)` : 'Delivery (within free radius)', amount: deliverCost },
    ];

    renderSummary({ a, lines, subtotal, discountPct: appliedDiscountPct, discountAmt, net, vatPct, vat, total });
    updateUrlParams();
    persistToLocalStorage();
}

function renderSummary(model) {
    const s = qs('#summary');
    s.innerHTML = '';

    // Safety guard to avoid runtime errors
    const lines = Array.isArray(model.lines) ? model.lines : [];
    const grid = document.createElement('div');
    grid.className = 'divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden';

    lines.forEach(line => {
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between px-4 py-3 bg-white';
        row.innerHTML = `<span class="text-sm">${line.label}</span><span class="font-medium">${fmtCurrency(line.amount || 0)}</span>`;
        grid.appendChild(row);
    });

    const sub = document.createElement('div');
    sub.className = 'flex items-center justify-between px-4 py-3 bg-slate-50';
    sub.innerHTML = `<span class="text-sm">Subtotal</span><span class="font-medium">${fmtCurrency(model.subtotal || 0)}</span>`;

    const disc = document.createElement('div');
    disc.className = 'flex items-center justify-between px-4 py-3 bg-white';
    disc.innerHTML = `<span class="text-sm">Discount (${(model.discountPct ?? 0).toFixed(1)}%)</span><span class="font-medium">- ${fmtCurrency(model.discountAmt || 0)}</span>`;

    const net = document.createElement('div');
    net.className = 'flex items-center justify-between px-4 py-3 bg-slate-50';
    net.innerHTML = `<span class="text-sm">Net</span><span class="font-medium">${fmtCurrency(model.net || 0)}</span>`;

    const vat = document.createElement('div');
    vat.className = 'flex items-center justify-between px-4 py-3 bg-white';
    vat.innerHTML = `<span class="text-sm">VAT (${(model.vatPct ?? 0).toFixed(1)}%)</span><span class="font-medium">${fmtCurrency(model.vat || 0)}</span>`;

    const total = document.createElement('div');
    total.className = 'flex items-center justify-between px-4 py-4 bg-slate-900 text-white';
    total.innerHTML = `<span class="text-base font-semibold tracking-wide">Total (incl. VAT)</span><span class="text-lg font-bold">${fmtCurrency(model.total || 0)}</span>`;

    s.appendChild(grid);
    s.appendChild(sub);
    s.appendChild(disc);
    s.appendChild(net);
    s.appendChild(vat);
    s.appendChild(total);
}

function updateUrlParams() {
    const params = new URLSearchParams();

    // preserve client mode if present
    const current = new URLSearchParams(location.search);
    if (current.get('mode') === 'client') {
        params.set('mode', 'client');
    }

    // Plain inputs (left panel + quote details)
    [
        'width','depth','cladding',
        'bathroom_1','bathroom_2',
        'switch','d_socket',
        'inner_door','inner_wall_type','wall_quan',
        'ex_door',
        'floor_type','floor_size',
        'distance',
        'ex_EPSInsulation','ex_renderFinish','ex_steelDoor',
        'clientName','quoteId','notes',
        'discountPct'
    ].forEach(id => {
        const el = qs('#' + id);
        if (!el) return;
        const val = el.value;
        if (val !== '' && val != null) params.set(id, val);
    });

    // Currency
    params.set('currency', qs('#currency').value);

    // Config (new mapping)
    [
        ['cfg_baseRate','baseRatePerM2'],
        ['cfg_fixedCharge','fixedCharge'],
        ['cfg_cladRate','cladRate'],
        ['cfg_windowCharge','windowCharge'],
        ['cfg_windowRate','windowRate'],
        ['cfg_freeKm','freeKm'],
        ['cfg_ratePerKm','rateKm'],
        ['cfg_vat','vat'],
        ['cfg_discount','disc'],
    ].forEach(([id,key]) => {
        const el = qs('#' + id);
        if (!el) return;
        const v = el.value;
        if (v !== '' && v != null) params.set(key, v);
    });

    // Windows: serialize as "w1x h1,w2x h2,..."
    const list = qs('#windowsList');
    if (list) {
        const parts = [];
        [...list.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        const w = parseFloat(wEl?.value) || 0;
        const h = parseFloat(hEl?.value) || 0;
        if (w > 0 && h > 0) parts.push(`${w}x${h}`);
        });
        if (parts.length) params.set('windows', parts.join(','));
        else params.delete('windows');
    }

    const newUrl = location.pathname + '?' + params.toString();
    history.replaceState(null, '', newUrl);
}

function loadFromUrlParams() {
    const params = new URLSearchParams(location.search);
    if (![...params.keys()].length) return false; // nothing to load

    const setIf = (id, key = id) => {
        if (!params.has(key)) return;

        const el = qs('#' + id);
        if (!el) {
            console.warn('[load:url] missing element for id:', id);
            return;
        }
        el.value = params.get(key);
        // DEBUG
        console.log('[load:url] set', id, '=>', el.value);
    };

    // Plain inputs
    [
        'width','depth','cladding',
        'bathroom_1','bathroom_2',
        'switch','d_socket',
        'inner_door','inner_wall_type','wall_quan',
        'ex_door',
        'floor_type','floor_size',
        'distance',
        'ex_EPSInsulation','ex_renderFinish','ex_steelDoor',
        'clientName','quoteId','notes',
        'discountPct'
    ].forEach(id => setIf(id));

    // Currency
    setIf('currency','currency');

    // Config mapping
    const cfgMap = {
        cfg_baseRate: 'baseRatePerM2',
        cfg_fixedCharge: 'fixedCharge',
        cfg_cladRate: 'cladRate',
        cfg_windowCharge: 'windowCharge',
        cfg_windowRate: 'windowRate',
        cfg_freeKm: 'freeKm',
        cfg_ratePerKm: 'rateKm',
        cfg_vat: 'vat',
        cfg_discount: 'disc',
    };
    Object.entries(cfgMap).forEach(([id,key]) => setIf(id,key));

    // Windows: parse "w1xh1,w2xh2,..."
    if (params.has('windows')) {
        const str = params.get('windows') || '';
        const pairs = str.split(',').map(s => s.trim()).filter(Boolean);

        const list = qs('#windowsList');
        if (!list) {
            console.warn('[load:url] #windowsList not found; windows skipped');
        } else {
            list.innerHTML = ''; // clear existing rows
            pairs.forEach(p => {
                const [wStr, hStr] = p.split('x');
                const w = parseFloat(wStr);
                const h = parseFloat(hStr);
                if (isFinite(w) && isFinite(h) && w > 0 && h > 0) {
                    if (typeof addWindow === 'function') {
                        addWindow({ width: w, height: h }); // your addWindow should attach listeners & call compute()
                    } else {
                        console.warn('[load:url] addWindow() not available yet');
                    }
                }
            });
        }
    }
}

function persistToLocalStorage() {
    const data = {};

    // Plain inputs (left panel + quote details)
    [
        'width','depth','cladding',
        'bathroom_1','bathroom_2',
        'switch','d_socket',
        'inner_door','inner_wall_type','wall_quan',
        'ex_door',
        'floor_type','floor_size',
        'distance',
        'ex_EPSInsulation','ex_renderFinish','ex_steelDoor',
        'clientName','quoteId','notes',
        'discountPct',
        'currency',
        'cfg_baseRate','cfg_fixedCharge','cfg_cladRate',
        'cfg_windowCharge','cfg_windowRate',
        'cfg_freeKm','cfg_ratePerKm','cfg_vat','cfg_discount'
    ].forEach(id => {
        const el = qs('#' + id);
        if (el) data[id] = el.value;
    });

    // Windows array: [ {width: 1.2, height: 1.0}, ... ]
    const list = qs('#windowsList');
    if (list) {
        const arr = [];
        [...list.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        const w = parseFloat(wEl?.value) || 0;
        const h = parseFloat(hEl?.value) || 0;
        if (w > 0 && h > 0) arr.push({ width: w, height: h });
        });
        data.windows = arr;
    }

    localStorage.setItem('gr_calc', JSON.stringify(data));
}

function loadFromLocalStorage() {
    try {
        const data = JSON.parse(localStorage.getItem('gr_calc') || '{}');

        // Plain inputs
        Object.entries(data).forEach(([id, val]) => {
        if (id === 'windows') return; // handled separately
        const el = qs('#' + id);
        if (el && val != null) el.value = val;
        });

        // Windows restore
        if (Array.isArray(data.windows)) {
        const list = qs('#windowsList');
        if (list) list.innerHTML = '';
        data.windows.forEach(win => {
            if (isFinite(win.width) && isFinite(win.height)) {
            addWindow({ width: win.width, height: win.height });
            }
        });
        }
    } catch (err) {
        console.error('Error loading localStorage:', err);
    }
}

// -------------- URL encryption ----------------
function currentParamsToObject() {
  // ensure URL has the latest UI state
  updateUrlParams();
  const params = new URLSearchParams(location.search);
  const obj = {};
  for (const [k, v] of params.entries()) obj[k] = v;
  // force client mode
  obj.mode = 'client';
  return obj;
}

async function copyClientLinkEncrypted() {
  try {
    const state = currentParamsToObject();
    const enc = await encryptJson(state);
    console.log(enc);

    const url = new URL(location.href);
    url.search = '';            // strip public query
    url.hash = '#enc=' + enc;   // put encrypted payload in fragment

    await navigator.clipboard.writeText(url.toString());

    const btn = document.querySelector('#clientLinkBtn');
    if (btn) {
      const old = btn.textContent;
      btn.textContent = 'Encrypted link copied!';
      setTimeout(() => btn.textContent = old, 1200);
    }
  } catch (e) {
    console.error('copyClientLinkEncrypted failed:', e);
    alert('Could not create encrypted link.');
  }
}

function initDefaults() {
    // Inputs sensible defaults
    qs('#width').value = 4;
    qs('#depth').value = 3;
    qs('#currency').value = defaults.currency;
    // Config defaults
    qs('#cfg_baseRate').value = defaults.baseRatePerM2;
    qs('#cfg_cladRate').value = defaults.cladRate;
    qs('#cfg_fixedCharge').value = defaults.fixedCharge;
    qs('#cfg_windowCharge').value = defaults.windowCharge;
    qs('#cfg_windowRate').value = defaults.windowRate;//
    qs('#cfg_freeKm').value = defaults.deliveryFreeKm;
    qs('#cfg_ratePerKm').value = defaults.deliveryRatePerKm;
    qs('#cfg_vat').value = 13.5;
    qs('#cfg_discount').value = defaults.discountPct;
}

function copyLink() {
    updateUrlParams();

    navigator.clipboard.writeText(location.href).then(() => {
    const btn = qs('#shareBtn');
    const old = btn.textContent;
    btn.textContent = 'Link copied!';
    setTimeout(()=>btn.textContent=old, 1200);
    }).catch(()=>{
    alert('Could not copy. Manually copy the URL from the address bar.');
    });
}

function copyClientLink() {
    updateUrlParams();

    const url = new URL(location.href);
    const inParams = new URLSearchParams(url.search);

    // force client mode
    inParams.set('mode', 'client');

    url.search = inParams.toString();

    navigator.clipboard.writeText(url.toString()).then(() => {
    const btn = qs('#clientLinkBtn');
    const old = btn.textContent;
    btn.textContent = 'Client link copied!';
    setTimeout(() => btn.textContent = old, 1200);
    }).catch(() => {
    alert('Could not copy. Manually copy the URL from the address bar.');
    });
}

// Events: User input
['input','change'].forEach(ev => {
    document.body.addEventListener(ev, (e) => {
    const id = e.target?.id;
    if (!id) return;
    compute();
    });
});

// Button wiring
if (qs('#addWindowBtn')) qs('#addWindowBtn').addEventListener('click', () => addWindow());
if (qs('#shareBtn')) qs('#shareBtn').addEventListener('click', copyLink);
//if (qs('#clientLinkBtn')) qs('#clientLinkBtn').addEventListener('click', copyClientLink);
if (qs('#printBtn')) qs('#printBtn').addEventListener('click', ()=>window.print());

function wireEncryptedLinkBtn() {
  const btn = document.querySelector('#clientLinkBtn');
  if (btn) btn.addEventListener('click', copyClientLinkEncrypted);
}

// Boot
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const m = location.hash.match(/[#&]enc=([^&]+)/);
        if (m && m[1]) {
        const payload = decodeURIComponent(m[1]);
        const dec = await decryptJson(payload);      // { ...all  params..., mode:'client' }

        // Swap decrypted params into location.search so existing loaders work unchanged
        const params = new URLSearchParams();
        Object.entries(dec).forEach(([k, v]) => {
            if (v != null && v !== '') params.set(k, String(v));
        });
        history.replaceState(null, '', location.pathname + '?' + params.toString());
        }
    } catch (e) {
        console.error('Decrypt on load failed:', e);
    }

    initDefaults();
    const loadedFromUrl = loadFromUrlParams();
    if (!loadedFromUrl) addWindow();
    loadFromLocalStorage();        
    compute();

    if (isClientMode()) {
        const cfg = document.querySelector('details'); // your config <details>
        if (cfg) cfg.remove();
        
        // remove internal sharebtn in client mode
        const shareBtn = qs('#shareBtn');
        if (shareBtn) shareBtn.style.display = 'none';

        // clean the URL by dropping the fragment
        if (location.hash) {
        history.replaceState(null, '', location.pathname + location.search);
        }
    }

    wireEncryptedLinkBtn();
});

/*window.addEventListener('DOMContentLoaded', () => {
    initDefaults();
    const loadedFromUrl = loadFromUrlParams();
    if (!loadedFromUrl) addWindow();
    loadFromLocalStorage();        
    compute();

    if (isClientMode()) {
        const cfg = document.querySelector('details'); // your config <details>
        if (cfg) cfg.remove();

        const shareBtn = qs('#shareBtn');
        if (shareBtn) shareBtn.style.display = 'none';
    }
});*/