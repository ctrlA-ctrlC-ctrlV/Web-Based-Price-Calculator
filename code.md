# index.html
```<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Garden Room Price Calculator</title>
  <link href="dist/output.css" rel="stylesheet">
  <meta name="description" content="A shareable, single-file price calculator for garden rooms. Adjust the config to match your pricing and share the link—no backend required." />
  <style>
    @media print {
      /* hide header/footer and any .no-print stuff */
      header, footer, .no-print { display: none !important; }
      /* keep main, but hide all its children except #printQuote */
      main > *:not(#printQuote) { display: none !important; }
      /* show the quote template */
      #printQuote { display: block !important; }

      /* Page setup */
      @page { size: A4; margin: 16mm; }

      /* Basic typography for print */
      body { color: #0f172a; font-size: 12pt; line-height: 1.35; }

      /* Prevent awkward page breaks */
      .avoid-break { break-inside: avoid; page-break-inside: avoid; }

      /* Quote header look */
      #printQuote .quote-header {
        display: flex; align-items: center; justify-content: space-between;
        padding-bottom: 10mm; border-bottom: 3px solid #0ea5e9;  /* brand accent */
      }
      #printQuote .brand-title {
        font-size: 44pt; font-weight: 700; letter-spacing: -0.5px;
      }
      #printQuote .meta {
        text-align: right; font-size: 10.5pt;
      }
      #printQuote .meta .row { display: flex; gap: 16mm; justify-content: space-between; }
      #printQuote .meta .row span:first-child {
        font-size: 0.875rem;
        font-weight: 700;
        color: #4d79b6;
        letter-spacing: 0.04em;
        margin-bottom: 2mm;
        text-transform: uppercase;
      }
      #printQuote .section-title {
        font-size: 10pt; font-weight: 600; color: #64748b; letter-spacing: 0.04em;
        margin-top: 10mm; margin-bottom: 3mm;
      }
      #printQuote .desc-list li { padding: 2mm 0; border-bottom: 1px solid #e5e7eb; }
      #printQuote .desc-list li:last-child { border-bottom: 0; }

      /* Logo sizing for print clarity */
      #printQuote .logo { max-height: 24mm; width: auto; object-fit: contain; }

      .quote-heading-2 {
        font-size: 0.9rem;
        font-weight: 700;
        color: #4d79b6;
        letter-spacing: 0.04em;
        margin-bottom: 2mm;
        text-transform: uppercase;
      }
    }
    .number-input::-webkit-outer-spin-button,
    .number-input::-webkit-outer-spin-button, .number-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900">
  <div class="max-w-6xl mx-auto p-6">
    <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">Garden Room Price Calculator</h1>
        <p class="text-slate-600"><!-- Single-file, shareable. Adjust inputs and send the link to clients. --></p>
      </div>
      <div class="flex items-center gap-2 no-print">
        <select id="currency" class="px-3 py-2 rounded-xl border border-slate-300 bg-white shadow-sm">
          <option value="EUR">€ EUR</option>
          <option value="GBP">£ GBP</option>
        </select>
        <button id="shareBtn" class="px-4 py-2 rounded-xl bg-slate-900 text-white shadow hover:bg-slate-800">Copy internal link</button>
        <button id="clientLinkBtn" class="px-4 py-2 rounded-xl border border-slate-300 bg-white shadow hover:bg-slate-100">Copy client link</button>
        <button id="printBtn" class="px-4 py-2 rounded-xl border border-slate-300 bg-white shadow hover:bg-slate-100">Print / Save PDF</button>
      </div>
    </header>
    
    <!-- Config panel (edit defaults here) -->
    <details class="mt-4 no-print">
      <summary class="cursor-pointer text-sm text-slate-600">Pricing config (internal, 顾客看不到): tweak default rates</summary>
      <div class="grid md:grid-cols-3 gap-4 mt-3 text-sm">
        <label class="block">Base rate €/m²
          <input type="number" step="1" id="cfg_baseRate" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">fixed charge
          <input type="number" step="1" id="cfg_fixedCharge" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">Cladding Rate
          <input type="number" step="1" id="cfg_cladRate" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">Window Fixed Fee
          <input type="number" step="1" id="cfg_windowCharge" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">Window rate €/m²
          <input type="number" step="1" id="cfg_windowRate" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">External Door Fixed Fee
          <input type="number" step="1" id="cfg_EXDoorCharge" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">External Door €/m²
          <input type="number" step="1" id="cfg_EXDoorRate" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">Skylights Fixed Fee
          <input type="number" step="1" id="cfg_skylightsCharge" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">Skylights €/m²
          <input type="number" step="1" id="cfg_skylightsRate" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">Delivery free radius (km)
          <input type="number" step="1" id="cfg_freeKm" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">Delivery rate €/km beyond
          <input type="number" step="1" id="cfg_ratePerKm" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">VAT %
          <input type="number" step="0.1" id="cfg_vat" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
        <label class="block">Discount Amount (default 0)
          <input type="number" step="0.5" id="cfg_discount" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
        </label>
      </div>
    </details>

    <!-- Left: Inputs -->
    <main class="mt-6 grid md:grid-cols-2 gap-6">      
      <section class="bg-white rounded-2xl shadow p-4 md:p-6">
        <h2 class="text-xl font-semibold mb-4">Project details</h2>
        <div class="grid grid-cols-2 gap-4">
            <label class="block col-span-1">Width (m)
                <input type="number" step="0.1" id="width" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>

            <label class="block col-span-1">Depth (m)
                <input type="number" step="0.1" id="depth" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>

            <label class="block col-span-2">Cladding Size (m²)
                <input type="number" step="0.1" id="cladding" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>

            <!--Bathroom-->
            <section class="col-span-2"> 
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">Bathroom</h3>
            </div>
            <label class="block col-span-2">Toilet+Sink (inc. under sink heater)
                <input type="number" step="0.1" id="bathroom_1" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>

            <label class="block col-span-2">Toilet+Sink+Shower (inc. electric boiler 80L)
                <input type="number" step="0.1" id="bathroom_2" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <p style="margin-bottom: 10px;"></p>

            <!--Electrical-->
            <section class="col-span-2"> 
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">Electrical</h3>
            </div>
            <label class="block col-span-2">Switch (quantity)
                <input type="number" step="0.1" id="switch" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>

            <label class="block col-span-2">Double Socket (quantity)
                <input type="number" step="0.1" id="d_socket" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <p style="margin-bottom: 10px;"></p>

            <!--Internal-->
            <section class="col-span-2">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">Internal</h3>
            </div>
            <label class="block col-span-2">Internal Door (quantity)
                <input type="number" step="0.1" id="inner_door" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            
            <div class="grid grid-cols-2 gap-4 col-span-2">
                <label class="block">
                    Wall Type
                    <select id="inner_wall_type"
                    class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300">
                    <option value="none">None</option>
                    <option value="inner_wall_type_p">Panel Wall</option>
                    <option value="inner_wall_type_s">Skimmed & Painted Wall</option>
                    </select>
                </label>

                <label class="block">
                    Wall Size (m)
                    <input type="number" step="0.1" id="wall_quan"
                    class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
                </label>
            </div>
            <p style="margin-bottom: 20px;"></p>
          
            <!-- Windows Module -->
            <section class="col-span-2">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">Windows</h3>
                <button id="addWindowBtn"
                class="no-print px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                + Add window
                </button>
            </div>

            <div id="windowsList" class="space-y-3"></div>

            <!-- Template for each window row -->
            <template id="windowRowTpl">
            <div class="grid grid-cols-12 gap-3 p-3 bg-white rounded-2xl border border-slate-200">
                <div class="col-span-5">
                <label class="text-sm font-medium">Width (m)
                    <input type="number" step="0.01" min="0"
                        class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
                        data-field="width" placeholder="e.g. 1.20" />
                </label>
                </div>
                <div class="col-span-5">
                <label class="text-sm font-medium">Height (m)
                    <input type="number" step="0.01" min="0"
                        class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
                        data-field="height" placeholder="e.g. 1.00" />
                </label>
                </div>
                <div class="col-span-2 flex items-end">
                <button class="no-print w-full px-3 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50"
                        data-action="remove">Del</button>
                </div>
            </div>
            </template>
            <p style="margin-bottom: 2px;"></p>
          
            <!-- Door Module -->
            <section class="col-span-2">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">External Door</h3>
                <button id="addEXDoorBtn"
                class="no-print px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                + Add door
                </button>
            </div>

            <div id="EXDoorsList" class="space-y-3"></div>

            <!-- Template for each door row -->
            <template id="EXDoorRowTpl">
            <div class="grid grid-cols-12 gap-3 p-3 bg-white rounded-2xl border border-slate-200">
                <div class="col-span-5">
                <label class="text-sm font-medium">Width (m)
                    <input type="number" step="0.01" min="0"
                        class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
                        data-field="width" placeholder="e.g. 1.20" />
                </label>
                </div>
                <div class="col-span-5">
                <label class="text-sm font-medium">Height (m)
                    <input type="number" step="0.01" min="0"
                        class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
                        data-field="height" placeholder="e.g. 1.00" />
                </label>
                </div>
                <div class="col-span-2 flex items-end">
                <button class="no-print w-full px-3 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50"
                        data-action="remove">Del</button>
                </div>
            </div>
            </template>
            <p style="margin-bottom: 2px;"></p>

            <!-- Skylight Module -->
            <section class="col-span-2">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">Roof Windows</h3>
                <button id="addSkylightBtn"
                class="no-print px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                + Add Roof Window
                </button>
            </div>

            <div id="skylightList" class="space-y-3"></div>

            <!-- Template for each door row -->
            <template id="skylightRowTpl">
            <div class="grid grid-cols-12 gap-3 p-3 bg-white rounded-2xl border border-slate-200">
                <div class="col-span-5">
                <label class="text-sm font-medium">Width (m)
                    <input type="number" step="0.01" min="0"
                        class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
                        data-field="width" placeholder="e.g. 1.20" />
                </label>
                </div>
                <div class="col-span-5">
                <label class="text-sm font-medium">Height (m)
                    <input type="number" step="0.01" min="0"
                        class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
                        data-field="height" placeholder="e.g. 1.00" />
                </label>
                </div>
                <div class="col-span-2 flex items-end">
                <button class="no-print w-full px-3 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50"
                        data-action="remove">Del</button>
                </div>
            </div>
            </template>
            <p style="margin-bottom: 2px;"></p>

            <!--Floor-->
            <section class="col-span-2"> 
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">Floor</h3>
            </div>
            <div class="grid grid-cols-2 gap-4 col-span-2">
                <label class="block">
                    Floor Type
                    <select id="floor_type"
                    class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300">
                    <option value="none">None</option>
                    <option value="wooden">Wooden</option>
                    <option value="tile">Tile</option>
                    </select>
                </label>

                <label class="block">
                    Floor Size
                    <input type="number" step="0.1" id="floor_size"
                    class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
                </label>
            </div>
            <p style="margin-bottom: 10px;"></p>

            <!--Delivery-->
            <section class="col-span-2"> 
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">Delivery</h3>
            </div>
            <label class="block col-span-2">Delivery distance from base (km)
                <input type="number" step="1" id="distance" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <p style="margin-bottom: 10px;"></p>

            <!--Extras-->
            <section class="col-span-2"> 
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">Extras</h3>
            </div>
            <label class="block col-span-2">100mm EPS insulation sqm
                <input type="number" step="1" id="ex_EPSInsulation" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <label class="block col-span-2">Render finish sqm
                <input type="number" step="1" id="ex_renderFinish" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <label class="block col-span-2">Extra steel door
                <input type="number" step="1" id="ex_steelDoor" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
        </div>
      </section>

      <!-- Right: Summary -->
      <section class="bg-white rounded-2xl shadow p-4 md:p-6">
        <h2 class="text-xl font-semibold mb-4">Estimate</h2>
        <div id="summary" class="space-y-3"></div>
        <div class="mt-6 grid md:grid-cols-2 gap-3">
          <div class="bg-slate-50 rounded-xl p-4">
            <p class="text-sm text-slate-600">Notes (shows on print/share)</p>
            <textarea id="notes" rows="5" class="w-full mt-2 px-3 py-2 rounded-xl border border-slate-300" placeholder="Lead time, inclusions/exclusions, planning notes…"></textarea>
          </div>
          <div class="bg-slate-50 rounded-xl p-4">
            <p class="text-sm text-slate-600">Quote details</p>
            <label class="block mt-2 text-sm">Client name
              <input id="clientName" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <label class="block mt-2 text-sm">Address & Eircode
              <textarea id="clientAddress"
                rows="2"
                class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"></textarea>
            </label>
            <label class="block mt-2 text-sm">Phone
              <input id="clientPhone" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <label class="block mt-2 text-sm">Email
              <input id="clientEmail" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <label class="block mt-2 text-sm">Quote date
              <input type="date" id="quoteDate" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <label class="block mt-2 text-sm">Quote ID
              <input id="quoteId" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
            <label class="block mt-2 text-sm">Discount Amount (optional)
              <input type="number" step="0.5" id="discountPct" class="number-input mt-1 w-full px-3 py-2 rounded-xl border border-slate-300" />
            </label>
          </div>
        </div>
      </section>

      <!-- Print only template -->
      <section id="printQuote" class="print-block hidden">
        <div class="mt-14">
          <!-- Header: title + logo -->
          <div class="quote-header">
            <div class="brand-left">
              <div class="brand-title">QUOTE</div>
            </div>
            <div class="brand-right">
              <img src="./assets/sdeal-logo.png" alt="SDeal Construction" class="logo" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6 mt-8 avoid-break">
            <div>
              <div class="quote-heading-2">BILL TO</div>
              <div class="mt-2 leading-relaxed">
                <div id="p_clientName"></div>
                <div id="p_clientAddress"></div>
                <div id="p_clientPhone"></div>
                <div id="p_clientEmail"></div>
              </div>
            </div>
            <div class="meta">
              <div class="space-y-1 inline-block text-left">
                <div class="row"><span>QUOTE #</span><span id="p_quoteId" class="font-medium"></span></div>
                <div class="row"><span>QUOTE DATE</span><span id="p_quoteDate" class="font-medium"></span></div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <h3 class="section-title">DESCRIPTION</h3>
          <ul id="p_lines" class="desc-list text-[13px] leading-relaxed"></ul>

          <!-- Total -->
          <div id="p_total" class="mt-8 flex justify-between items-center font-bold text-lg border-t-2 border-slate-300 pt-4">
            <span class="quote-heading uppercase">TOTAL</span>
            <span id="p_totalValue"></span>
          </div>

          <!-- Notes -->
          <h3 class="section-title">ADDITIONAL NOTES</h3>
          <p id="p_notes" class="mt-1 whitespace-pre-wrap"></p>
        </div>
      </section>
    </main>

    <footer class="mt-8 text-center text-xs text-slate-500">
      <p class="print-block hidden">Generated by the Garden Room Price Calculator</p>
      <p class="no-print">© 2025 SDeal • Created by Zhaoxiang Qiu</p>
    </footer>
  </div>
</body>
<script src="./src/source.js"></script>
</html>```

