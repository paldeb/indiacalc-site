/* ═══════════════════════════════════════════════════════════
   IndiaCalc — js/utils.js
   Utility helpers · fmtINR · val · $ · PAGE_META
   Navigation · showTab · setToggle · showResult
   Load ORDER: utils.js → calculators.js → prices.js → mobile.js
═══════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════
const fmtINR = n => {
  if (isNaN(n)) return '₹0';
  const abs = Math.abs(n);
  let s;
  if (abs >= 1e7) s = (n/1e7).toFixed(2) + ' Cr';
  else if (abs >= 1e5) s = (n/1e5).toFixed(2) + ' L';
  else if (abs >= 1e3) s = (n/1e3).toFixed(1) + 'K';
  else s = Math.round(n).toString();
  return '₹' + s;
};
const fmtINRFull = n => '₹' + Math.round(n).toLocaleString('en-IN');
const fmtNum = n => {
  if (n >= 1e7) return '₹' + (n/1e7).toFixed(1) + 'Cr';
  if (n >= 1e5) return '₹' + (n/1e5).toFixed(1) + 'L';
  if (n >= 1e3) return '₹' + (n/1e3).toFixed(0) + 'K';
  return '₹' + n;
};
const fmtPct = n => n.toFixed(2) + '%';
const $  = id => document.getElementById(id);
const val = id => parseFloat($(id).value) || 0;

// ═══════════════════════════════════════════════
//  PAGE META — SEO data per tool
// ═══════════════════════════════════════════════
var PAGE_META = {
  home:   { title: 'IndiaCalc — Free Daily Utility Tools for Every Indian', desc: "India's free all-in-one toolkit: EMI, SIP, FD, Income Tax, GST, CAGR, Age, BMI, Percentage, Unit Converter, Gold & Petrol Prices.", crumb: 'Home' },
  emi:    { title: 'EMI Calculator — Home Loan, Car & Personal Loan | IndiaCalc', desc: 'Calculate your monthly EMI for home loan, car loan or personal loan instantly. Includes principal, interest breakup and amortisation chart. Updated FY 2024-25.', crumb: 'EMI Calculator' },
  sip:    { title: 'SIP Calculator — Mutual Fund Returns Estimator | IndiaCalc', desc: 'Estimate your SIP returns and wealth corpus with our free SIP calculator. Accounts for power of compounding over 1–40 years. Best mutual fund SIP planner India.', crumb: 'SIP Calculator' },
  fd:     { title: 'FD Calculator — Fixed Deposit Maturity Calculator India | IndiaCalc', desc: 'Calculate FD maturity amount with quarterly, monthly or annual compounding. Compare bank FD rates for 2024-25. Includes TDS and EAR calculation.', crumb: 'FD Calculator' },
  tax:    { title: 'Income Tax Calculator FY 2024-25 — Old vs New Regime | IndiaCalc', desc: 'Free income tax calculator for FY 2024-25 (AY 2025-26). Compare Old Regime vs New Regime with all deductions — 80C, HRA, 87A rebate, slab-wise breakup.', crumb: 'Income Tax Calculator' },
  gst:    { title: 'GST Calculator — Add or Remove GST Online Free | IndiaCalc', desc: 'Instantly calculate GST for 5%, 12%, 18%, 28% rates. Add GST to base price or extract GST from inclusive amount. Shows CGST + SGST split.', crumb: 'GST Calculator' },
  cagr:   { title: 'CAGR Calculator — Compound Annual Growth Rate | IndiaCalc', desc: 'Calculate CAGR of your investments or find the future value at a given CAGR. Compare Nifty, mutual fund and FD returns with this free CAGR tool.', crumb: 'CAGR Calculator' },
  age:    { title: 'Age Calculator — Exact Age in Years Months Days | IndiaCalc', desc: 'Calculate your exact age in years, months and days. Find total days lived, day of birth, next birthday countdown and retirement date.', crumb: 'Age Calculator' },
  bmi:    { title: 'BMI Calculator India — Body Mass Index with Asian Standards | IndiaCalc', desc: 'Calculate BMI with Indian/Asian BMI standards. Find ideal weight range and health category. Supports metric (kg/cm) and imperial (lb/in) units.', crumb: 'BMI Calculator' },
  pct:    { title: 'Percentage Calculator — 4 Types of % Calculations | IndiaCalc', desc: 'Free percentage calculator: find X% of Y, what % is X of Y, percentage increase/decrease, and add or remove % from any amount.', crumb: 'Percentage Calculator' },
  unit:   { title: 'Unit Converter — Length, Weight, Temperature, Area | IndiaCalc', desc: 'Convert between 60+ units across 7 categories: length, weight, temperature, area, volume, speed, and data. Instant, accurate, free.', crumb: 'Unit Converter' },
  prices: { title: 'Gold Rate Today, Petrol Price & Currency Converter | IndiaCalc', desc: "Today's gold rate in India (24K/22K), petrol diesel prices in Delhi Mumbai Bangalore, and INR currency converter for USD EUR GBP AED and more.", crumb: 'Daily Price Dashboard' }
};

function updateMeta(id) {
  var m = PAGE_META[id] || PAGE_META.home;
  document.title = m.title;
  var metaDesc = document.getElementById('meta-desc');
  var ogTitle  = document.getElementById('og-title');
  var ogDesc   = document.getElementById('og-desc');
  var canonical = document.getElementById('canonical-url');
  var breadcrumb = document.getElementById('breadcrumb');
  var breadcrumbCurrent = document.getElementById('breadcrumb-current');
  if (metaDesc) metaDesc.setAttribute('content', m.desc);
  if (ogTitle)  ogTitle.setAttribute('content', m.title);
  if (ogDesc)   ogDesc.setAttribute('content', m.desc);
  if (canonical) canonical.setAttribute('href', 'https://indiacalc.in/#' + id);
  if (breadcrumb) breadcrumb.style.display = id === 'home' ? 'none' : 'block';
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = m.crumb;
}

function showTab(id) {
  document.querySelectorAll('.tool-section').forEach(function(s) { s.classList.remove('active'); });
  document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
  var section = document.getElementById('tab-' + id);
  var navBtn  = document.querySelector('[data-tab="' + id + '"]');
  if (section) section.classList.add('active');
  if (navBtn)  navBtn.classList.add('active');
  var hero = document.getElementById('hero-section');
  if (hero) hero.style.display = id !== 'home' ? 'none' : '';
  if (history.pushState) {
    history.pushState(null, '', id === 'home' ? window.location.pathname : '#' + id);
  }
  updateMeta(id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeBanner() {
  var b = document.getElementById('festival-banner');
  if (b) { b.style.transition = 'max-height 0.3s, opacity 0.3s'; b.style.opacity = '0'; b.style.maxHeight = '0'; b.style.overflow = 'hidden'; b.style.padding = '0'; }
  try { sessionStorage.setItem('banner-closed', '1'); } catch(e) {}
}

// ═══════════════════════════════════════════════
//  WHATSAPP SHARE + COPY LINK
// ═══════════════════════════════════════════════
function shareWhatsApp() {
  var url  = window.location.href;
  var crumb = PAGE_META[getCurrentTab()] ? PAGE_META[getCurrentTab()].crumb : 'IndiaCalc Tool';
  var text = '🇮🇳 Check out the ' + crumb + ' on IndiaCalc — free, no sign-up!\n' + url;
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

function copyLink() {
  var url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function() { showCopied(); });
  } else {
    var ta = document.createElement('textarea');
    ta.value = url; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    showCopied();
  }
}

function showCopied() {
  var btns = document.querySelectorAll('.btn-copy-link');
  btns.forEach(function(b) {
    var orig = b.textContent;
    b.textContent = '✅ Copied!';
    b.style.background = 'var(--green-light)'; b.style.color = 'var(--green)';
    setTimeout(function() { b.textContent = orig; b.style.background = ''; b.style.color = ''; }, 2000);
  });
}

function getCurrentTab() {
  var active = document.querySelector('.nav-tab.active');
  return active ? active.getAttribute('data-tab') : 'home';
}

// ── Hash Routing Init ──
function initFromHash() {
  var hash = window.location.hash.replace('#', '').trim();
  var valid = Object.keys(PAGE_META);
  if (hash && valid.indexOf(hash) !== -1) {
    showTab(hash);
  } else {
    updateMeta('home');
  }
}

window.addEventListener('hashchange', function() {
  var hash = window.location.hash.replace('#', '').trim();
  if (hash && PAGE_META[hash]) showTab(hash);
});

initFromHash();

// ── Check banner session ──
try {
  if (sessionStorage.getItem('banner-closed') === '1') closeBanner();
} catch(e) {}

function setToggle(groupId, btn) {
  document.querySelectorAll('#'+groupId+' .toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function getToggle(groupId) {
  const a = document.querySelector('#'+groupId+' .toggle-btn.active');
  return a ? a.textContent.trim() : '';
}

function syncRange(inputId, rangeId, displayVal) {
  var v = $(rangeId).value;
  $(inputId).value = v;
  $(rangeId + '-rv').textContent = displayVal;
}

// Named slider sync functions (avoids arrow-function-in-HTML-attribute issues)
function emiAmountSync()  { var v = $('emi-amount-r').value;  $('emi-amount').value  = v; $('emi-amount-rv').textContent  = fmtNum(parseFloat(v)); }
function emiRateSync()    { var v = $('emi-rate-r').value;    $('emi-rate').value    = v; $('emi-rate-rv').textContent    = v + '%'; }
function emiTenureSync()  { var v = $('emi-tenure-r').value;  $('emi-tenure').value  = v; $('emi-tenure-rv').textContent  = v; }
function sipAmountSync()  { var v = $('sip-amount-r').value;  $('sip-amount').value  = v; $('sip-amount-rv').textContent  = fmtNum(parseFloat(v)); }
function sipRateSync()    { var v = $('sip-rate-r').value;    $('sip-rate').value    = v; $('sip-rate-rv').textContent    = v + '%'; }
function sipYearsSync()   { var v = $('sip-years-r').value;   $('sip-years').value   = v; $('sip-years-rv').textContent   = v + ' yrs'; }
function fdYearsSync()    { var v = $('fd-years-r').value;    $('fd-years').value    = v; $('fd-years-rv').textContent    = v + ' yrs'; }

function hideResult(id) { $(id).classList.remove('show'); }
function showResult(id) { $(id).classList.remove('show'); void $(id).offsetWidth; $(id).classList.add('show'); }

// ═══════════════════════════════════════════════
//  EMI CALCULATOR
