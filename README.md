# Garden Room Price Calculator

A shareable, single-page web app for creating custom quotes for garden rooms and home extensions.  
Built with **HTML, Tailwind CSS, and JavaScript** – no backend required.

## Features

- 📐 **Project Inputs**
  - Width × Depth (auto room size calculation)
  - Cladding size
  - Bathroom options (Toilet + Sink, Toilet + Sink + Shower)
  - Electrical (switches, double sockets)
  - Internal doors, wall type & size
  - Windows (dynamic add/remove with width × height)
  - External doors (dynamic add/remove with width × height)
  - Flooring type & size
  - Delivery distance
  - Extras: EPS insulation, render finish, steel doors

- ⚙️ **Config Panel (internal use)**
  - Base rate per m²
  - Fixed charge
  - Cladding rate
  - Window/door charges & rates
  - Delivery free radius & per-km rate
  - VAT %
  - Discount %

- 💶 **Live Estimate**
  - Automatic price calculation with VAT and discounts
  - Itemized breakdown (base build, cladding, bathrooms, electrical, etc.)
  - Currency toggle (EUR / GBP)

- 🔗 **Share & Persist**
  - Copy internal link (full config embedded in URL)
  - Copy client link (hides config, client-facing view)
  - Auto-save and restore state via LocalStorage

- 🖨️ **Print / Save PDF**
  - Generates a clean client-facing quote sheet
  - Includes customer details (name, address, phone, email)
  - Shows project details (sizes, counts, notes) **without prices**
  - Shows applied discount %
  - Shows **grand total** at the end
  - Additional notes section
  - Company logo and professional layout for print

## Usage

1. Open `index.html` in a browser.
2. Fill in project details and adjust config if needed.
3. Copy/share the link or click **Print / Save PDF** to generate a quote.

## Development

- **Frontend:** HTML, Tailwind CSS, JavaScript (ES modules)
- **No backend required**
- Works offline (all logic is client-side)

---