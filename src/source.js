// --- Configurable pricing defaults ---
const defaults = {
    currency: 'EUR',
    /**
     * Pricing Defaults 
     */
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
    ex_EPSInstRate: 40,
    ex_renderRate: 120,
    ex_steelDoorCharge: 500,
    ex_concreteFoundationRate: 200,
    vatPct: 13.5,
    discountPct: 0,

    /** 
     * Cost Defaults 
     */
    osbWidth: 1.22,                         //m
    osbHeight: 2.44,                        //m
    costPerOsb: 18.11,                      //€/board
    wastePercentageOsb: 5,                  //%
    claddingBlockWidth: 2.9,                //m
    claddingBlockHeight: 0.222,             //m
    costPerCladdingBlock: 31.43,            //€/board
    wastePercentageCladdingBlock: 17.24,    //%
    costPerToilet: 104.95,                  //€
    costPerSink: 96,                        //€
    costPerunderSinkHeater: 160,            //€
    costPerShower: 294.95,                  //€
    costPerElecBoiler: 191.17,              //€
    costPerLightSwitch: 1.65,               //€
    costPerDoubleSocket: 3.55,              //€
    plasterboardWidth: 1.22,                //m
    plasterboardHeight: 2.44,               //m    
    costPerPlasterboard: 20.5,              //€/board
    wastePercentagePlasterboard: 5,         //%
    wallPanelWidth: 2.7,                    //m
    wallPanelHeight: 0.25,                  //m
    costPerWallPanel: 77,                   //€/board
    wastePercentageWallPanel: 5,            //%
    costPerWoodFloor: 55,                   //€/m²
    wastePercentageWoodFloor: 5,            //%
    costPerTileFloor: 37.1,                 //€/m²
    wastePercentageTileFloor: 5,            //%
    epsWidth: 0.6,                          //m
    epsHeight: 1.22,                        //m
    costPerEps: 1.82,                       //€/board
    wastePercentageEps: 5,                  //%
    costPerRenderUnit: 20.74,               //€
    coverPerRenderUnit: 0.85,               //m²
    wastePercentageRender: 5,               //%
    costPerConcretFoundation: 233.33,       //€/m²
};

// --- Helpers ---
const qs = (sel, root = document) => root.querySelector(sel);
const isClientMode = () => new URLSearchParams(location.search).get('mode') === 'client';

class CostTableRow {
    /**
     * 
     * @param {string} name 
     * @param {string} label 
     * @param {number} amount 
     * @param {string} unit 
     */
    constructor (name, label, amount, unit){
        this.data = {
            name: name,
            label: label,
            amount: amount,
            unit: unit
        };
    }

    // Helper allow 'row.name' instead of row.data.name'
    /** @returns {string}*/
    get name() {
        return this.data.name;
    }

    /** @returns {string}*/
    get label() {
        return this.data.label;
    }

    /** @returns {number}*/
    get amount() {
        return this.data.amount;
    }

    /** @returns {string}*/
    get unit() {
        return this.data.unit;
    }

    /**
     * 
     * @param {string} columnName 
     * @returns {string|undefined}
     */
    getCell(columnName) {
        if (this.data[columnName] === undefined) {
            console.warn(`Cell with name "${columnName}" not found.`); 
            return null;
        }
        return this.data[columnName];
    }
    
    /**
     * 
     * @param {string} newCellName 
     * @param {*} newCellValue 
     */
    setCell(cellName, cellValue) {
        if (cellName === 'name') {
            console.error("Cannot change unique row ID ('name') via setCell.");
            return;
        }

        this.data[cellName] = cellValue;
    }

    /**
     * 
     * @param {string} name 
     * @param {string} newName 
     */
    changeName(name, newName) {
        this.data[name] = newName;
    }
}

class CostTable {
    constructor(/*dataArray*/) {
        /** @type {CostTableRow []} */
        this.rows = [];
        // Use the insertRow method to populate
        //dataArray.forEach(row => this.setRow(row));
    }

    /**
     * 
     * @param {CostTableRow} row 
     * @returns 
     */
    addRow(row) {
        if (!(row instanceof CostTableRow)) {
            console.error("Invalid input: Must be an instance of CostTableRow.");
            return;
        }
        
        if (this.getRowByName(row.name)) {
            console.warn(`Row with name "${row.name}" already exists. Skipped.`);
            return;
        }
        this.rows.push(row)
    }

    /**
     * Create a row and add the row to table
     * @param {string} name 
     * @param {string} label 
     * @param {number} amount 
     * @param {string} unit 
     * @returns {CostTableRow}
     */
    createRow(name, label, amount, unit) {
        const newRow = new CostTableRow(name, label, amount, unit);
        this.addRow(newRow);
        return newRow;
    }

    /**
     * Find a row by its unique name
     * @param {string} name 
     * @returns {CostTableRow|undefined}
     */
    getRowByName(name) {
        return this.rows.find(row => row.name === name);
    }

    /**
     * 
     * @param {string} name 
     * @param {string} columnName 
     * @returns 
     */
    getCellByName(name, columnName) {
        if (!this.getRowByName(name)) {
            console.warn(`Row with name "${name}" doesn't exists. Skipped.`);
            return;
        }

        if (!this.getRowByName(name).getCell(columnName)) {
            console.warn(`Cell name "${row.name}" not found in row "${this.getRowByName(name)}". Skipped.`);
            return;
        }

        return this.getRowByName(name).getCell(columnName);
    }

