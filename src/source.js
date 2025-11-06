// --- Configurable pricing defaults ---
const defaults = {
    currency: 'EUR',
    baseRatePerM2: 1200,       // base build €/m²
    fixedCharge: 6000,
    height: 2.4,
    cladRate: 80,
    bathTypeOneCharge: 2500,
    bathTypeTwoCharge: 4500,
    windowCharge: 500,
    windowRate: 400,
    exDoorCharge: 500,
    exDoorRate: 400,
    skylightCharge: 900,
    skylightRate: 750,
    switch: 50,
    doubleSocket: 60,
    innerDoorChar: 500,
    innerWallType: { none: 0, inner_wall_type_p: 200, inner_wall_type_s:300 },
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

//------------------------------- Start of Window Module ------------------------------------
function calcWinRow(wEl, hEl) {
    const windowCharge = parseFloat(qs('#cfg_windowCharge').value) || defaults.windowCharge;
    const windowRate = parseFloat(qs('#cfg_windowRate').value) || defaults.windowRate;

    const w = parseFloat(wEl.value) || 0;
    const h = parseFloat(hEl.value) || 0;
    const area = (w > 0 && h > 0) ? (w * h) : 0;
    const price = area > 0 ? (area * windowRate) + windowCharge : 0;
    
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

    // Event listener for user input for width and hight box of each window
    ['input','change'].forEach(ev => {
        wEl.addEventListener(ev, compute);
        hEl.addEventListener(ev, compute);
    });

    // Event listener for remove button click
    rmBtn.addEventListener('click', () => { 
        node.remove(); 
        compute();
    });

    list.appendChild(node);
    compute();
}
//------------------------------- End of Window Module ------------------------------------

//------------------------------- Start of Door Module ------------------------------------
function calcEXDoor(wEl, hEl) {
    const windowCharge = parseFloat(qs('#cfg_EXDoorCharge').value) || defaults.exDoorCharge;
    const windowRate = parseFloat(qs('#cfg_EXDoorRate').value) || defaults.exDoorRate;

    const w = parseFloat(wEl.value) || 0;
    const h = parseFloat(hEl.value) || 0;
    const area = (w > 0 && h > 0) ? (w * h) : 0;
    const price = area > 0 ? (area * windowRate) + windowCharge : 0;
    
    return {area, price};
}

function getEXDoorData() {
    const list = qs('#EXDoorsList');
    if (!list) {
        console.warn('#EXDoorsList not found');
        return { exdoorPriceSum: 0, exdoorAreaSum: 0, exdoorCount: 0 };
    }
    let exdoorPriceSum = 0;

    [...list.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        if (!wEl || !hEl) return;

        const { area, price } = calcEXDoor(wEl, hEl);

        if (area > 0) {
            exdoorPriceSum += price;
        }       
    });
    
    return exdoorPriceSum;
}

function addEXDoor(prefill = { width: '', height: '' }) {
    const list = qs('#EXDoorsList');
    const rowTpl = qs('#EXDoorRowTpl');

    const node = rowTpl.content.firstElementChild.cloneNode(true);
    const wEl = qs('[data-field="width"]', node);
    const hEl = qs('[data-field="height"]', node);
    const rmBtn = qs('[data-action="remove"]', node);

    if (prefill.width !== undefined)  wEl.value = prefill.width;
    if (prefill.height !== undefined) hEl.value = prefill.height;

    // Event listener for user input for width and hight box of each door
    ['input','change'].forEach(ev => {
        wEl.addEventListener(ev, compute);
        hEl.addEventListener(ev, compute);
    });

    // Event listener for remove button click
    rmBtn.addEventListener('click', () => { 
        node.remove(); 
        compute();
    });

    list.appendChild(node);
    compute();
}
//------------------------------- End of Door Module ------------------------------------

//------------------------------- Start of Skylight Module ------------------------------------
function calcSkylights(wEl, hEl) {
    const skylightCharge = parseFloat(qs('#cfg_skylightsCharge').value) || defaults.skylightCharge;
    const skylightRate = parseFloat(qs('#cfg_skylightsRate').value) || defaults.skylightRate;

    const w = parseFloat(wEl.value) || 0;
    const h = parseFloat(hEl.value) || 0;
    const area = (w > 0 && h > 0) ? (w * h) : 0;
    const price = area > 0 ? (area * skylightRate) +  skylightCharge: 0;
    
    return {area, price};
}

