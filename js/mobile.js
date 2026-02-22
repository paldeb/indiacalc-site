/* ═══════════════════════════════════════════════════════════
   IndiaCalc — js/mobile.js
   Mobile hamburger menu toggle
═══════════════════════════════════════════════════════════ */


/* ══ MOBILE MENU TOGGLE ══ */
function icToggleMenu() {
  var btn  = document.getElementById('ic-hamburger');
  var menu = document.getElementById('ic-mobile-menu');
  var open = menu.classList.toggle('open');
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}
document.addEventListener('click', function(e) {
  var menu = document.getElementById('ic-mobile-menu');
  var btn  = document.getElementById('ic-hamburger');
  if (menu && menu.classList.contains('open')) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    }
  }
});

/* ══ EXTEND showTab: keep nav-tab highlight in sync ══ */
(function(){
  var _orig = window.showTab;
  window.showTab = function(id) {
    _orig(id);
    document.querySelectorAll('[data-tab]').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-tab') === id);
    });
  };
})();

