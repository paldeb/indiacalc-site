/* ═══════════════════════════════════════════════════════════
   IndiaCalc — js/calculators.js
   All calculator functions (17 calculators):
   EMI · SIP · FD · Tax · GST · CAGR · Age · BMI · Pct · Unit
   PPF · NPS · SSY · Gratuity · Salary · RD · CI
   Depends on: utils.js
═══════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════
function calcEMI() {
  const P = val('emi-amount');
  let rAnn = val('emi-rate');
  let n = val('emi-tenure');
  if (!P || !rAnn || !n) { alert('Please fill in all fields'); return; }
  const tenureType = getToggle('emi-tenure-type');
  if (tenureType === 'Years') n = n * 12;
  const r = rAnn / 12 / 100;
  const emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - P;
  const intPct = (interest / total) * 100;
  $('emi-main').textContent = fmtINRFull(emi) + '/mo';
  $('emi-principal').textContent = fmtINR(P);
  $('emi-interest').textContent = fmtINR(interest);
  $('emi-total').textContent = fmtINR(total);
  $('emi-int-pct').textContent = fmtPct(intPct);
  $('emi-bar').style.width = (100 - intPct) + '%';
  showResult('emi-result');
}
function resetEMI() {
  $('emi-amount').value = 1000000; $('emi-amount-r').value = 1000000; $('emi-amount-rv').textContent = '₹10L';
  $('emi-rate').value   = 8.5;     $('emi-rate-r').value   = 8.5;     $('emi-rate-rv').textContent   = '8.5%';
  $('emi-tenure').value = 20;      $('emi-tenure-r').value = 20;      $('emi-tenure-rv').textContent = '20';
  hideResult('emi-result');
}

// ═══════════════════════════════════════════════
//  SIP CALCULATOR
// ═══════════════════════════════════════════════
function calcSIP() {
  const P = val('sip-amount');
  const r = val('sip-rate') / 12 / 100;
  const n = val('sip-years') * 12;
  const corpus = r===0 ? P*n : P*((Math.pow(1+r,n)-1)/r)*(1+r);
  const invested = P * n;
  const gain = corpus - invested;
  const roi = (gain/invested)*100;
  $('sip-main').textContent = fmtINR(corpus);
  $('sip-invested').textContent = fmtINR(invested);
  $('sip-gain').textContent = fmtINR(gain);
  $('sip-roi').textContent = fmtPct(roi);
  $('sip-annual').textContent = fmtINR(P*12) + '/yr';
  const investedPct = (invested/corpus)*100;
  $('sip-bar').style.width = investedPct + '%';
  showResult('sip-result');
}
function resetSIP() {
  $('sip-amount').value = 5000;  $('sip-amount-r').value = 5000;  $('sip-amount-rv').textContent = '₹5K';
  $('sip-rate').value   = 12;    $('sip-rate-r').value   = 12;    $('sip-rate-rv').textContent   = '12%';
  $('sip-years').value  = 15;    $('sip-years-r').value  = 15;    $('sip-years-rv').textContent  = '15 yrs';
  hideResult('sip-result');
}

// ═══════════════════════════════════════════════
//  FD CALCULATOR
// ═══════════════════════════════════════════════
function calcFD() {
  const P = val('fd-principal');
  const r = val('fd-rate') / 100;
  const t = val('fd-years');
  const n = parseInt($('fd-compound').value);
  const A = P * Math.pow(1 + r/n, n*t);
  const interest = A - P;
  const ear = (Math.pow(1 + r/n, n) - 1) * 100;
  const abs = (interest/P)*100;
  $('fd-main').textContent = fmtINRFull(A);
  $('fd-p').textContent = fmtINR(P);
  $('fd-interest').textContent = fmtINR(interest);
  $('fd-ear').textContent = fmtPct(ear);
  $('fd-abs').textContent = fmtPct(abs);
  showResult('fd-result');
}
function resetFD() {
  $('fd-principal').value = 100000;
  $('fd-rate').value = 7;
  $('fd-years').value = 3;
  hideResult('fd-result');
}

// ═══════════════════════════════════════════════
//  INCOME TAX CALCULATOR
// ═══════════════════════════════════════════════
function calcTax() {
  const gross=val('tax-income'), regime=getToggle('tax-regime');
  let taxable, basicTax, slabs;
  if (regime==='Old Regime') {
    const ded80c=Math.min(val('tax-80c'),150000), hra=val('tax-hra'), other=val('tax-other-ded');
    taxable=Math.max(0, gross-50000-ded80c-hra-other);
    slabs=[{limit:250000,rate:0},{limit:500000,rate:5},{limit:1000000,rate:20},{limit:Infinity,rate:30}];
    basicTax=calcSlabTax(taxable,slabs);
    if (taxable<=500000) { basicTax=0; }
    else { basicTax=Math.min(basicTax, calcSlabTax(500000,slabs)+(taxable-500000)); }
    $('tax-regime-info').innerHTML='<strong>Old Regime:</strong> Std deduction ₹50,000 + 80C ₹1.5L + HRA. Rebate u/s 87A if taxable ≤ ₹5L. Marginal relief applied.';
  } else {
    taxable=Math.max(0, gross-75000);
    slabs=[{limit:300000,rate:0},{limit:700000,rate:5},{limit:1000000,rate:10},
           {limit:1200000,rate:15},{limit:1500000,rate:20},{limit:Infinity,rate:30}];
    basicTax=calcSlabTax(taxable,slabs);
    if (taxable<=700000) { basicTax=0; }
    else { basicTax=Math.min(basicTax, calcSlabTax(700000,slabs)+(taxable-700000)); }
    $('tax-regime-info').innerHTML='<strong>New Regime FY 2024-25:</strong> Std deduction ₹75,000. Zero tax if taxable ≤ ₹7L (87A). Marginal relief applied.';
  }
  let surcharge=0;
  if (taxable>50000000) surcharge=basicTax*0.37;
  else if (taxable>20000000) surcharge=basicTax*0.25;
  else if (taxable>10000000) surcharge=basicTax*0.15;
  else if (taxable>5000000)  surcharge=basicTax*0.10;
  const cess=(basicTax+surcharge)*0.04, total=basicTax+surcharge+cess;
  $('tax-main').textContent=fmtINRFull(total); $('tax-taxable').textContent=fmtINR(taxable);
  $('tax-basic').textContent=fmtINR(basicTax); $('tax-surcharge').textContent=fmtINR(surcharge);
  $('tax-cess').textContent=fmtINR(cess); $('tax-slab-table').innerHTML=buildSlabTable(taxable,slabs);
  showResult('tax-result');
}

function calcSlabTax(income, slabs) {
  let tax = 0;
  let prev = 0;
  for (const s of slabs) {
    const cap = Math.min(income, s.limit);
    if (cap > prev) { tax += (cap - prev) * s.rate / 100; }
    prev = s.limit;
    if (income <= s.limit) break;
  }
  return tax;
}

function buildSlabTable(income, slabs) {
  let prev = 0;
  let rows = '';
  for (const s of slabs) {
    if (income <= prev) break;
    const cap = Math.min(income, s.limit);
    const amt = (cap - prev) * s.rate / 100;
    const limLabel = s.limit === Infinity ? 'Above ₹' + fmtINR(prev) : 'Up to ₹' + fmtINR(s.limit);
    rows += `<tr><td>${limLabel}</td><td>${s.rate}%</td><td>₹${Math.round(amt).toLocaleString('en-IN')}</td></tr>`;
    prev = s.limit;
  }
  return `<table class="tax-table"><thead><tr><th>Slab</th><th>Rate</th><th>Tax</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function resetTax() {
  $('tax-income').value = 1200000;
  $('tax-80c').value = 150000;
  $('tax-hra').value = 0;
  $('tax-other-ded').value = 25000;
  hideResult('tax-result');
}

// Show/hide old regime fields
document.getElementById('tax-regime').addEventListener('click', function() {
  const regime = getToggle('tax-regime');
  $('tax-old-fields').style.display = regime === 'Old Regime' ? 'block' : 'none';
});

// ═══════════════════════════════════════════════
//  GST CALCULATOR
// ═══════════════════════════════════════════════
function setGSTRate(btn, rate) {
  document.querySelectorAll('#gst-rate-sel .toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  $('gst-rate').value = rate;
}
function updateGSTLabel() {
  const type = getToggle('gst-type');
  $('gst-amount-label').textContent = type === 'Add GST' ? 'Original Amount (₹)' : 'GST-Inclusive Amount (₹)';
}
function calcGST() {
  const type=getToggle('gst-type'), amount=val('gst-amount'), rate=val('gst-rate');
  const txnType=getToggle('gst-txn-type')||'Intra-State';
  let original, gstAmt, total;
  if (type==='Add GST') { original=amount; gstAmt=amount*rate/100; total=amount+gstAmt; }
  else { total=amount; original=amount/(1+rate/100); gstAmt=amount-original; }
  const isInter = txnType==='Inter-State';
  const cgstLabel=document.getElementById('gst-cgst-label');
  const sgstRow=document.getElementById('gst-sgst-row');
  if (isInter) {
    if(cgstLabel) cgstLabel.textContent='IGST (100%)';
    if(sgstRow) sgstRow.style.display='none';
    $('gst-cgst').textContent=fmtINRFull(gstAmt);
    $('gst-sgst').textContent='—';
  } else {
    if(cgstLabel) cgstLabel.textContent='CGST (50%)';
    if(sgstRow) sgstRow.style.display='';
    $('gst-cgst').textContent=fmtINRFull(gstAmt/2);
    $('gst-sgst').textContent=fmtINRFull(gstAmt/2);
  }
  $('gst-original').textContent=fmtINRFull(original);
  $('gst-gst').textContent=fmtINRFull(gstAmt);
  $('gst-total').textContent=fmtINRFull(total);
  showResult('gst-result');
}
function resetGST() {
  $('gst-amount').value = 10000;
  $('gst-rate').value = 18;
  hideResult('gst-result');
}

// ═══════════════════════════════════════════════
//  CAGR CALCULATOR
// ═══════════════════════════════════════════════
function updateCAGRMode() {
  const mode = getToggle('cagr-mode');
  const findCAGR = mode === 'Find CAGR';
  $('cagr-final-group').style.display = findCAGR ? 'block' : 'none';
  $('cagr-rate-group').style.display = findCAGR ? 'none' : 'block';
}
function calcCAGR() {
  const mode=getToggle('cagr-mode'), initial=val('cagr-initial'), years=val('cagr-years');
  if(!initial||initial<=0){alert('Initial value must be > 0');return;}
  if(!years||years<=0){alert('Years must be > 0');return;}
  let cagr, finalVal;
  if (mode === 'Find CAGR') {
    finalVal = val('cagr-final');
    cagr = (Math.pow(finalVal/initial, 1/years) - 1) * 100;
    $('cagr-result-label').textContent = 'CAGR';
    $('cagr-main').textContent = fmtPct(cagr);
  } else {
    cagr = val('cagr-rate');
    finalVal = initial * Math.pow(1 + cagr/100, years);
    $('cagr-result-label').textContent = 'End Value';
    $('cagr-main').textContent = fmtINR(finalVal);
  }
  const retPct = ((finalVal - initial)/initial)*100;
  $('cagr-r-initial').textContent = fmtINR(initial);
  $('cagr-r-final').textContent = fmtINR(finalVal);
  $('cagr-r-return').textContent = fmtPct(retPct);
  $('cagr-r-period').textContent = years + ' Years';
  showResult('cagr-result');
}
function resetCAGR() {
  $('cagr-initial').value = 100000;
  $('cagr-final').value = 300000;
  $('cagr-years').value = 5;
  hideResult('cagr-result');
}

// ═══════════════════════════════════════════════
//  AGE CALCULATOR
// ═══════════════════════════════════════════════
function toggleAgeDate() {
  const custom = getToggle('age-as-of') === 'Custom Date';
  $('age-custom-wrap').style.display = custom ? 'block' : 'none';
}
function calcAge() {
  const dobStr = $('age-dob').value;
  if (!dobStr) { alert('Please enter date of birth'); return; }
  const [dobY,dobM,dobD] = dobStr.split('-').map(Number);
  const dob = new Date(dobY, dobM-1, dobD);
  let to;
  if (getToggle('age-as-of')==='Custom Date' && $('age-custom').value) {
    const [toY,toM,toD] = $('age-custom').value.split('-').map(Number);
    to = new Date(toY, toM-1, toD);
  } else { const now=new Date(); to=new Date(now.getFullYear(),now.getMonth(),now.getDate()); }
  if (dob > to) { alert('Date of birth cannot be in the future'); return; }
  let years=to.getFullYear()-dob.getFullYear(), months=to.getMonth()-dob.getMonth(), days=to.getDate()-dob.getDate();
  if (days<0) { months--; const p=new Date(to.getFullYear(),to.getMonth(),0); days+=p.getDate(); }
  if (months<0) { years--; months+=12; }
  const totalDays=Math.floor((to-dob)/86400000);
  let nextBday=new Date(to.getFullYear(),dob.getMonth(),dob.getDate());
  if (nextBday<to) nextBday.setFullYear(to.getFullYear()+1);
  const daysToNext=Math.floor((nextBday-to)/86400000);
  const weekdays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  $('age-main').textContent=`${years} Yrs ${months} Mo ${days} Days`;
  $('age-years').textContent=years; $('age-months').textContent=months; $('age-days').textContent=days;
  $('age-total-days').textContent=totalDays.toLocaleString('en-IN');
  $('age-next-bday').textContent=daysToNext===0?'🎉 Today!':daysToNext+' days';
  $('age-weekday').textContent=weekdays[dob.getDay()];
  showResult('age-result');
}

// ═══════════════════════════════════════════════
//  BMI CALCULATOR
// ═══════════════════════════════════════════════
function toggleBMIUnit() {
  const metric = getToggle('bmi-unit') === 'Metric (kg/cm)';
  $('bmi-metric').style.display = metric ? 'block' : 'none';
  $('bmi-imperial').style.display = metric ? 'none' : 'block';
}
function calcBMI() {
  let height, weight;
  const metric = getToggle('bmi-unit') === 'Metric (kg/cm)';
  if (metric) {
    height = val('bmi-height-cm') / 100;
    weight = val('bmi-weight-kg');
  } else {
    height = val('bmi-height-in') * 0.0254;
    weight = val('bmi-weight-lb') * 0.453592;
  }
  if(!height||height<=0||!weight||weight<=0){alert("Enter valid height and weight > 0");return;}
  const bmi = weight / (height * height);
  const heightM = height;

  // Categories (WHO)
  let cat, catColor, needleLeft;
  if (bmi < 18.5) { cat='Underweight'; catColor='#4FFFB8'; needleLeft=15; }
  else if (bmi < 25) { cat='Normal Weight'; catColor='#4FFFB8'; needleLeft=35; }
  else if (bmi < 30) { cat='Overweight'; catColor='#FFD700'; needleLeft=60; }
  else { cat='Obese'; catColor='#FF3B30'; needleLeft=82; }

  // Ideal weight for normal BMI
  const idealMin = 18.5 * heightM * heightM;
  const idealMax = 24.9 * heightM * heightM;
  const diff = weight - idealMax;

  // Asian standard
  let asianCat;
  if (bmi < 18.5) asianCat = 'Underweight';
  else if (bmi < 23) asianCat = 'Normal';
  else if (bmi < 27.5) asianCat = 'Overweight';
  else asianCat = 'Obese';

  $('bmi-main').textContent = bmi.toFixed(1);
  $('bmi-needle').style.left = needleLeft + '%';
  $('bmi-cat').textContent = cat;
  $('bmi-cat').style.background = catColor + '22';
  $('bmi-cat').style.color = catColor === '#4FFFB8' ? '#00A86B' : catColor;
  $('bmi-cat2').textContent = cat;
  $('bmi-ideal').textContent = Math.round(idealMin) + '–' + Math.round(idealMax) + ' kg';
  $('bmi-diff').textContent = diff > 0 ? '−' + Math.abs(diff).toFixed(1) + ' kg to lose' : diff < 0 ? '+' + Math.abs(diff).toFixed(1) + ' kg to gain' : 'At ideal weight';
  $('bmi-asian').textContent = asianCat;
  showResult('bmi-result');
}
function resetBMI() {
  $('bmi-height-cm').value = 170;
  $('bmi-weight-kg').value = 70;
  hideResult('bmi-result');
}

// ═══════════════════════════════════════════════
//  PERCENTAGE CALCULATOR
// ═══════════════════════════════════════════════
function calcPct1() {
  const x = parseFloat($('p1-x').value), y = parseFloat($('p1-y').value);
  if (isNaN(x)||isNaN(y)) return;
  const ans = (x/100)*y;
  show_pct('p1-ans', `${x}% of ${y} = ${ans.toFixed(4)}`);
}
function calcPct2() {
  const x = parseFloat($('p2-x').value), y = parseFloat($('p2-y').value);
  if (!y) return;
  const ans = (x/y)*100;
  show_pct('p2-ans', `${x} is ${ans.toFixed(4)}% of ${y}`);
}
function calcPct3() {
  const x = parseFloat($('p3-x').value), y = parseFloat($('p3-y').value);
  if (!x) return;
  const change = ((y-x)/Math.abs(x))*100;
  const dir = change >= 0 ? '▲ Increase' : '▼ Decrease';
  show_pct('p3-ans', `${dir} of ${Math.abs(change).toFixed(4)}%`);
}
function calcPct4() {
  const amt = parseFloat($('p4-amt').value), pct = parseFloat($('p4-pct').value);
  if (isNaN(amt)||isNaN(pct)) return;
  const op = getToggle('pct4-op');
  const change = amt * pct / 100;
  const result = op === 'Add' ? amt + change : amt - change;
  show_pct('p4-ans', `${op === 'Add' ? 'After adding' : 'After removing'} ${pct}%: ${result.toFixed(4)}`);
}
function show_pct(id, txt) {
  $(id).textContent = txt;
  $(id).classList.remove('show');
  void $(id).offsetWidth;
  $(id).classList.add('show');
}

// ═══════════════════════════════════════════════
//  UNIT CONVERTER
// ═══════════════════════════════════════════════
const CONV = {
  length: {
    units: ['Meter','Kilometer','Centimeter','Millimeter','Mile','Yard','Foot','Inch','Nautical Mile'],
    toSI: [1, 1000, 0.01, 0.001, 1609.344, 0.9144, 0.3048, 0.0254, 1852]
  },
  weight: {
    units: ['Kilogram','Gram','Milligram','Pound','Ounce','Tonne','Quintal','Carat'],
    toSI: [1, 0.001, 0.000001, 0.453592, 0.0283495, 1000, 100, 0.0002]
  },
  temp: {
    units: ['Celsius','Fahrenheit','Kelvin'],
    toSI: null
  },
  area: {
    units: ['Square Meter','Square Kilometer','Hectare','Acre','Square Foot','Square Inch','Square Yard','Bigha (India)'],
    toSI: [1, 1e6, 10000, 4046.86, 0.092903, 0.00064516, 0.836127, 1337]
  },
  volume: {
    units: ['Liter','Milliliter','Cubic Meter','Gallon (US)','Quart','Pint','Cup','Fluid Ounce'],
    toSI: [1, 0.001, 1000, 3.78541, 0.946353, 0.473176, 0.236588, 0.0295735]
  },
  speed: {
    units: ['m/s','km/h','mph','knot','ft/s'],
    toSI: [1, 1/3.6, 0.44704, 0.514444, 0.3048]
  },
  data: {
    units: ['Byte','Kilobyte','Megabyte','Gigabyte','Terabyte','Petabyte','Bit','Kilobit','Megabit','Gigabit'],
    toSI: [1, 1024, 1048576, 1073741824, 1.099511628e12, 1.125899907e15, 0.125, 128, 131072, 134217728]
  }
};

let currentConvType = 'length';

function setConvType(btn, type) {
  document.querySelectorAll('#conv-tabs .conv-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentConvType = type;
  buildConvSelects(type);
  convertUnit();
}

function buildConvSelects(type) {
  const units = CONV[type].units;
  [$('conv-from'), $('conv-to')].forEach((sel, i) => {
    sel.innerHTML = '';
    units.forEach((u, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = u;
      sel.appendChild(opt);
    });
    if (i === 1 && units.length > 1) sel.selectedIndex = 1;
  });
}

function convertUnit() {
  const type = currentConvType;
  const fromIdx = parseInt($('conv-from').value);
  const toIdx = parseInt($('conv-to').value);
  const val = parseFloat($('conv-value').value) || 0;
  const units = CONV[type].units;
  let result;

  if (type === 'temp') {
    const C = fromIdx === 0 ? val : fromIdx === 1 ? (val-32)*5/9 : val-273.15;
    result = toIdx === 0 ? C : toIdx === 1 ? C*9/5+32 : C+273.15;
    $('conv-formula').innerHTML = `<strong>Formula:</strong> ${units[fromIdx]} → ${units[toIdx]}`;
  } else {
    const si = val * CONV[type].toSI[fromIdx];
    result = si / CONV[type].toSI[toIdx];
  }

  const formatted = Math.abs(result) > 0.0001 ? +result.toPrecision(8) : result.toExponential(4);
  $('conv-result').textContent = formatted.toLocaleString('en-IN', {maximumFractionDigits: 8});
  $('conv-result-unit').textContent = `${val} ${units[fromIdx]} = ${formatted} ${units[toIdx]}`;
  $('conv-formula').innerHTML = `<strong>1 ${units[fromIdx]}</strong> = ${(CONV[type].toSI ? CONV[type].toSI[fromIdx]/CONV[type].toSI[toIdx] : 1).toPrecision(6)} ${units[toIdx]}`;
}

function swapConv() {
  const fi = $('conv-from').value;
  const ti = $('conv-to').value;
  $('conv-from').value = ti;
  $('conv-to').value = fi;
  convertUnit();
}

// ═══════════════════════════════════════════════
//  INITIALIZE
// ═══════════════════════════════════════════════
// Set default DOB for age calculator
const today = new Date();
const defDob = new Date(today.getFullYear()-25, today.getMonth(), today.getDate());
$('age-dob').value = defDob.toISOString().split('T')[0];
$('age-custom').value = today.toISOString().split('T')[0];

buildConvSelects('length');
convertUnit();

// Sync range displays on load

// ═══════════════════════════════════════════════════════════════
//  PPF CALCULATOR
// ═══════════════════════════════════════════════════════════════
function calcPPF() {
  const deposit = val('ppf-deposit');
  const rate    = val('ppf-rate') / 100;
  const tenureLabel = getToggle('ppf-tenure-grp') || '15 yrs';
  const years   = parseInt(tenureLabel);
  if (!deposit || deposit<=0) { alert('Enter a valid yearly deposit'); return; }
  if (!rate || rate<=0)       { alert('Enter a valid interest rate'); return; }
  // Annual compounding; deposit at start of each year
  let balance = 0;
  for (let y = 0; y < years; y++) { balance = (balance + deposit) * (1 + rate); }
  const invested = deposit * years;
  const interest = balance - invested;
  const gainPct  = (interest / invested) * 100;
  $('ppf-main').textContent     = fmtINR(balance);
  $('ppf-invested').textContent = fmtINR(invested);
  $('ppf-interest').textContent = fmtINR(interest);
  $('ppf-gain-pct').textContent = fmtPct(gainPct);
  $('ppf-cagr').textContent     = fmtPct(rate * 100) + ' p.a.';
  showResult('ppf-result');
}
function resetPPF() {
  $('ppf-deposit').value = 150000;
  $('ppf-rate').value    = 7.1;
  hideResult('ppf-result');
}

// ═══════════════════════════════════════════════════════════════
//  NPS CALCULATOR
// ═══════════════════════════════════════════════════════════════
function calcNPS() {
  const monthly     = val('nps-monthly');
  const age         = val('nps-age');
  const rate        = val('nps-rate') / 100;
  const annuityPct  = parseInt(getToggle('nps-annuity-pct') || '40%') / 100;
  const annuityRate = val('nps-annuity-rate') / 100;
  if (!monthly || monthly<=0)  { alert('Enter a valid monthly contribution'); return; }
  if (!age || age<=0 || age>=60){ alert('Enter a valid current age (must be below 60)'); return; }
  const yearsLeft = 60 - age;
  const n = yearsLeft * 12;
  const r = rate / 12;
  const corpus   = r===0 ? monthly*n : monthly*((Math.pow(1+r,n)-1)/r)*(1+r);
  const invested  = monthly * n;
  const lumpsum   = corpus * (1 - annuityPct);
  const annuityAmt = corpus * annuityPct;
  const pension   = (annuityAmt * annuityRate) / 12;
  $('nps-corpus').textContent      = fmtINR(corpus);
  $('nps-lumpsum').textContent     = fmtINR(lumpsum);
  $('nps-annuity-amt').textContent = fmtINR(annuityAmt);
  $('nps-pension').textContent     = fmtINRFull(pension) + '/mo';
  $('nps-years').textContent       = yearsLeft + ' years';
  $('nps-invested').textContent    = fmtINR(invested);
  $('nps-gain').textContent        = fmtINR(corpus - invested);
  showResult('nps-result');
}
function resetNPS() {
  $('nps-monthly').value = 5000; $('nps-age').value = 30; $('nps-rate').value = 10;
  hideResult('nps-result');
}

// ═══════════════════════════════════════════════════════════════
//  SSY CALCULATOR
// ═══════════════════════════════════════════════════════════════
function calcSSY() {
  const deposit = val('ssy-deposit');
  const age     = val('ssy-age');
  const rate    = val('ssy-rate') / 100;
  if (!deposit || deposit<250)  { alert('Minimum yearly deposit is ₹250'); return; }
  if (deposit > 150000)         { alert('Maximum yearly deposit is ₹1,50,000'); return; }
  if (age === undefined || age > 10) { alert('SSY account can only be opened for girls aged 10 or below'); return; }
  const depositYears = 15;
  const totalYears   = 21 - age;
  const maturityYear = new Date().getFullYear() + totalYears;
  let balance = 0;
  for (let y = 0; y < totalYears; y++) {
    if (y < depositYears) balance += deposit;
    balance *= (1 + rate);
  }
  const invested = deposit * depositYears;
  $('ssy-main').textContent        = fmtINR(balance);
  $('ssy-invested').textContent    = fmtINR(invested);
  $('ssy-interest').textContent    = fmtINR(balance - invested);
  $('ssy-deposit-yrs').textContent = depositYears + ' years';
  $('ssy-maturity-yr').textContent = maturityYear;
  showResult('ssy-result');
}
function resetSSY() {
  $('ssy-deposit').value = 100000; $('ssy-age').value = 1; $('ssy-rate').value = 8.2;
  hideResult('ssy-result');
}

// ═══════════════════════════════════════════════════════════════
//  GRATUITY CALCULATOR
// ═══════════════════════════════════════════════════════════════
function calcGratuity() {
  const salary  = val('grat-salary');
  const years   = val('grat-years');
  const orgType = getToggle('grat-org-type') || 'Covered (Gratuity Act)';
  if (!salary || salary<=0) { alert('Enter a valid monthly salary'); return; }
  if (!years || years<5)    { alert('Gratuity requires minimum 5 years of service'); return; }
  const divisor  = orgType.includes('Not Covered') ? 30 : 26;
  const formula  = orgType.includes('Not Covered')
    ? '(Salary × 15 × Years) ÷ 30'
    : '(Salary × 15 × Years) ÷ 26';
  const gratuity = (salary * 15 * years) / divisor;
  const taxable  = Math.max(0, gratuity - 2000000);
  $('grat-main').textContent        = fmtINR(gratuity);
  $('grat-formula').textContent     = formula;
  $('grat-taxable').textContent     = taxable > 0 ? fmtINR(taxable) : '₹0 (within ₹20L limit)';
  $('grat-salary-disp').textContent = fmtINRFull(salary) + '/mo';
  showResult('grat-result');
}
function resetGratuity() {
  $('grat-salary').value = 50000; $('grat-years').value = 10;
  hideResult('grat-result');
}

// ═══════════════════════════════════════════════════════════════
//  TAKE-HOME SALARY CALCULATOR
// ═══════════════════════════════════════════════════════════════
function calcSalary() {
  const ctc    = val('sal-ctc');
  const regime = getToggle('sal-regime') || 'New Regime';
  const pfOn   = (getToggle('sal-pf-toggle') || '12% of Basic') === '12% of Basic';
  const pt     = val('sal-pt') || 0;
  const ded80c = regime === 'New Regime' ? 0 : Math.min(val('sal-80c') || 0, 150000);
  if (!ctc || ctc<=0) { alert('Enter a valid CTC'); return; }
  const basic      = ctc * 0.40;
  const empPF      = pfOn ? basic * 0.12 : 0;
  const gross      = ctc - empPF;
  const employeePF = pfOn ? basic * 0.12 : 0;
  const stdDed     = regime === 'New Regime' ? 75000 : 50000;
  let taxable = Math.max(0, gross - stdDed - ded80c - pt);
  let basicTax;
  if (regime === 'New Regime') {
    const slabs=[{limit:300000,rate:0},{limit:700000,rate:5},{limit:1000000,rate:10},
                 {limit:1200000,rate:15},{limit:1500000,rate:20},{limit:Infinity,rate:30}];
    basicTax = calcSlabTax(taxable, slabs);
    if (taxable<=700000) basicTax=0;
    else basicTax=Math.min(basicTax, calcSlabTax(700000,slabs)+(taxable-700000));
  } else {
    const slabs=[{limit:250000,rate:0},{limit:500000,rate:5},{limit:1000000,rate:20},{limit:Infinity,rate:30}];
    basicTax = calcSlabTax(taxable, slabs);
    if (taxable<=500000) basicTax=0;
    else basicTax=Math.min(basicTax, calcSlabTax(500000,slabs)+(taxable-500000));
  }
  const totalTax   = basicTax * 1.04;
  const annualNet  = gross - employeePF - pt - totalTax;
  const monthlyNet = annualNet / 12;
  $('sal-inhand').textContent    = fmtINRFull(monthlyNet) + '/mo';
  $('sal-ctc-disp').textContent  = fmtINR(ctc);
  $('sal-tax').textContent       = fmtINR(totalTax);
  $('sal-pf').textContent        = fmtINR(employeePF);
  $('sal-pt-disp').textContent   = fmtINR(pt);
  $('sal-annual').textContent    = fmtINR(annualNet);
  $('sal-eff-rate').textContent  = fmtPct(gross>0 ? (totalTax/gross)*100 : 0);
  showResult('sal-result');
}
function resetSalary() {
  $('sal-ctc').value = 1200000; $('sal-pt').value = 2400; $('sal-80c').value = 150000;
  hideResult('sal-result');
}

// ═══════════════════════════════════════════════════════════════
//  RECURRING DEPOSIT (RD) CALCULATOR
// ═══════════════════════════════════════════════════════════════
function calcRD() {
  const R      = val('rd-monthly');
  const rate   = val('rd-rate');
  const months = val('rd-months');
  if (!R || R<=0)         { alert('Enter a valid monthly deposit'); return; }
  if (!rate || rate<=0)   { alert('Enter a valid interest rate'); return; }
  if (!months || months<6){ alert('Minimum tenure is 6 months'); return; }
  // Standard RD formula: quarterly compounding
  const i = rate / 4 / 100;
  const n = months / 3;
  const maturity = R * (Math.pow(1+i,n) - 1) / (1 - Math.pow(1+i, -1/3));
  const invested = R * months;
  const interest = maturity - invested;
  const ear      = (Math.pow(1 + rate/4/100, 4) - 1) * 100;
  $('rd-main').textContent     = fmtINRFull(maturity);
  $('rd-invested').textContent = fmtINR(invested);
  $('rd-interest').textContent = fmtINR(interest);
  $('rd-ear').textContent      = fmtPct(ear);
  $('rd-abs').textContent      = fmtPct((interest/invested)*100);
  showResult('rd-result');
}
function resetRD() {
  $('rd-monthly').value = 5000; $('rd-rate').value = 7.0; $('rd-months').value = 24;
  hideResult('rd-result');
}

// ═══════════════════════════════════════════════════════════════
//  COMPOUND INTEREST CALCULATOR
// ═══════════════════════════════════════════════════════════════
function calcCI() {
  const P = val('ci-principal');
  const r = val('ci-rate') / 100;
  const t = val('ci-years');
  const n = parseInt(document.getElementById('ci-freq').value);
  if (!P || P<=0)     { alert('Enter a valid principal amount'); return; }
  if (!r || r<=0)     { alert('Enter a valid interest rate'); return; }
  if (!t || t<=0)     { alert('Enter a valid time period'); return; }
  const A    = P * Math.pow(1 + r/n, n*t);
  const ci   = A - P;
  const si   = P * r * t;
  const ear  = (Math.pow(1 + r/n, n) - 1) * 100;
  $('ci-main').textContent     = fmtINRFull(A);
  $('ci-p').textContent        = fmtINR(P);
  $('ci-interest').textContent = fmtINR(ci);
  $('ci-si').textContent       = fmtINR(P + si) + ' (SI total)';
  $('ci-extra').textContent    = fmtINR(ci - si);
  $('ci-ear').textContent      = fmtPct(ear);
  $('ci-abs').textContent      = fmtPct((ci/P)*100);
  showResult('ci-result');
}
function resetCI() {
  $('ci-principal').value = 100000; $('ci-rate').value = 10; $('ci-years').value = 10;
  hideResult('ci-result');
}