function getSkylightData() {
    const list = qs('#skylightList');
    if (!list) {
        console.warn('#skylightList not found');
        return { skylightPriceSum: 0, skylightAreaSum: 0, skylightCount: 0 };
    }
    let skylightPriceSum = 0;

    [...list.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        if (!wEl || !hEl) return;

        const { area, price } = calcSkylights(wEl, hEl);

        if (area > 0) {
            skylightPriceSum += price;
        }       
    });
    
    return skylightPriceSum;
}

function addSkylight(prefill = { width: '', height: '' }) {
    const list = qs('#skylightList');
    const rowTpl = qs('#skylightRowTpl');

    const node = rowTpl.content.firstElementChild.cloneNode(true);
    const wEl = qs('[data-field="width"]', node);
    const hEl = qs('[data-field="height"]', node);
    const rmBtn = qs('[data-action="remove"]', node);

    if (prefill.width !== undefined)  wEl.value = prefill.width;
    if (prefill.height !== undefined) hEl.value = prefill.height;

    // Event listener for user input for width and hight box of each door
    ['input','change'].forEach(ev => {
        wEl.addEventListener(ev, compute);
        hEl.addEventListener(ev, compute);
    });

    // Event listener for remove button click
    rmBtn.addEventListener('click', () => { 
        node.remove(); 
        compute();
    });

    list.appendChild(node);
    compute();
}
//------------------------------- End of Skylight Module ------------------------------------

// ------------------------------- Start of Extras Module -------------------------------
// --- helpers
function extraRow(kind) {
  return [...(qs('#extrasList')?.children || [])].find(n => n.dataset.kind === kind) || null;
}
function setOptionDisabled(kind, disabled) {
  const opt = qs(`#extraPicker option[value="${kind}"]`);
  if (opt) opt.disabled = !!disabled;
}
function flashRow(el) {
  if (!el) return;
  el.classList.add('ring-2','ring-sky-400');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => el.classList.remove('ring-2','ring-sky-400'), 900);
}

function perimeterM2() {
    const w = parseFloat(qs('#width').value) || 0;
    const d = parseFloat(qs('#depth').value) || 0;
    const h = parseFloat(qs('#cfg_height').value) || defaults.height;
    return Math.max(0, 2 * h * (w + d));
}

function addExtra(kind) {
  const list = qs('#extrasList');
  if (!list) return;

  // only-one kinds
  const singletons = new Set(['eps', 'render', 'steelDoor']);
  if (singletons.has(kind)) {
    const existing = extraRow(kind);
    if (existing) { flashRow(existing); return; }
  }

  let node = null;

  if (kind === 'eps' || kind === 'render') {
    const tpl = qs('#tpl-extra-perimeter');
    node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.kind = kind;
    qs('[data-label]', node).textContent =
      kind === 'eps' ? '100mm EPS insulation' : 'Render finish';

    const lenEl = qs('[data-field="length"]', node);
    const updateLen = () => { lenEl.value = perimeterM2().toFixed(2); compute(); };
    updateLen();
    ['input','change'].forEach(ev => {
      qs('#width')?.addEventListener(ev, updateLen);
      qs('#depth')?.addEventListener(ev, updateLen);
    });
  }

  if (kind === 'steelDoor') {
    const tpl = qs('#tpl-extra-steel');
    node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.kind = 'steelDoor';
    const qtyEl = qs('[data-field="qty"]', node);
    ['input','change'].forEach(ev => qtyEl.addEventListener(ev, compute));
  }

  if (kind === 'other') {
    const tpl = qs('#tpl-extra-other');
    node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.kind = 'other';
    const nameEl = qs('[data-field="name"]', node);
    const costEl = qs('[data-field="cost"]', node);
    ['input','change'].forEach(ev => {
      nameEl.addEventListener(ev, compute);
      costEl.addEventListener(ev, compute);
    });
  }

  if (!node) return;

  // common remove handler + re-enable option for singletons
  qs('[data-action="remove"]', node).addEventListener('click', () => {
    const k = node.dataset.kind;
    node.remove();
    if (singletons.has(k)) setOptionDisabled(k, false);
    compute();
  });

  list.appendChild(node);
  if (singletons.has(kind)) setOptionDisabled(kind, true);
  compute();
}

