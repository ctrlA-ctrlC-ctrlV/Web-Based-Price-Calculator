// crypto.js  (ES Module)

// ====== CONFIG: fixed 32-byte key (base64url) ======
// Generate your own once (see notes below) and paste it here:
export const APP_KEY_B64 = 'LPRQnPMEKA7ZGDRzt0qTUacJQt_Ssl3c8BiowmOra1c';

// -------- helpers --------
const ENC_ALGO = 'AES-GCM';
const te = new TextEncoder();
const td = new TextDecoder();

function b64urlEncode(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
}
function b64urlDecode(str) {
  str = str.replace(/-/g,'+').replace(/_/g,'/');
  const pad = str.length % 4 ? 4 - (str.length % 4) : 0;
  const s = atob(str + '='.repeat(pad));
  const out = new Uint8Array(s.length);
  for (let i=0; i<s.length; i++) out[i] = s.charCodeAt(i);
  return out.buffer;
}

async function importFixedKey() {
  const raw = b64urlDecode(APP_KEY_B64);
  return crypto.subtle.importKey('raw', raw, ENC_ALGO, false, ['encrypt','decrypt']);
}

// -------- public API --------

export async function encryptJson(obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importFixedKey(); 
  const plaintext = te.encode(JSON.stringify(obj));
  const ciphertext = await crypto.subtle.encrypt({name: ENC_ALGO, iv}, key, plaintext);
  return b64urlEncode(iv) + '.' + b64urlEncode(ciphertext);
}

export async function decryptJson(encStr) {
  const [ivB64, ctB64] = encStr.split('.');
  if (!ivB64 || !ctB64) throw new Error('Bad enc format');
  const iv = new Uint8Array(b64urlDecode(ivB64));
  const ct = b64urlDecode(ctB64);
  const key = await importFixedKey(); 
  const plainBuf = await crypto.subtle.decrypt({name: ENC_ALGO, iv}, key, ct);
  return JSON.parse(td.decode(plainBuf));
}