/* ═══════════════════════════════════════════════════════════
   IndiaCalc — js/prices.js
   Daily Prices dashboard · Gold · Petrol · Currency
   Range slider sync · DOM init
   Depends on: utils.js, calculators.js
═══════════════════════════════════════════════════════════ */

function syncAllRanges() {
  emiAmountSync(); emiRateSync(); emiTenureSync();
  sipAmountSync(); sipRateSync(); sipYearsSync();
  fdYearsSync();
}
syncAllRanges();

// Sync text inputs back to range sliders when user types in the input box
['emi-amount','emi-rate','emi-tenure','sip-amount','sip-rate','sip-years','fd-years'].forEach(function(id) {
  var el = $(id);
  if (!el) return;
  el.addEventListener('input', function() {
    var rng = $(id + '-r');
    if (rng) rng.value = el.value;
  });
});

// ═══════════════════════════════════════════════
//  DAILY PRICES DASHBOARD
// ═══════════════════════════════════════════════

// ── PETROL DATA ──
var PETROL_DATA = {
  delhi:     { petrol: 94.72,  diesel: 87.62, cng: 74.09, lpg: 903.00, change: +0.10, dir: 'up'   },
  mumbai:    { petrol: 104.21, diesel: 92.15, cng: 66.00, lpg: 903.00, change: +0.10, dir: 'up'   },
  bangalore: { petrol: 102.86, diesel: 88.94, cng: 78.00, lpg: 903.00, change:  0.00, dir: 'flat' },
  chennai:   { petrol: 100.75, diesel: 92.34, cng: 80.00, lpg: 903.00, change: -0.05, dir: 'down' },
  hyderabad: { petrol: 107.41, diesel: 95.65, cng: 79.50, lpg: 903.00, change: +0.15, dir: 'up'   },
  kolkata:   { petrol: 103.94, diesel: 90.76, cng: 71.00, lpg: 903.00, change: +0.08, dir: 'up'   }
};
var currentPetrolCity = 'delhi';

function setPetrolCity(btn, city) {
  document.querySelectorAll('.petrol-city-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  currentPetrolCity = city;
  var d = PETROL_DATA[city];
  $('petrol-price-main').textContent = '₹' + d.petrol.toFixed(2);
  $('pg-petrol').textContent  = '₹' + d.petrol.toFixed(2);
  $('pg-diesel').textContent  = '₹' + d.diesel.toFixed(2);
  $('pg-cng').textContent     = '₹' + d.cng.toFixed(2);
  $('pg-lpg').textContent     = '₹' + d.lpg.toFixed(2);
  var chgEl = $('petrol-change');
  if (d.dir === 'up') {
    chgEl.className = 'petrol-change up';
    chgEl.textContent = '▲ ₹' + Math.abs(d.change).toFixed(2) + ' vs yesterday';
  } else if (d.dir === 'down') {
    chgEl.className = 'petrol-change down';
    chgEl.textContent = '▼ ₹' + Math.abs(d.change).toFixed(2) + ' vs yesterday';
  } else {
    chgEl.className = 'petrol-change down';
    chgEl.textContent = '— No change today';
  }
  calcFuelCost();
}

function calcFuelCost() {
  var km      = parseFloat($('fuel-km').value)      || 0;
  var mileage = parseFloat($('fuel-mileage').value) || 15;
  var price   = PETROL_DATA[currentPetrolCity] ? PETROL_DATA[currentPetrolCity].petrol : 94.72;
  var liters  = mileage > 0 ? km / mileage : 0;
  var cost    = liters * price;
  $('fuel-cost-result').textContent = 'Cost: ₹' + cost.toFixed(2) + ' for ' + km + ' km (' + liters.toFixed(2) + ' L)';
}

// ── GOLD ──
function calcGoldValue() {
  var grams       = parseFloat($('gold-grams').value)  || 0;
  var ratePerTenG = parseFloat($('gold-karat').value)  || 77220;
  var value       = grams * (ratePerTenG / 10);
  $('gold-calc-result').textContent = '₹' + Math.round(value).toLocaleString('en-IN') + ' for ' + grams + 'g';
}

// ── CURRENCY DATA (INR base, static sample Feb 2025) ──
var CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee',       flag: '🇮🇳', inrRate: 1.00,    change:  0.00 },
  { code: 'USD', name: 'US Dollar',           flag: '🇺🇸', inrRate: 83.94,   change: -0.08 },
  { code: 'EUR', name: 'Euro',                flag: '🇪🇺', inrRate: 91.12,   change: +0.15 },
  { code: 'GBP', name: 'British Pound',       flag: '🇬🇧', inrRate: 106.58,  change: +0.22 },
  { code: 'JPY', name: 'Japanese Yen',        flag: '🇯🇵', inrRate: 0.5572,  change: -0.03 },
  { code: 'AED', name: 'UAE Dirham',          flag: '🇦🇪', inrRate: 22.85,   change: -0.02 },
  { code: 'SGD', name: 'Singapore Dollar',    flag: '🇸🇬', inrRate: 63.22,   change: +0.10 },
  { code: 'CAD', name: 'Canadian Dollar',     flag: '🇨🇦', inrRate: 61.84,   change: -0.05 },
  { code: 'AUD', name: 'Australian Dollar',   flag: '🇦🇺', inrRate: 54.36,   change: -0.12 },
  { code: 'CHF', name: 'Swiss Franc',         flag: '🇨🇭', inrRate: 95.72,   change: +0.08 },
  { code: 'CNY', name: 'Chinese Yuan',        flag: '🇨🇳', inrRate: 11.59,   change: -0.04 },
  { code: 'SAR', name: 'Saudi Riyal',         flag: '🇸🇦', inrRate: 22.38,   change: -0.01 },
  { code: 'KWD', name: 'Kuwaiti Dinar',       flag: '🇰🇼', inrRate: 273.52,  change: +0.05 },
  { code: 'QAR', name: 'Qatari Riyal',        flag: '🇶🇦', inrRate: 23.06,   change: -0.01 },
  { code: 'MYR', name: 'Malaysian Ringgit',   flag: '🇲🇾', inrRate: 19.42,   change: +0.04 },
  { code: 'THB', name: 'Thai Baht',           flag: '🇹🇭', inrRate: 2.46,    change: -0.02 }
];