function getExtras() {
  const list = qs('#extrasList');
  if (!list) return { cost: 0, lines: [] };

  let total = 0;
  const lines = [];

  [...list.children].forEach(row => {
    const kind = row.dataset.kind;
    if (kind === 'eps' || kind === 'render') {
      const len = perimeterM2(); // locked to perimeter
      const rate = (kind === 'eps')
        ? (parseFloat(qs('#cfg_extra_espInsulation').value) || parseFloat(defaults.ex_ESPInstRate)) //LOCATOR
        : (parseFloat(qs('#cfg_extra_renderFinish').value) || parseFloat(defaults.ex_renderRate)); //LOCATOR
      const cost = len * rate;
      total += cost;
      lines.push({ label: `${kind === 'eps' ? '100mm EPS insulation' : 'Render finish'} (${len.toFixed(2)} m perimeter)`, amount: cost });
    } else if (kind === 'steelDoor') {
      const qty = qs('[data-field="qty"]', row)?.value || 0;
      const unit = parseFloat(qs('#cfg_extra_steelDoor').value) || parseFloat(defaults.ex_steelDoorCharge); //LOCATOR
      const cost = qty * unit;
      total += cost;
      lines.push({ label: `Steel door(s) × ${qty}`, amount: cost });
    } else if (kind === 'other') {
      const name = (qs('[data-field="name"]', row)?.value || 'Other').trim();
      const cost = parseFloat(qs('[data-field="cost"]', row)?.value) || 0;
      total += cost;
      lines.push({ label: name, amount: cost });
    }
  });

  return { cost: total, lines };
}

// Wire the UI controls (once DOM is ready in boot)
function initExtrasUi() {
  const addBtn = qs('#addExtraBtn');
  const picker = qs('#extraPicker');
  if (!addBtn || !picker) return;

  // disable options for singletons already present
  ['eps','render','steelDoor'].forEach(k => {
    if (extraRow(k)) setOptionDisabled(k, true);
  });

  addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const v = picker.value;
    if (!v) return;
    addExtra(v);
    picker.selectedIndex = 0;
  });
}
// ------------------------------- End of Extras Module -------------------------------