# source.js
```// --- Configurable pricing defaults ---
const defaults = {
    currency: 'EUR',
    baseRatePerM2: 1200,       // base build €/m²
    fixedCharge: 6000,
    cladRate: 80,
    bathTypeOneCharge: 2500,
    bathTypeTwoCharge: 4500,
    windowCharge: 500,
    windowRate: 400,
    exDoorCharge: 500,
    exDoorRate: 400,
    skylightCharge: 900,
    skylightRate: 750,
    floor: { none: 0, wooden: 30, tile: 50 },
    switch: 50,
    doubeSocket: 60,
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
    const price = area > 0 ? (area * skylightCharge) + skylightRate : 0;
    
    return {area, price};
}

function getSkylightData() {
    const list = qs('#SkylightList');
    if (!list) {
        console.warn('#SkylightList not found');
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

function compute() {
    const a = areaM2();

    // Fetch config panel value
    const baseRate = parseFloat(qs('#cfg_baseRate').value) || defaults.baseRatePerM2;
    const fixedCharge = parseFloat(qs('#cfg_fixedCharge').value) || defaults.fixedCharge;
    const cladRate = parseFloat(qs('#cfg_cladRate').value) || defaults.cladRate;
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
    const exDoorCost = getEXDoorData();
    const skylightCost = getSkylightData();
    const floorCost = defaults.floor[floorType] * floorSize; //floor type * floor size
    const deliveryExtraKm = Math.max(0, distance - freeKm);;
    const deliverCost = deliveryExtraKm * rateKm;

    // Calculation of extra
    const ex_espCost = EPSInsulation * defaults.ex_ESPInstRate;
    const ex_renderCost = renderFinish * defaults.ex_renderRate;
    const ex_steelDoorCost = steelDoor * defaults.ex_steelDoorCharge;

    // Total Calculation
    let noneExtraSubtotal = base + cladCost + bathCost + eleCost + innerDoorCost + innerWallCost + windowCost + exDoorCost + skylightCost + floorCost + deliverCost;
    let extraSubtotal  = ex_espCost + ex_renderCost + ex_steelDoorCost;
    let subtotal = noneExtraSubtotal + extraSubtotal;

    const discountPct = parseFloat(qs('#discountPct').value);
    const appliedDiscountPct = isFinite(discountPct) && discountPct >= 0 ? discountPct : defaultDiscountPct;
    const discountAmt = appliedDiscountPct;

    const net = subtotal - discountAmt;
    const vat = vatPct > 0 ? net * (vatPct / 100) : 0;
    const total = net + vat;

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
    sub.innerHTML = `<span class="text-sm">Subtotal</span><span class="font-medium">${fmtCurrency(model.subtotal || 0)}</span>`;

    const disc = document.createElement('div');
    disc.className = 'flex items-center justify-between px-4 py-3 bg-white';
    disc.innerHTML = `<span class="text-sm">Discount Amount</span><span class="font-medium">- ${fmtCurrency(model.discountAmt || 0)}</span>`;

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
            if (id === 'exdoors') return; // handled separately
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

    // Targets
    const list = qs('#p_lines');
    if (!list) return;
    list.innerHTML = '';

    // Top panel
    qs('#p_clientName').textContent = val('clientName') || '';
    qs('#p_clientAddress').textContent = val('clientAddress') || '';
    qs('#p_clientPhone').textContent = val('clientPhone') || '';
    qs('#p_clientEmail').textContent = val('clientEmail') || '';
    qs('#p_quoteId').textContent = val('quoteId') || '';
    qs('#p_quoteDate').textContent = val('quoteDate') || todayISO();

    // Derived sizes
    const width = parseFloat(val('width')) || 0;
    const depth = parseFloat(val('depth')) || 0;
    const roomArea = Math.max(0, width * depth);

    // DESCRIPTION LINES (no prices)

    // Room size
    if (width > 0 && depth > 0) {
        addLi('Gross floor area', `${fmtNum(width)} m × ${fmtNum(depth)} m  (${fmtNum(roomArea)} m²)`);
    }

    // Cladding size
    const cladding = parseFloat(val('cladding')) || 0;
    if (cladding > 0) addLi('Cladding size', `${fmtNum(cladding)} m²`);

    // Bathrooms (amounts only)
    const b1 = parseFloat(val('bathroom_1')) || 0;
    const b2 = parseFloat(val('bathroom_2')) || 0;
    if (b1 > 0) addLi('Toilet + Sink (qty)', fmtNum(b1,0));
    if (b2 > 0) addLi('Toilet + Sink + Shower (qty)', fmtNum(b2,0));

    // Electrical
    const sw = parseFloat(val('switch')) || 0;
    const ds = parseFloat(val('d_socket')) || 0;
    if (sw > 0) addLi('Switches (qty)', fmtNum(sw,0));
    if (ds > 0) addLi('Double sockets (qty)', fmtNum(ds,0));

    // Internal doors
    const innerDoor = parseFloat(val('inner_door')) || 0;
    if (innerDoor > 0) addLi('Internal doors (qty)', fmtNum(innerDoor,0));

    // Internal wall
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

    // Windows: each size (no price)
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

    // Exterior doors: each size (no price) — optional list if you’re using it
    const dList = qs('#EXDoorsList');
    if (dList && dList.children.length) {
        const doorLines = [];
        [...dList.children].forEach(row => {
        const w = parseFloat(row.querySelector('[data-field="width"]')?.value) || 0;
        const h = parseFloat(row.querySelector('[data-field="height"]')?.value) || 0;
        if (w > 0 && h > 0) doorLines.push(`${fmtNum(w)} m × ${fmtNum(h)} m`);
        });
        if (doorLines.length) addLi('Exterior doors', doorLines.join('; '));
    }

    // Exterior doors: each size (no price) — optional list if you’re using it
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

    // Floor (no price) – size only if provided
    const floorType = val('floor_type');
    const floorSize = parseFloat(val('floor_size')) || 0;
    const floorLabel = { none: 'None', wooden: 'Wooden', tile: 'Tile' }[floorType];
    if (floorSize > 0 && floorType && floorType !== 'none') {
        addLi('Floor', `${floorLabel || floorType} — ${fmtNum(floorSize)} m²`);
    }

    // Delivery distance (this is a detail — include if you want it in the doc)
    const distance = parseFloat(val('distance')) || 0;
    if (distance > 0) addLi('Delivery distance', `${fmtNum(distance,0)} km`);

    // Extras (no price)
    const eps = parseFloat(val('ex_EPSInsulation')) || 0;
    if (eps > 0) addLi('100mm EPS insulation', `${fmtNum(eps,0)} m²`);
    const render = parseFloat(val('ex_renderFinish')) || 0;
    if (render > 0) addLi('Render finish', `${fmtNum(render,0)} m²`);
    const steel = parseFloat(val('ex_steelDoor')) || 0;
    if (steel > 0) addLi('Steel doors (qty)', `${fmtNum(steel,0)}`);
    
    // Discount 
    const inputDisc = parseFloat(val('discountPct'));
    const defaultDisc = parseFloat(val('cfg_discount')) || 0;
    const appliedDisc = (isFinite(inputDisc) && inputDisc >= 0) ? inputDisc : defaultDisc;
    if (appliedDisc != 0) addLi('Discount', `${fmtNum(appliedDisc,2)}`);

    // Notes
    const notes = val('notes');
    qs('#p_notes').textContent = notes || '';
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
    qs('#cfg_windowRate').value = defaults.windowRate;
    qs('#cfg_EXDoorCharge').value = defaults.exDoorCharge;
    qs('#cfg_EXDoorRate').value = defaults.exDoorRate;
    qs('#cfg_skylightsCharge').value = defaults.skylightCharge;
    qs('#cfg_skylightsRate').value = defaults.skylightRate;
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

function updateCladSize(){
    const width = parseFloat(qs('#width').value) || 0;
    const depth = parseFloat(qs('#depth').value) || 0;
    qs('#cladding').value = width > 0 && depth > 0 ? ((width+depth)*2*2.4) : 0;
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
});```