function buildCurrencyChips() {
  var showCodes = ['USD','EUR','GBP','AED','SGD','JPY','SAR','CNY','CHF'];
  var html = '';
  CURRENCIES.filter(function(c) { return showCodes.indexOf(c.code) !== -1; }).forEach(function(c) {
    var isUp   = c.change >= 0;
    var chgStr = (isUp ? '▲ +' : '▼ ') + Math.abs(c.change).toFixed(2) + '%';
    var chgCls = isUp ? 'up' : 'down';
    var rateStr = c.inrRate >= 1 ? c.inrRate.toFixed(2) : c.inrRate.toFixed(4);
    html += '<div class="currency-rate-chip" onclick="selectCurrChip(this,\'' + c.code + '\')">' +
      '<div class="chip-flag">' + c.flag + ' <b style="font-size:0.72rem;color:var(--indigo)">' + c.code + '</b></div>' +
      '<div class="chip-code">₹' + rateStr + '</div>' +
      '<div class="chip-change ' + chgCls + '">' + chgStr + '</div>' +
      '</div>';
  });
  $('currency-chips').innerHTML = html;
}

function selectCurrChip(el, code) {
  document.querySelectorAll('.currency-rate-chip').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  $('curr-from').value = code;
  doConvert();
}

function buildCurrencySelects() {
  var fromSel = $('curr-from');
  var toSel   = $('curr-to');
  fromSel.innerHTML = '';
  toSel.innerHTML   = '';
  CURRENCIES.forEach(function(c) {
    var o1 = document.createElement('option');
    o1.value = c.code;
    o1.textContent = c.flag + ' ' + c.code + ' – ' + c.name;
    fromSel.appendChild(o1);
    var o2 = document.createElement('option');
    o2.value = c.code;
    o2.textContent = c.flag + ' ' + c.code + ' – ' + c.name;
    toSel.appendChild(o2);
  });
  fromSel.value = 'USD';
  toSel.value   = 'INR';
}

function doConvert() {
  var fromCode = $('curr-from').value;
  var toCode   = $('curr-to').value;
  var amount   = parseFloat($('curr-amount').value) || 1;
  var fromC    = null, toC = null;
  for (var i = 0; i < CURRENCIES.length; i++) {
    if (CURRENCIES[i].code === fromCode) fromC = CURRENCIES[i];
    if (CURRENCIES[i].code === toCode)   toC   = CURRENCIES[i];
  }
  if (!fromC || !toC) return;
  var inrVal = amount * fromC.inrRate;
  var result = inrVal / toC.inrRate;
  var resultStr;
  if (toC.code === 'INR') {
    resultStr = '₹' + result.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    resultStr = toC.flag + ' ' + result.toLocaleString('en-IN', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }
  $('curr-result-val').textContent  = resultStr;
  $('curr-from-label').textContent  = amount + ' ' + fromC.flag + ' ' + fromC.code;
  $('curr-to-label').textContent    = toC.name;
  buildRateTable(fromCode);
}

function swapCurrency() {
  var tmp = $('curr-from').value;
  $('curr-from').value = $('curr-to').value;
  $('curr-to').value   = tmp;
  doConvert();
}

function buildRateTable(highlightCode) {
  var rows = '';
  CURRENCIES.filter(function(c) { return c.code !== 'INR'; }).forEach(function(c) {
    var isHl    = c.code === highlightCode;
    var isUp    = c.change >= 0;
    var inrToFx = (1 / c.inrRate).toFixed(6);
    var rateStr = c.inrRate >= 1 ? c.inrRate.toFixed(2) : c.inrRate.toFixed(4);
    var chgStr  = (isUp ? '▲ +' : '▼ ') + Math.abs(c.change).toFixed(2) + '%';
    var chgClr  = isUp ? 'var(--green)' : '#FF3B30';
    var rowBg   = isHl ? 'background:var(--saffron-pale)' : '';
    rows += '<tr style="' + rowBg + '">' +
      '<td style="padding:9px 12px;font-weight:600;color:var(--indigo)">' + c.flag + ' ' + c.code +
        ' <span style="font-weight:400;color:var(--gray-400);font-size:0.78rem">– ' + c.name + '</span></td>' +
      '<td style="padding:9px 12px;text-align:right;color:var(--gray-700)">' + inrToFx + '</td>' +
      '<td style="padding:9px 12px;text-align:right;font-weight:700;color:var(--indigo)">₹' + rateStr + '</td>' +
      '<td style="padding:9px 12px;text-align:right;font-weight:600;color:' + chgClr + '">' + chgStr + '</td>' +
      '</tr>';
  });
  $('curr-rate-tbody').innerHTML = rows;
}

function initPricesDashboard() {
  buildCurrencyChips();
  buildCurrencySelects();
  doConvert();
  calcGoldValue();
  calcFuelCost();
  var firstChip = document.querySelector('.currency-rate-chip');
  if (firstChip) firstChip.classList.add('selected');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPricesDashboard);
} else {
  initPricesDashboard();
}