function compute() {
    const fmtNum = (n, dp=2) => Number(n).toFixed(dp).replace(/\.00$/, '');
    
    const a = areaM2();

    // Fetch config panel value
    const baseRate = parseFloat(qs('#cfg_baseRate').value) || defaults.baseRatePerM2;
    const fixedCharge = parseFloat(qs('#cfg_fixedCharge').value) || defaults.fixedCharge;
    const cladRate = parseFloat(qs('#cfg_cladRate').value) || defaults.cladRate;
    const bathTypeOneCharge = parseFloat(qs('#cfg_bathTypeOneCharge').value) || defaults.bathTypeOneCharge;
    const bathTypeTwoCharge = parseFloat(qs('#cfg_bathTypeTwoCharge').value) || defaults.bathTypeTwoCharge;
    const switchCharge = parseFloat(qs('#cfg_switchCharge').value) || defaults.switch;
    const doubleSocket = parseFloat(qs('#cfg_socketCharge').value) || defaults.doubleSocket;
    const innerDoorCharge = parseFloat(qs('#cfg_internalDoorCharge').value) || defaults.innerDoorChar;
    
    const none = 0;
    const inner_wall_type_p = parseFloat(qs('#cfg_innerWallPanel').value) || defaults.innerWallType.inner_wall_type_p;
    const inner_wall_type_s = parseFloat(qs('#cfg_innerWallSnP').value) || defaults.innerWallType.inner_wall_type_s;
    const internalWallTypes = {
        none: none, 
        type_p: inner_wall_type_p, 
        type_s: inner_wall_type_s
    };
    const wooden = parseFloat(qs('#cfg_floorWooden').value) || defaults.floor.wooden;
    const tile = parseFloat(qs('#cfg_floorTile').value) || defaults.floor.tile;
    const floorTypes = {
        none: none,
        wooden: wooden,
        tile: tile
    };
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
    const floorType = qs('#floor_type').value;
    const floorSize = qs('#floor_size').value || 0;
    const distance = parseFloat(qs('#distance').value) || 0;
    //const EPSInsulation = parseFloat(qs('#ex_EPSInsulation').value) || 0;
    //const renderFinish = parseFloat(qs('#ex_renderFinish').value) || 0;
    //const steelDoor = qs('#ex_steelDoor').value || 0;

    // Calculation of non extra
    const base = a * baseRate + fixedCharge;
    const cladCost = cladSize * cladRate;
    const bathCost = bathTypeOne * bathTypeOneCharge + bathTypeTwo * bathTypeTwoCharge ;
    const eleCost = eSwitch * switchCharge + dSocket * doubleSocket;
    const innerDoorCost = innerDoor * innerDoorCharge;
    const innerWallCost = internalWallTypes[innerWallType] * innerWallQuan;
    const windowCost = getWinData();
    const exDoorCost = getEXDoorData();
    const skylightCost = getSkylightData();
    const floorCost = floorTypes[floorType] * floorSize;
    const deliveryExtraKm = Math.max(0, distance - freeKm);
    const deliverCost = deliveryExtraKm * rateKm;

    // Calculation of extra
    const { cost: extrasCost, lines: extraLines } = getExtras();
    //const ex_espCost = EPSInsulation * defaults.ex_ESPInstRate;
    //const ex_renderCost = renderFinish * defaults.ex_renderRate;
    //const ex_steelDoorCost = steelDoor * defaults.ex_steelDoorCharge;

    // Total Calculation
    let noneExtraSubtotal = base + cladCost + bathCost + eleCost + innerDoorCost + innerWallCost + windowCost + exDoorCost + skylightCost + floorCost + deliverCost;
    //let extraSubtotal  = 0;//ex_espCost + ex_renderCost + ex_steelDoorCost;
    let subtotal = noneExtraSubtotal + extrasCost;

    const discountPct = parseFloat(qs('#discountPct').value);
    const appliedDiscountPct = isFinite(discountPct) && discountPct >= 0 ? discountPct : defaultDiscountPct;
    const discountAmt = appliedDiscountPct;

    const subnet = subtotal - discountAmt;
    const vat = vatPct > 0 ? subnet * (vatPct / 100) : 0;
    const net = subnet - vat;
    const total = fmtNum(net + vat, 0);

    const lines = [
        { label: `Base build (${a.toFixed(2)} m²)`, amount: base },
        { label: `Cladding (${cladSize.toFixed(2)} m²)`, amount: cladCost },
        { label: `Bathrooms`, amount: bathCost },
        { label: `Electrical`, amount: eleCost },
        { label: `Internal doors`, amount: innerDoorCost },
        { label: `Internal walls`, amount: innerWallCost },
        { label: `Windows`, amount: windowCost },
        { label: `External doors`, amount: exDoorCost },
        { label: `Roof windows`, amount: skylightCost },
        { label: `Flooring`, amount: floorCost },
        { label: deliveryExtraKm > 0 ? `Delivery (${deliveryExtraKm} km beyond ${freeKm} km)` : 'Delivery (within free radius)', amount: deliverCost },
    ];
    extraLines.forEach(l => lines.push(l));

    renderSummary({ a, lines, subtotal, discountPct: appliedDiscountPct, discountAmt, net, vatPct, vat, total });
    const pTotalEl = qs('#p_totalValue');
    if (pTotalEl) {
        pTotalEl.textContent = fmtCurrency(total);
    }
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
    sub.innerHTML = `<span class="text-sm">Total</span><span class="font-medium">${fmtCurrency(model.subtotal || 0)}</span>`;

    const disc = document.createElement('div');
    disc.className = 'flex items-center justify-between px-4 py-3 bg-white';
    disc.innerHTML = `<span class="text-sm">Discount Amount</span><span class="font-medium">- ${fmtCurrency(model.discountAmt || 0)}</span>`;

    const net = document.createElement('div');
    net.className = 'flex items-center justify-between px-4 py-3 bg-slate-50';
    net.innerHTML = `<span class="text-sm">Pre VAT</span><span class="font-medium">${fmtCurrency(model.net || 0)}</span>`;

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
        'floor_type','floor_size',
        'distance',
        'ex_EPSInsulation','ex_renderFinish','ex_steelDoor',
        'clientName','clientAddress','clientPhone','clientEmail','quoteDate','quoteId','notes',
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
        ['cfg_EXDoorCharge','exDoorCharge'],
        ['cfg_EXDoorRate','exDoorRate'],
        ['cfg_skylightsCharge','skylightCharge'],
        ['cfg_skylightsRate','skylightRate'],
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
    const winlist = qs('#windowsList');
    if (winlist) {
        const parts = [];
        [...winlist.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        const w = parseFloat(wEl?.value) || 0;
        const h = parseFloat(hEl?.value) || 0;
        if (w > 0 && h > 0) parts.push(`${w}x${h}`);
        });
        if (parts.length) params.set('windows', parts.join(','));
        else params.delete('windows');
    }

    // door: serialize as "w1x h1,w2x h2,..."
    const exDoorlist = qs('#EXDoorsList');
    if (exDoorlist) {
        const parts = [];
        [...exDoorlist.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        const w = parseFloat(wEl?.value) || 0;
        const h = parseFloat(hEl?.value) || 0;
        if (w > 0 && h > 0) parts.push(`${w}x${h}`);
        });
        if (parts.length) params.set('exDoors', parts.join(','));
        else params.delete('exDoors');
    }

    // skylight: serialize as "w1x h1,w2x h2,..."
    const skylightlist = qs('#skylightList');
    if (skylightlist) {
        const parts = [];
        [...skylightlist.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        const w = parseFloat(wEl?.value) || 0;
        const h = parseFloat(hEl?.value) || 0;
        if (w > 0 && h > 0) parts.push(`${w}x${h}`);
        });
        if (parts.length) params.set('skylights', parts.join(','));
        else params.delete('skylights');
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
        'floor_type','floor_size',
        'distance',
        'ex_EPSInsulation','ex_renderFinish','ex_steelDoor',
        'clientName','clientAddress','clientPhone','clientEmail','quoteDate','quoteId','notes',
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
        cfg_EXDoorCharge: 'exDoorCharge',
        cfg_EXDoorRate: 'exDoorRate',
        cfg_skylightsCharge: 'skylightCharge',
        cfg_skylightsRate: 'skylightRate',
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
                        addWindow({ width: w, height: h });
                    } else {
                        console.warn('[load:url] addWindow() not available yet');
                    }
                }
            });
        }
    }

    // exDoors: parse "w1xh1,w2xh2,..."
    if (params.has('exDoors')) {
        const str = params.get('exDoors') || '';
        const pairs = str.split(',').map(s => s.trim()).filter(Boolean);

        const list = qs('#EXDoorsList');
        if (!list) {
            console.warn('[load:url] #EXDoorsList not found; exDoors skipped');
        } else {
            list.innerHTML = ''; // clear existing rows
            pairs.forEach(p => {
                const [wStr, hStr] = p.split('x');
                const w = parseFloat(wStr);
                const h = parseFloat(hStr);
                if (isFinite(w) && isFinite(h) && w > 0 && h > 0) {
                    if (typeof addEXDoor === 'function') {
                        addEXDoor({ width: w, height: h });
                    } else {
                        console.warn('[load:url] addEXDoor() not available yet');
                    }
                }
            });
        }
    }

    // skylights: parse "w1xh1,w2xh2,..."
    if (params.has('skylights')) {
        const str = params.get('skylights') || '';
        const pairs = str.split(',').map(s => s.trim()).filter(Boolean);

        const list = qs('#skylightList');
        if (!list) {
            console.warn('[load:url] #skylightList not found; skylights skipped');
        } else {
            list.innerHTML = ''; // clear existing rows
            pairs.forEach(p => {
                const [wStr, hStr] = p.split('x');
                const w = parseFloat(wStr);
                const h = parseFloat(hStr);
                if (isFinite(w) && isFinite(h) && w > 0 && h > 0) {
                    if (typeof addSkylight === 'function') {
                        addSkylight({ width: w, height: h });
                    } else {
                        console.warn('[load:url] addSkylight() not available yet');
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
        'floor_type','floor_size',
        'distance',
        'ex_EPSInsulation','ex_renderFinish','ex_steelDoor',
        'clientName','clientAddress','clientPhone','clientEmail','quoteDate','quoteId','notes',
        'discountPct',
        'currency',
        'cfg_baseRate','cfg_fixedCharge','cfg_cladRate',
        'cfg_windowCharge','cfg_windowRate',
        'cfg_EXDoorCharge','cfg_EXDoorRate',
        'cfg_skylightsCharge','cfg_skylightsRate',
        'cfg_freeKm','cfg_ratePerKm','cfg_vat','cfg_discount'
    ].forEach(id => {
        const el = qs('#' + id);
        if (el) data[id] = el.value;
    });

    // Windows array: [ {width: 1.2, height: 1.0}, ... ]
    const winlist = qs('#windowsList');
    if (winlist) {
        const arr = [];
        [...winlist.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        const w = parseFloat(wEl?.value) || 0;
        const h = parseFloat(hEl?.value) || 0;
        if (w > 0 && h > 0) arr.push({ width: w, height: h });
        });
        data.windows = arr;
    }

    // exDoors array: [ {width: 1.2, height: 1.0}, ... ]
    const exDoorlist = qs('#EXDoorsList');
    if (exDoorlist) {
        const arr = [];
        [...exDoorlist.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        const w = parseFloat(wEl?.value) || 0;
        const h = parseFloat(hEl?.value) || 0;
        if (w > 0 && h > 0) arr.push({ width: w, height: h });
        });
        data.exDoors = arr;
    }

    // skylights array: [ {width: 1.2, height: 1.0}, ... ]
    const skylightlist = qs('#skylightList');
    if (skylightlist) {
        const arr = [];
        [...skylightlist.children].forEach(row => {
        const wEl = row.querySelector('[data-field="width"]');
        const hEl = row.querySelector('[data-field="height"]');
        const w = parseFloat(wEl?.value) || 0;
        const h = parseFloat(hEl?.value) || 0;
        if (w > 0 && h > 0) arr.push({ width: w, height: h });
        });
        data.skylights = arr;
    }

    localStorage.setItem('gr_calc', JSON.stringify(data));
}

function loadFromLocalStorage() {
    try {
        const data = JSON.parse(localStorage.getItem('gr_calc') || '{}');

        // Plain inputs
        Object.entries(data).forEach(([id, val]) => {
            if (id === 'windows') return; // handled separately
            if (id === 'exDoors') return; // handled separately
            if (id === 'skylights') return; // handled separately
            const el = qs('#' + id);
            if (el && val != null) el.value = val;
        });

        // Windows restore
        if (Array.isArray(data.windows) && data.windows.length > 0) {
            const winlist = qs('#windowsList');
            if (winlist) winlist.innerHTML = '';
            data.windows.forEach(win => {
                if (isFinite(win.width) && isFinite(win.height)) {
                addWindow({ width: win.width, height: win.height });
                }
            });
        }

        // exdoors restore
        if (Array.isArray(data.exDoors) && data.exDoors.length > 0) {
            const exDoorlist = qs('#EXDoorsList');
            if (exDoorlist) exDoorlist.innerHTML = '';
            data.exDoors.forEach(exdoor => {
                if (isFinite(exdoor.width) && isFinite(exdoor.height)) {
                addEXDoor({ width: exdoor.width, height: exdoor.height });
                }
            });
        }

        // skylights restore
        if (Array.isArray(data.skylights) && data.skylights.length > 0) {
            const skylightlist = qs('#skylightList');
            if (skylightlist) skylightlist.innerHTML = '';
            data.skylights.forEach(skylights => {
                if (isFinite(skylights.width) && isFinite(skylights.height)) {
                addSkylight({ width: skylights.width, height: skylights.height });
                }
            });
        }
    } catch (err) {
        console.error('Error loading localStorage:', err);
    }
}

function buildPrintQuote() {
    // Helpers
    const val = id => (qs('#' + id)?.value ?? '').toString().trim();
    const addLi = (label, value) => {
        if (!value) return;
        const li = document.createElement('li');
        li.innerHTML = `<span class="font-medium">${label}:</span> ${value}`;
        list.appendChild(li);
    };
    const fmtNum = (n, dp=2) => Number(n).toFixed(dp).replace(/\.00$/, '');
    const todayISO = () => new Date().toISOString().slice(0,10);

    // Target list
    const list = qs('#p_lines');
    if (!list) return;
    list.innerHTML = '';

    // Header meta
    qs('#p_clientName').textContent   = val('clientName') || '';
    qs('#p_clientAddress').textContent= val('clientAddress') || '';
    qs('#p_clientPhone').textContent  = val('clientPhone') || '';
    qs('#p_clientEmail').textContent  = val('clientEmail') || '';
    qs('#p_quoteId').textContent      = val('quoteId') || '';
    qs('#p_quoteDate').textContent    = val('quoteDate') || todayISO();

    // Derived sizes
    const width = parseFloat(val('width')) || 0;
    const depth = parseFloat(val('depth')) || 0;
    const roomArea = Math.max(0, width * depth);

    // DESCRIPTION (no prices)
    // 1) Room size / cladding
    if (width > 0 && depth > 0) {
        addLi('Gross floor area', `${fmtNum(width)} m × ${fmtNum(depth)} m (${fmtNum(roomArea)} m²)`);
    }
    const cladding = parseFloat(val('cladding')) || 0;
    if (cladding > 0) addLi('Cladding size', `${fmtNum(cladding)} m²`);

    // 2) Bathrooms
    const b1 = parseFloat(val('bathroom_1')) || 0;
    const b2 = parseFloat(val('bathroom_2')) || 0;
    if (b1 > 0) addLi('Toilet + Sink (qty)', fmtNum(b1, 0));
    if (b2 > 0) addLi('Toilet + Sink + Shower (qty)', fmtNum(b2, 0));

    // 3) Electrics
    const sw = parseFloat(val('switch')) || 0;
    const ds = parseFloat(val('d_socket')) || 0;
    if (sw > 0) addLi('Switches (qty)', fmtNum(sw, 0));
    if (ds > 0) addLi('Double sockets (qty)', fmtNum(ds, 0));

    // 4) Internal doors
    const innerDoor = parseFloat(val('inner_door')) || 0;
    if (innerDoor > 0) addLi('Internal doors (qty)', fmtNum(innerDoor, 0));

    // 5) Internal wall
    const wallType = val('inner_wall_type');
    const wallSize = parseFloat(val('wall_quan')) || 0;
    const wallTypeLabelMap = {
        'none': 'None',
        'inner_wall_type_p': 'Panel wall',
        'inner_wall_type_s': 'Skimmed & painted wall'
    };
    if (wallType && wallType !== 'none' && wallSize > 0) {
        addLi('Internal wall', `${wallTypeLabelMap[wallType] || wallType} — ${fmtNum(wallSize)} m`);
    }

    // 6) Windows (each size)
    const wList = qs('#windowsList');
    if (wList && wList.children.length) {
        const winLines = [];
        [...wList.children].forEach(row => {
        const w = parseFloat(row.querySelector('[data-field="width"]')?.value) || 0;
        const h = parseFloat(row.querySelector('[data-field="height"]')?.value) || 0;
        if (w > 0 && h > 0) winLines.push(`${fmtNum(w)} m × ${fmtNum(h)} m`);
        });
        if (winLines.length) addLi('Windows', winLines.join('; '));
    }

    // 7) External doors (each size)
    const dList = qs('#EXDoorsList');
    if (dList && dList.children.length) {
        const doorLines = [];
        [...dList.children].forEach(row => {
        const w = parseFloat(row.querySelector('[data-field="width"]')?.value) || 0;
        const h = parseFloat(row.querySelector('[data-field="height"]')?.value) || 0;
        if (w > 0 && h > 0) doorLines.push(`${fmtNum(w)} m × ${fmtNum(h)} m`);
        });
        if (doorLines.length) addLi('External doors', doorLines.join('; '));
    }

    // 8) Skylights (each size)
    const sList = qs('#skylightList');
    if (sList && sList.children.length) {
        const skylightLines = [];
        [...sList.children].forEach(row => {
        const w = parseFloat(row.querySelector('[data-field="width"]')?.value) || 0;
        const h = parseFloat(row.querySelector('[data-field="height"]')?.value) || 0;
        if (w > 0 && h > 0) skylightLines.push(`${fmtNum(w)} m × ${fmtNum(h)} m`);
        });
        if (skylightLines.length) addLi('Skylights', skylightLines.join('; '));
    }

    // 9) Floor (type + size)
    const floorType = val('floor_type');
    const floorSize = parseFloat(val('floor_size')) || 0;
    const floorLabel = { none: 'None', wooden: 'Wooden', tile: 'Tile' }[floorType];
    if (floorType && floorType !== 'none' && floorSize > 0) {
        addLi('Floor', `${floorLabel || floorType} — ${fmtNum(floorSize)} m²`);
    }

    // 10) Delivery distance
    const distance = parseFloat(val('distance')) || 0;
    if (distance > 0) addLi('Delivery distance', `${fmtNum(distance, 0)} km`);

    // 11) Extras (NEW: read from #extrasList, not the old hidden fields)
    const xList = qs('#extrasList');
    if (xList && xList.children.length) {
        const xLines = [];
        [...xList.children].forEach(row => {
        const kind = row.dataset.kind || row.getAttribute('data-type'); // fallback
        if (kind === 'eps' || kind === 'render') {
            const label = kind === 'eps' ? '100mm EPS insulation' : 'Render finish';
            const len = parseFloat(row.querySelector('[data-field="length"]')?.value) || 0;
            if (len > 0) xLines.push(`${label} — ${fmtNum(len)} m`);
        } else if (kind === 'steelDoor') {
            const qty = parseFloat(row.querySelector('[data-field="qty"]')?.value) || 0;
            if (qty > 0) xLines.push(`Steel door(s) — ${fmtNum(qty, 0)}`);
        } else if (kind === 'other') {
            const name = (row.querySelector('[data-field="name"]')?.value || 'Other').trim();
            if (name) xLines.push(name);
        }
        });
        if (xLines.length) addLi('Extras', xLines.join('; '));
    }

    const discountAmt = parseFloat(qs('#discountPct').value);
    if (discountAmt > 0) addLi('Discount Amount', fmtNum(discountAmt, 0));

    // Notes
    qs('#p_notes').textContent = val('notes') || '';
}

function initDefaults() {
    // Inputs sensible defaults
    qs('#width').value = 4;
    qs('#depth').value = 3;
    qs('#currency').value = defaults.currency;
    // Config defaults
    qs('#cfg_baseRate').value = defaults.baseRatePerM2;
    qs('#cfg_fixedCharge').value = defaults.fixedCharge;
    qs('#cfg_height').value = defaults.height;
    qs('#cfg_cladRate').value = defaults.cladRate;
    qs('#cfg_bathTypeOneCharge').value = defaults.bathTypeOneCharge;
    qs('#cfg_bathTypeTwoCharge').value = defaults.bathTypeTwoCharge;
    qs('#cfg_switchCharge').value = defaults.switch;
    qs('#cfg_socketCharge').value = defaults.doubleSocket;
    qs('#cfg_internalDoorCharge').value = defaults.innerDoorChar;
    qs('#cfg_windowCharge').value = defaults.windowCharge;
    qs('#cfg_windowRate').value = defaults.windowRate;
    qs('#cfg_EXDoorCharge').value = defaults.exDoorCharge;
    qs('#cfg_EXDoorRate').value = defaults.exDoorRate;
    qs('#cfg_skylightsCharge').value = defaults.skylightCharge;
    qs('#cfg_skylightsRate').value = defaults.skylightRate;    
    qs('#cfg_innerWallPanel').value = defaults.innerWallType.inner_wall_type_p;
    qs('#cfg_innerWallSnP').value = defaults.innerWallType.inner_wall_type_s;
    qs('#cfg_floorWooden').value = defaults.floor.wooden;
    qs('#cfg_floorTile').value = defaults.floor.tile;
    qs('#cfg_freeKm').value = defaults.deliveryFreeKm;
    qs('#cfg_ratePerKm').value = defaults.deliveryRatePerKm;
    qs('#cfg_vat').value = 13.5;
    qs('#cfg_discount').value = defaults.discountPct;
    qs('#cfg_extra_espInsulation').value = defaults.ex_ESPInstRate;
    qs('#cfg_extra_renderFinish').value = defaults.ex_renderRate;
    qs('#cfg_extra_steelDoor').value = defaults.ex_steelDoorCharge;
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

function updateCladSize(){
    const width = parseFloat(qs('#width').value) || 0;
    const depth = parseFloat(qs('#depth').value) || 0;
    const height = parseFloat(qs('#cfg_height').value) || defaults.height;
    qs('#cladding').value = width > 0 && depth > 0 ? ((width+depth)*2*height) : 0;
}

function ensureAtLeastOneWindowRow() {
  const list = qs('#windowsList');
  if (!list) return;
  if (list.children.length === 0) addWindow();
}

function ensureAtLeastOneEXDoorRow() {
  const list = qs('#EXDoorsList');
  if (!list) return;
  if (list.children.length === 0) addEXDoor();
}

function ensureAtLeastOneSkylightRow() {
  const list = qs('#skylightList');
  if (!list) return;
  if (list.children.length === 0) addSkylight();
}

// Events: User input
['input','change'].forEach(ev => {
    document.body.addEventListener(ev, (e) => {
    const id = e.target?.id;
    if (!id) return;
    compute();
    });
});

['width', 'depth'].forEach(element => {
    const el = qs(`#${element}`);
    el?.addEventListener('input', updateCladSize);
    el?.addEventListener('change', updateCladSize);
});


// Button wiring
if (qs('#addWindowBtn')) qs('#addWindowBtn').addEventListener('click', () => addWindow());
if (qs('#addEXDoorBtn')) qs('#addEXDoorBtn').addEventListener('click', () => addEXDoor());
if (qs('#addSkylightBtn')) qs('#addSkylightBtn').addEventListener('click', () => addSkylight());
if (qs('#shareBtn')) qs('#shareBtn').addEventListener('click', copyLink);
if (qs('#clientLinkBtn')) qs('#clientLinkBtn').addEventListener('click', copyClientLink);
if (qs('#printBtn')) qs('#printBtn').addEventListener('click', ()=>{
    buildPrintQuote();
    window.print();
});

// build the print quote just-in-time
window.addEventListener('beforeprint', buildPrintQuote);

// Boot
window.addEventListener('DOMContentLoaded', () => {
    initDefaults();
    initExtrasUi();
    const loadedFromUrl = loadFromUrlParams();
    loadFromLocalStorage(); 
    ensureAtLeastOneWindowRow();
    ensureAtLeastOneEXDoorRow();
    ensureAtLeastOneSkylightRow();           
    compute();    

    if (isClientMode()) {
        const cfg = document.querySelector('details');
        if (cfg) cfg.remove();

        const shareBtn = qs('#shareBtn');
        if (shareBtn) shareBtn.style.display = 'none';
    }
});