    /**
     * 
     * @param {string} name 
     * @param {string} columnName 
     * @param {*} newValue 
     * @returns 
     */
    setCellByName(name, columnName, newValue){
        if (!this.getRowByName(name)) {
            console.warn(`Row with name "${name}" doesn't exists. Skipped.`);
            return;
        }
        this.getRowByName(name).setCell(columnName, newValue);
    }

    /**
     * Removes a row by its unique name
     * @param {string} name 
     */
    removeRow(name) {
        const initialLength = this.rows.length;
        this.rows = this.rows.filter(row => row.name !== name);

        if (this.rows.length === initialLength) {
            console.warn(`Attempted to delet "${name}", but it wasn't found.`);
        }
    }

    computTotal() {
        return this.rows.reduce((total, row) => {
            const val = Number(row.getCell('amount')) || 0;
            return total + val;
        }, 0);
    }
    
    // SELECT *
    getAll() {
        return this.rows;
    }
}

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

    // insure there is only one of ...
    const singletons = new Set(['eps', 'render', 'steelDoor', 'concreteFoundation']);
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

        const areaEl = qs('[data-field="area"]', node);
        const updateLen = () => { areaEl.value = perimeterM2().toFixed(2); compute(); };
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

    if (kind === 'concreteFoundation') {
        const tpl = qs('#tpl-extra-concreteFoundation')
        node = tpl.content.firstElementChild.cloneNode(true);
        node.dataset.kind = 'concreteFoundation';
        const areaEl = qs('[data-field="area"]', node);
        ['input','change'].forEach(ev => areaEl.addEventListener(ev, compute));
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

    return node;
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
                ? (parseFloat(qs('#cfg_extra_epsInsulation').value) || parseFloat(defaults.ex_EPSInstRate))
                : (parseFloat(qs('#cfg_extra_renderFinish').value) || parseFloat(defaults.ex_renderRate));
            const cost = len * rate;
            total += cost;
            lines.push({ label: `${kind === 'eps' ? '100mm EPS insulation' : 'Render finish'} (${len.toFixed(2)} m perimeter)`, amount: cost });
        } else if (kind === 'steelDoor') {
            const qty = qs('[data-field="qty"]', row)?.value || 0;
            const unit = parseFloat(qs('#cfg_extra_steelDoor').value) || parseFloat(defaults.ex_steelDoorCharge);
            const cost = qty * unit;
            total += cost;
            lines.push({ label: `Steel door(s) × ${qty}`, amount: cost });
        } else if (kind === 'concreteFoundation') {
            const area = qs('[data-field="area"]', row)?.value || 0;
            const unit = parseFloat(qs('#cfg_extra_concreteFoundationRate').value) || parseFloat(defaults.ex_concretefoundationRate);
            const cost = area * unit;
            total += cost;
            lines.push({ label: `Concrete Foundation × ${area}m²`, amount: cost });
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
        inner_wall_type_p: inner_wall_type_p, 
        inner_wall_type_s: inner_wall_type_s
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
    renderCostBreakdown();
    projectCostCompute();
    renderProjectCost()
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

/**
 * Calculating what is the cost of a matrial with wast includded * 
 * @param { number } total_area 
 * @param { number } unit_cost 
 * @param { number } waste_percentage  
 * @returns 
 */
function wasteCostCalc(
    total_area, 
    unit_cost,
    waste_percentage ) {

    const norminal_cost = unit_cost/total_area;
    const actual_cost = norminal_cost * (1 + waste_percentage * .01);
    
    return ({norminal_cost, actual_cost});
}

/**
 * 
 * @returns {CostTable}
 */
function calcCostBreakdown() {
    const costBreakDownTable = new CostTable;
    const w = parseFloat(qs('#width').value) || 0;
    const d = parseFloat(qs('#depth').value) || 0;
    const h = parseFloat(qs('#cfg_height').value) || defaults.height;
    const i = parseFloat(qs('#wall_quan').value) || 0;

    const base_area = Math.max(0, w * d);
    costBreakDownTable.createRow("base_area", "Base Area", base_area.toFixed(2), "m²");

    const outer_area = Math.max(0, 2 * h * (w + d));
    costBreakDownTable.createRow("outer_area", "Outer Surface Area", outer_area.toFixed(2), "m²");

    const inner_area = Math.max(0, i * h);
    costBreakDownTable.createRow("inner_area", "Interanl Wall Area", inner_area.toFixed(2), "m²");

    const total_wall_area = outer_area + inner_area;
    costBreakDownTable.createRow("total_wall_area", "Total Surface Area", total_wall_area.toFixed(2), "m²");
    
    // OSB Per m² Calculation
    const osb_width = parseFloat(qs('#cfg_osbWidth').value) || defaults.osbWidth;
    const osb_height = parseFloat(qs('#cfg_osbHeight').value) || defaults.osbWidth;
    const osb_cost = parseFloat(qs('#cfg_costPerOsb').value) || defaults.costPerOsb;
    const osb_waste = parseFloat(qs('#cfg_wastePercentageOsb').value) || defaults.wastePercentageOsb;

    const osb_area = osb_width * osb_height;
    const osbWastCosts = wasteCostCalc(osb_area, osb_cost, osb_waste);
    costBreakDownTable.createRow("osb_norminal_cost", "OSB Norminal Cost", osbWastCosts.norminal_cost.toFixed(2), "€/m²");
    costBreakDownTable.createRow("osb_actual_cost", "OSB Actual Cost", osbWastCosts.actual_cost.toFixed(2), "€/m²");

    // Cladding Per m² Calculation
    const clad_width = parseFloat(qs('#cfg_claddingBlockWidth').value) || defaults.claddingBlockWidth;
    const clad_height = parseFloat(qs('#cfg_claddingBlockHeight').value) || defaults.claddingBlockHeight;
    const clad_cost = parseFloat(qs('#cfg_costPerCladdingBlock').value) || defaults.costPerCladdingBlock;
    const clad_waste = parseFloat(qs('#cfg_wastePercentageCladdingBlock').value) || defaults.wastePercentageCladdingBlock;

    const clad_area = clad_width * clad_height;
    const cladWasteCosts = wasteCostCalc(clad_area, clad_cost, clad_waste);
    costBreakDownTable.createRow("clad_norminal_cost", "Cladding Norminal Cost", cladWasteCosts.norminal_cost.toFixed(2), "€/m²");
    costBreakDownTable.createRow("clad_actual_cost", "Cladding Actual Cost", cladWasteCosts.actual_cost.toFixed(2), "€/m²");

    // Toilet Unit Cost
    const toiletUnitCost = parseFloat(qs('#cfg_costPerToilet').value) || defaults.costPerToilet;
    costBreakDownTable.createRow("toilet_cost", "Toilet Unite Cost", toiletUnitCost.toFixed(2), "€");

    // Sink Unit Cost
    const sinkUnitCost = parseFloat(qs('#cfg_costPerSink').value) || defaults.costPerSink;
    costBreakDownTable.createRow("sink_cost", "Sink Unite Cost", sinkUnitCost.toFixed(2), "€");

    // Undersink Heater Unit Cost
    const ushUnitCost = parseFloat(qs('#cfg_costPerunderSinkHeater').value) || defaults.costPerunderSinkHeater;
    costBreakDownTable.createRow("undersink_heater_cost", "Undersink Heater Unite Cost", ushUnitCost.toFixed(2), "€");

    // Shower Unit Cost
    const showerUnitCost = parseFloat(qs('#cfg_costPerShower').value) || defaults.costPerShower;
    costBreakDownTable.createRow("shower_cost", "Shower Unite Cost", showerUnitCost.toFixed(2), "€");

    // Electric Boiler Unit Cost
    const elecBoilerUnitCost = parseFloat(qs('#cfg_costPerElecBoiler').value) || defaults.costPerElecBoiler;
    costBreakDownTable.createRow("elec_boiler_cost", "Electric Boiler Unite Cost", elecBoilerUnitCost.toFixed(2), "€");

    // Light Switch Unit Cost
    const switchUnitCost = parseFloat(qs('#cfg_costPerLightSwitch').value) || defaults.costPerLightSwitch;
    costBreakDownTable.createRow("switch_cost", "Light Switch Unite Cost", switchUnitCost.toFixed(2), "€");

    // Double Socket Unit Cost
    const dSocketUnitCost = parseFloat(qs('#cfg_costPerDoubleSocket').value) || defaults.costPerDoubleSocket;
    costBreakDownTable.createRow("socket_cost", "Double Socket Unite Cost", dSocketUnitCost.toFixed(2), "€");

    // Plasterboard Per m² Calculation
    const pBoard_width = parseFloat(qs('#cfg_plasterboardWidth').value) || defaults.plasterboardWidth;
    const pBoard_height = parseFloat(qs('#cfg_plasterboardHeight').value) || defaults.plasterboardHeight;
    const pBoard_cost = parseFloat(qs('#cfg_costPerPlasterboard').value) || defaults.costPerPlasterboard;
    const pBoard_waste = parseFloat(qs('#cfg_wastePercentagePlasterboard').value) || defaults.wastePercentagePlasterboard;

    const pBoard_area = pBoard_width * pBoard_height;
    const pBoardWasteCosts = wasteCostCalc(pBoard_area, pBoard_cost, pBoard_waste);
    costBreakDownTable.createRow("plasterboard_norminal_cost", "Plasterboard Norminal Cost", pBoardWasteCosts.norminal_cost.toFixed(2), "€/m²");    
    costBreakDownTable.createRow("plasterboard_actual_cost", "Plasterboard Actual Cost", pBoardWasteCosts.actual_cost.toFixed(2), "€/m²");


    // Wall Panel Per m² Calculation
    const wPanel_width = parseFloat(qs('#cfg_wallPanelWidth').value) || defaults.wallPanelWidth;
    const wPanel_height = parseFloat(qs('#cfg_wallPanelHeight').value) || defaults.wallPanelHeight;
    const wPanel_cost = parseFloat(qs('#cfg_costPerWallPanel').value) || defaults.costPerWallPanel;
    const wPanel_waste = parseFloat(qs('#cfg_wastePercentageWallPanel').value) || defaults.wastePercentageWallPanel;

    const wPanel_area = wPanel_width * wPanel_height;
    const wPanelWasteCosts = wasteCostCalc(wPanel_area, wPanel_cost, wPanel_waste);
    costBreakDownTable.createRow("wall_panel_norminal_cost", "Wall Panel Norminal Cost", wPanelWasteCosts.norminal_cost.toFixed(2), "€/m²");    
    costBreakDownTable.createRow("wall_panel_actual_cost", "Wall Panel Actual Cost", wPanelWasteCosts.actual_cost.toFixed(2), "€/m²");
    

    // Wood Floor Per m² Cost
    const woodFloorNominalCost = parseFloat(qs('#cfg_costPerWoodFloor').value) || defaults.costPerWoodFloor;
    const woodFloor_waste = parseFloat(qs('#cfg_wastePercentageWoodFloor').value) || defaults.wastePercentageWoodFloor;

    const woodFloorActualCost = woodFloorNominalCost * (1 + woodFloor_waste * .01);
    costBreakDownTable.createRow("wood_floor_norminal_cost", "Wood Floor Norminal Cost", woodFloorNominalCost.toFixed(2), "€/m²");    
    costBreakDownTable.createRow("wood_floor_actual_cost", "Wood Floor Actual Cost", woodFloorActualCost.toFixed(2), "€/m²");


    // Tile Floor Per m² Cost
    const tileFloorNominalCost = parseFloat(qs('#cfg_costPerTileFloor').value) || defaults.costPerTileFloor;
    const tileFloor_waste = parseFloat(qs('#cfg_wastePercentageTileFloor').value) || defaults.wastePercentageTileFloor;

    const tileFloorActualCost = tileFloorNominalCost * (1 + tileFloor_waste * .01);
    costBreakDownTable.createRow("tile_floor_norminal_cost", "Tile Floor Norminal Cost", tileFloorNominalCost.toFixed(2), "€/m²");    
    costBreakDownTable.createRow("tile_floor_actual_cost", "Tile Floor Actual Cost", tileFloorActualCost.toFixed(2), "€/m²");

    // EPS Per m² Calculation
    const eps_width = parseFloat(qs('#cfg_epsWidth').value) || defaults.epsWidth;
    const eps_height = parseFloat(qs('#cfg_epsHeight').value) || defaults.epsHeight;
    const eps_cost = parseFloat(qs('#cfg_costPerEps').value) || defaults.costPerEps;
    const eps_waste = parseFloat(qs('#cfg_wastePercentageEps').value) || defaults.wastePercentageEps;

    const eps_area = eps_width * eps_height;
    const epsWasteCosts = wasteCostCalc(eps_area, eps_cost, eps_waste);
    costBreakDownTable.createRow("eps_norminal_cost", "EPS Norminal Cost", epsWasteCosts.norminal_cost.toFixed(2), "€/m²");    
    costBreakDownTable.createRow("eps_actual_cost", "EPS Actual Cost", epsWasteCosts.actual_cost.toFixed(2), "€/m²");

    // Concrete Foundation Per m² Cost
    const costPerConcretFoundation = parseFloat(qs('#cfg_costPerConcretFoundation').value) || defaults.costPerConcretFoundation;
    costBreakDownTable.createRow("founcation_cost", "Concrete Foundation Cost", costPerConcretFoundation.toFixed(2), "€/m²");

    return(costBreakDownTable);
}

/*
const costBreakdownList = [
    { name: "base_area",                    label: "Base Area",                   amount: base_area.toFixed(2),                         unit: "m²" },
    { name: "outer_area",                   label: "Outer Surface Area",          amount: outer_area.toFixed(2),                        unit: "m²" },
    { name: "inner_area",                   label: "Interanl Wall Area",          amount: inner_area.toFixed(2),                        unit: "m²" },
    { name: "total_wall_area",              label: "Total Surface Area",          amount: total_wall_area.toFixed(2),                   unit: "m²" },
    { name: "osb_norminal_cost",            label: "OSB Norminal Cost",           amount: osbWastCosts.norminal_cost.toFixed(2),        unit: "€/m²" },
    { name: "osb_actual_cost",              label: "OSB Actual Cost",             amount: osbWastCosts.actual_cost.toFixed(2),          unit: "€/m²" },
    { name: "clad_norminal_cost",           label: "Cladding Norminal Cost",      amount: cladWasteCosts.norminal_cost.toFixed(2),      unit: "€/m²" },
    { name: "clad_actual_cost",             label: "Cladding Actual Cost",        amount: cladWasteCosts.actual_cost.toFixed(2),        unit: "€/m²" },
    { name: "toilet_cost",                  label: "Toilet Unite Cost",           amount: toiletUnitCost.toFixed(2),                    unit: "€" },
    { name: "sink_cost",                    label: "Sink Unite Cost",             amount: sinkUnitCost.toFixed(2),                      unit: "€" },
    { name: "undersink_heater_cost",        label: "Undersink Heater Unite Cost", amount: ushUnitCost.toFixed(2),                       unit: "€" },
    { name: "shower_cost",                  label: "Shower Unite Cost",           amount: showerUnitCost.toFixed(2),                    unit: "€" },
    { name: "elec_boiler_cost",             label: "Electric Boiler Unite Cost",  amount: elecBoilerUnitCost.toFixed(2),                unit: "€" },
    { name: "switch_cost",                  label: "Light Switch Unite Cost",     amount: switchUnitCost.toFixed(2),                    unit: "€" },
    { name: "socket_cost",                  label: "Double Socket Unite Cost",    amount: dSocketUnitCost.toFixed(2),                   unit: "€" },
    { name: "plasterboard_norminal_cost",   label: "Plasterboard Norminal Cost",  amount: pBoardWasteCosts.norminal_cost.toFixed(2),    unit: "€/m²" },
    { name: "plasterboard_actual_cost",     label: "Plasterboard Actual Cost",    amount: pBoardWasteCosts.actual_cost.toFixed(2),      unit: "€/m²" },
    { name: "wall_panel_norminal_cost",     label: "Wall Panel Norminal Cost",    amount: wPanelWasteCosts.norminal_cost.toFixed(2),    unit: "€/m²" },
    { name: "wall_panel_actual_cost",       label: "Wall Panel Actual Cost",      amount: wPanelWasteCosts.actual_cost.toFixed(2),      unit: "€/m²" },
    { name: "wood_floor_norminal_cost",     label: "Wood Floor Norminal Cost",    amount: woodFloorNominalCost.toFixed(2),              unit: "€/m²" },
    { name: "wood_floor_actual_cost",       label: "Wood Floor Actual Cost",      amount: woodFloorActualCost.toFixed(2),               unit: "€/m²" },
    { name: "tile_floor_norminal_cost",     label: "Tile Floor Norminal Cost",    amount: tileFloorNominalCost.toFixed(2),              unit: "€/m²" },
    { name: "tile_floor_actual_cost",       label: "Tile Floor Actual Cost",      amount: tileFloorActualCost.toFixed(2),               unit: "€/m²" },
    { name: "eps_norminal_cost",            label: "EPS Norminal Cost",           amount: epsWasteCosts.norminal_cost.toFixed(2),       unit: "€/m²" },
    { name: "eps_actual_cost",              label: "EPS Actual Cost",             amount: epsWasteCosts.actual_cost.toFixed(2),         unit: "€/m²" },
    { name: "founcation_cost",              label: "Concrete Foundation Cost",    amount: costPerConcretFoundation.toFixed(2),          unit: "€/m²" },
];
*/

function renderCostBreakdown() {
    /** @type {CostTable []}*/
    const table = calcCostBreakdown();

    const c = qs("#cost_breakdown");
    if (!c) return;
    c.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = "flex flex-wrap gap-4 items-start max-w-full w-full min-w-0";    
    grid.style.flexWrap = "wrap";   // Force wrap explicitly because the utility class might be missing in production CSS

    const itemClass = "rounded-2xl shadow p-4 text-center bg-white";    

    table.getAll().forEach(row => {        
        const container  = document.createElement('div');
        container.className = itemClass;
        container.innerHTML = `
             ${row.label}
             <br/>
             <span class="text-xl font-medium mt-2 block">
                 ${row.amount} ${row.unit}
             </span>
        `;
        grid.appendChild(container);
    });

    c.appendChild(grid);
}

/** @returns { CostTable } */
function projectCostCompute() {
    /** @type {CostTable []}*/
    const table = calcCostBreakdown();

    const projectCostTable = new CostTable;

    // Calculating OSB Cost
    const total_wall_area = table.getCellByName("total_wall_area", "amount");
    const osb_actual_cost = table.getCellByName("osb_actual_cost", "amount");
    const osb_total_Cost = total_wall_area * osb_actual_cost;
    projectCostTable.createRow("osb_total_Cost", "OSB Total Cost", osb_total_Cost.toFixed(2), "€");

    // Calculating Cladding Cost
    const outer_area = table.getCellByName("outer_area", "amount");
    const clad_actual_cost = table.getCellByName("clad_actual_cost", "amount");
    const clad_total_Cost = outer_area * clad_actual_cost;
    projectCostTable.createRow("clad_total_Cost", "Cladding Total Cost", clad_total_Cost.toFixed(2), "€");

    // Calculating Toilet Cost
    const bath1_amt = Number(qs('#bathroom_1').value) || 0;
    const bath2_amt = Number(qs('#bathroom_2').value) || 0;
    const toilet_amt = bath1_amt + bath2_amt;
    const toilet_cost = table.getCellByName("toilet_cost", "amount");
    const toilet_total_cost = toilet_cost * toilet_amt;
    projectCostTable.createRow("toilet_total_cost", "Toilet Total Cost", toilet_total_cost.toFixed(2), "€");

    // Calculating Sink Cost
    const sink_amt = bath1_amt + bath2_amt;
    const sink_cost = table.getCellByName("sink_cost", "amount");
    const sink_total_cost = sink_cost * sink_amt;
    projectCostTable.createRow("sink_total_cost", "Sink Total Cost", sink_total_cost.toFixed(2), "€");

    // Calculating Under Sink Heater Cost
    const undersink_heater_amt = bath1_amt;
    const undersink_heater_cost = table.getCellByName("undersink_heater_cost", "amount");
    const undersink_heater_total_cost = undersink_heater_cost * undersink_heater_amt;
    projectCostTable.createRow("undersink_heater_total_cost", "Under Sink Heater Total Cost", undersink_heater_total_cost.toFixed(2), "€");

    // Calculating Shower Cost
    const shower_amt = bath2_amt;
    const shower_cost = table.getCellByName("shower_cost", "amount");
    const shower_total_cost = shower_cost * shower_amt;
    projectCostTable.createRow("shower_total_cost", "Shower Total Cost", shower_total_cost.toFixed(2), "€");

    // Calculating Electric Boiler Cost
    const elec_boiler_amt = bath2_amt;
    const elec_boiler_cost = table.getCellByName("elec_boiler_cost", "amount");
    const elec_boiler_total_cost = elec_boiler_cost * elec_boiler_amt;
    projectCostTable.createRow("elec_boiler_total_cost", "Electric Boiler Total Cost", elec_boiler_total_cost.toFixed(2), "€");

    // Calculating Light Switch Cost
    const switch_amt = Number(qs('#switch').value) || 0;
    const switch_cost = table.getCellByName("switch_cost", "amount");
    const switch_total_cost = switch_cost * switch_amt;
    projectCostTable.createRow("switch_total_cost", "Light Switch Total Cost", switch_total_cost.toFixed(2), "€");

    // Calculating Double Socket Cost
    const socket_amt = Number(qs('#d_socket').value) || 0;
    const socket_cost = table.getCellByName("socket_cost", "amount");
    const socket_total_cost = socket_cost * socket_amt;
    projectCostTable.createRow("socket_total_cost", "Socket Total Cost", socket_total_cost.toFixed(2), "€");

    // Calculating Plasterboard Cost
    const plasterboard_actual_cost = table.getCellByName("plasterboard_actual_cost", "amount");
    const plasterboard_total_Cost = total_wall_area * plasterboard_actual_cost;
    projectCostTable.createRow("plasterboard_total_Cost", "Plasterboard Total Cost", plasterboard_total_Cost.toFixed(2), "€");

    // Calculating Wall Panel Cost
    if (qs('#inner_wall_type').value === "inner_wall_type_s") {
        const wall_panne_length = table.getCellByName("inner_area", "amount");
        const wall_panel_actual_cost = table.getCellByName("wall_panel_actual_cost", "amount");
        const wall_panel_total_cost = wall_panel_actual_cost * wall_panne_length;
        projectCostTable.createRow("wall_panel_total_cost", "Wall Panel Total Cost", wall_panel_total_cost.toFixed(2), "€");
    }

    
    const floor_type = qs('#floor_type').value;
    if (floor_type === "wooden") {
        // Calculating Wood Floor Cost
        const floor_size = qs('#floor_size').value || 0;
        const wood_floor_actual_cost = table.getCellByName("wood_floor_actual_cost", "amount");
        const wood_floor_total_cost = wood_floor_actual_cost * floor_size;
        projectCostTable.createRow("wood_floor_total_cost", "Wood Floor Total Cost", wood_floor_total_cost.toFixed(2), "€");
    } else if (floor_type === "tile") {
        // Calculating Tile Floor Cost 
        const floor_size = qs('#floor_size').value || 0;
        const tile_floor_actual_cost = table.getCellByName("tile_floor_actual_cost", "amount");
        const tile_floor_total_cost = tile_floor_actual_cost * floor_size;
        projectCostTable.createRow("tile_floor_total_cost", "Tile Floor Total Cost", tile_floor_total_cost.toFixed(2), "€");
    }

    // Calculating Extra Costs
    const list = qs('#extrasList');
    if (!list) { }
    else {
        const lines = [];

        [...list.children].forEach(row => {
            const kind = row.dataset.kind;
           
            if(kind === 'eps') {
                // EPS cost
                const insulation_area = table.getCellByName("outer_area", "amount");
                const eps_actual_cost = table.getCellByName("eps_actual_cost", "amount");
                const eps_total_cost = eps_actual_cost * insulation_area;
                projectCostTable.createRow("eps_total_cost", "EPS Total Cost", eps_total_cost.toFixed(2), "€");
            }
        });
    }

    // Calculating Concrete Foundation Cost
    // projectCostTable.createRow("osb_total_Cost", " Total Cost", osb_total_Cost.toFixed(2), "€");

    
    // console.log(`osb_total_Cost = ${osb_total_Cost}`);
    return projectCostTable;
}

function renderProjectCost() {
    /**@type { CostTable } */
    const table = projectCostCompute();

    const p = qs("#project_cost_summary");
    if(!p) return;
    p.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden';

    const itemClass = 'flex item-center justify-between px-4 py-3 bg-white';

    table.getAll().forEach(row => {
        const container = document.createElement('div');
        container.className = itemClass;
        container.innerHTML = `<span class="text-sm">${row.label}</span><span class="font-medium">${fmtCurrency(row.amount || 0)}</span>`;
        grid.appendChild(container);
    });
    
    totalCost = table.computTotal();
    const total = document.createElement('div');
    total.className = 'flex items-center justify-between px-4 py-4 bg-slate-900 text-white';
    total.innerHTML = `<span class="text-base font-semibold tracking-wide">Total Cost</span><span class="text-lg font-bold">${fmtCurrency(totalCost || 0)}</span>`;

    p.appendChild(grid);
    p.appendChild(total);
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
        'clientName','clientAddress','clientPhone','clientEmail','quoteDate','quoteId','notes',
        'discountPct',
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
        ['cfg_height', 'height'],
        ['cfg_cladRate','cladRate'],
        ['cfg_bathTypeOneCharge','bathTypeOneCharge'],
        ['cfg_bathTypeTwoCharge','bathTypeTwoCharge'],
        ['cfg_switchCharge','switchCharge'],
        ['cfg_socketCharge','socketCharge'],
        ['cfg_internalDoorCharge','internalDoorCharge'],
        ['cfg_innerWallPanel','innerWallPanel'],
        ['cfg_innerWallSnP','innerWallSnP'],
        ['cfg_windowCharge','windowCharge'],
        ['cfg_windowRate','windowRate'],
        ['cfg_EXDoorCharge','exDoorCharge'],
        ['cfg_EXDoorRate','exDoorRate'],
        ['cfg_skylightsCharge','skylightCharge'],
        ['cfg_skylightsRate','skylightRate'],
        ['cfg_floorWooden', 'floorWooden'],
        ['cfg_floorTile', 'floorTile'],
        ['cfg_freeKm','freeKm'],
        ['cfg_ratePerKm','rateKm'],
        ['cfg_vat','vat'],
        ['cfg_discount','disc'],
        ['cfg_extra_epsInsulation', 'extra_epsInsulation'],
        ['cfg_extra_renderFinish', 'extra_renderFinish'],
        ['cfg_extra_steelDoor', 'extra_steelDoor'],
        ['cfg_extra_concreteFoundationRate', 'extra_concreteFoundationRate'],
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

    // EXTRAS: serialize as "eps, render, steelDoor-[qty], [other]-[other cost], ..." (if item exist)
    const extrasList = qs('#extrasList');
    if (extrasList) {
        const lines = [];
        [...extrasList.children].forEach(row => {
            const kind = row.dataset.kind;
            if (kind === 'eps'){
                lines.push('eps');
            } else if (kind === 'render') {
                lines.push('render');
            } else if (kind === 'steelDoor') {
                const qty = qs('[data-field="qty"]', row)?.value || 0;
                lines.push(`steelDoor-${qty}`);
            } else if (kind === 'concreteFoundation') {
                const area = qs('[data-field="area"]', row)?.value || 0;
                lines.push(`concreteFoundation-${area}`);
            } else if (kind === 'other') {
                const name = (qs('[data-field="name"]', row)?.value || 'Other').trim();
                const cost = parseFloat(qs('[data-field="cost"]', row)?.value) || 0;
                const safeName = name.replaceAll(',', ' ');
                lines.push(`${safeName}-${cost}`)
            }
        });
        if(lines.length) params.set('extras', lines.join(','));
        else params.delete("extras")
    } else {
        return {lines: []};
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
        'clientName','clientAddress','clientPhone','clientEmail','quoteDate','quoteId','notes',
        'discountPct'
    ].forEach(id => setIf(id));

    // Currency
    setIf('currency','currency');

    // Config mapping
    const cfgMap = {
        cfg_baseRate: 'baseRatePerM2',
        cfg_fixedCharge: 'fixedCharge',
        cfg_height : 'height',
        cfg_cladRate: 'cladRate',
        cfg_bathTypeOneCharge : 'bathTypeOneCharge',
        cfg_bathTypeTwoCharge : 'bathTypeTwoCharge',
        cfg_switchCharge : 'switchCharge',
        cfg_socketCharge : 'socketCharge',
        cfg_internalDoorCharge : 'internalDoorCharge',
        cfg_innerWallPanel : 'innerWallPanel',
        cfg_innerWallSnP : 'innerWallSnP',
        cfg_windowCharge: 'windowCharge',
        cfg_windowRate: 'windowRate',
        cfg_EXDoorCharge: 'exDoorCharge',
        cfg_EXDoorRate: 'exDoorRate',
        cfg_skylightsCharge: 'skylightCharge',
        cfg_skylightsRate: 'skylightRate',
        cfg_floorWooden : 'floorWooden',
        cfg_floorTile : 'floorTile',
        cfg_freeKm: 'freeKm',
        cfg_ratePerKm: 'rateKm',
        cfg_vat: 'vat',
        cfg_discount: 'disc',
        cfg_extra_epsInsulation : 'extra_epsInsulation',
        cfg_extra_renderFinish : 'extra_renderFinish',
        cfg_extra_steelDoor : 'extra_steelDoor',
        cfg_extra_concreteFoundationRate: 'extra_concreteFoundationRate',
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

    // extras: parse as "eps, render, steelDoor-[qty], [other]-[other cost], ..." (if item exist)
    
    if (params.has('extras')) {
        const tokens = (() => {
            const all = params.getAll('extras');
            if (all.length <= 1) return (params.get('extras') || '').split(',');
            return all;
        })()
            .map(s => s.trim())
            .filter(Boolean);

        const list = qs('#extrasList');
        if (!list) {
            console.warn('[load:url] #extrasList not found; extras skipped');
        } else {
            list.innerHTML = '';

            tokens.forEach(token => {

                // simple toggles
                if (token === 'eps' || token === 'render') {
                    addExtra(token);
                    return;
                }

                // steelDoor-<qty>
                if (token.startsWith('steelDoor-')) {
                    const qty = parseInt(token.slice('steelDoor-'.length), 10);
                    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
                    const row = addExtra('steelDoor');
                    
                    row?.querySelector?.('[data-field="qty"]')?.setAttribute('value', String(safeQty));                                
                    const qtyEl = row?.querySelector?.('[data-field="qty"]');
                    if (qtyEl) { qtyEl.value = String(safeQty); qtyEl.dispatchEvent(new Event('input')); }
                    
                    return;
                }

                // concreteFoundation-<area>
                if (token.startsWith('concreteFoundation-')) {
                    const area = parseInt(token.slice('concreteFoundation-'.length), 10);
                    const safeQty = Number.isFinite(area) && area > 0 ? area : 1;
                    const row = addExtra('concreteFoundation');
                    
                    row?.querySelector?.('[data-field="area"]')?.setAttribute('value', String(safeQty));                                
                    const areaEl = row?.querySelector?.('[data-field="area"]');
                    if (areaEl) { areaEl.value = String(safeQty); areaEl.dispatchEvent(new Event('input')); }
                    
                    return;
                }

                // <name>-<cost> where name may contain '-'
                const lastDash = token.lastIndexOf('-');
                if (lastDash > -1) {
                    const name = token.slice(0, lastDash).trim();
                    const costNum = parseFloat(token.slice(lastDash + 1).trim());
                    const cost = Number.isFinite(costNum) ? costNum : 0;
                    const row = addExtra('other');
                    const nameEl = row?.querySelector?.('[data-field="name"]');
                    const costEl = row?.querySelector?.('[data-field="cost"]');
                    if (nameEl) { nameEl.value = name; nameEl.dispatchEvent(new Event('input')); }
                    if (costEl) { costEl.value = String(cost); costEl.dispatchEvent(new Event('input')); }
                    return;
                }

                // fallback → treat as "other" with 0 cost
                const row = addExtra('other');
                const nameEl = row?.querySelector?.('[data-field="name"]');
                if (nameEl) { nameEl.value = token; nameEl.dispatchEvent(new Event('input')); }
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
    // Config defaults pricing
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
    qs('#cfg_vat').value = defaults.vatPct;
    qs('#cfg_discount').value = defaults.discountPct;
    qs('#cfg_extra_epsInsulation').value = defaults.ex_EPSInstRate;
    qs('#cfg_extra_renderFinish').value = defaults.ex_renderRate;
    qs('#cfg_extra_steelDoor').value = defaults.ex_steelDoorCharge;
    qs('#cfg_extra_concreteFoundationRate').value = defaults.ex_concreteFoundationRate;
    
    //  Config defaults cost
    qs('#cfg_osbWidth').value = defaults.osbWidth;
    qs('#cfg_osbHeight').value = defaults.osbHeight;
    qs('#cfg_costPerOsb').value = defaults.costPerOsb;
    qs('#cfg_wastePercentageOsb').value = defaults.wastePercentageOsb;
    qs('#cfg_claddingBlockWidth').value = defaults.claddingBlockWidth;
    qs('#cfg_claddingBlockHeight').value = defaults.claddingBlockHeight;
    qs('#cfg_costPerCladdingBlock').value = defaults.costPerCladdingBlock;
    qs('#cfg_wastePercentageCladdingBlock').value = defaults.wastePercentageCladdingBlock;
    qs('#cfg_costPerToilet').value = defaults.costPerToilet;
    qs('#cfg_costPerSink').value = defaults.costPerSink;
    qs('#cfg_costPerunderSinkHeater').value = defaults.costPerunderSinkHeater;
    qs('#cfg_costPerShower').value = defaults.costPerShower;
    qs('#cfg_costPerElecBoiler').value = defaults.costPerElecBoiler;
    qs('#cfg_costPerLightSwitch').value = defaults.costPerLightSwitch;
    qs('#cfg_costPerDoubleSocket').value = defaults.costPerDoubleSocket;
    qs('#cfg_plasterboardWidth').value = defaults.plasterboardWidth;
    qs('#cfg_plasterboardHeight').value = defaults.plasterboardHeight;
    qs('#cfg_costPerPlasterboard').value = defaults.costPerPlasterboard;
    qs('#cfg_wastePercentagePlasterboard').value = defaults.wastePercentagePlasterboard;
    qs('#cfg_wallPanelWidth').value = defaults.wallPanelWidth;
    qs('#cfg_wallPanelHeight').value = defaults.wallPanelHeight;
    qs('#cfg_costPerWallPanel').value = defaults.costPerWallPanel;
    qs('#cfg_wastePercentageWallPanel').value = defaults.wastePercentageWallPanel;
    qs('#cfg_costPerWoodFloor').value = defaults.costPerWoodFloor;
    qs('#cfg_wastePercentageWoodFloor').value = defaults.wastePercentageWoodFloor;
    qs('#cfg_costPerTileFloor').value = defaults.costPerTileFloor;
    qs('#cfg_wastePercentageTileFloor').value = defaults.wastePercentageTileFloor;
    qs('#cfg_epsWidth').value = defaults.epsWidth;
    qs('#cfg_epsHeight').value = defaults.epsHeight;
    qs('#cfg_costPerEps').value = defaults.costPerEps;
    qs('#cfg_wastePercentageEps').value = defaults.wastePercentageEps;
    qs('#cfg_coverPerRenderUnit').value = defaults.coverPerRenderUnit;
    qs('#cfg_costPerRenderUnit').value = defaults.costPerRenderUnit;    
    qs('#cfg_wastePercentageRender').value = defaults.wastePercentageRender;
    qs('#cfg_costPerConcretFoundation').value = defaults.costPerConcretFoundation;
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
    const totArea = parseFloat((width+depth)*2*height).toFixed(2)
    qs('#cladding').value = width > 0 && depth > 0 ? (totArea) : 0;
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