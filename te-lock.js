/* Κλείδωμα εργαλείων για εκπαιδευτικούς.
   Ο κωδικός δεν γράφεται εδώ: κρατιέται μόνο το αποτύπωμά του (SHA-256).
   Για αλλαγή κωδικού: βάλε στο HASH το SHA-256 του νέου κωδικού.
   Χρήση: <script src="../te-lock.js"></script> στο <head> κάθε εργαλείου,
   ή <script src="te-lock.js" data-scope="hub"></script> στην αρχική. */
(function(){
  var HASH='c2e5a60939fbbc5a8a3ed7d0b874ee388000f671ad36a2ef44c0637767b5e3d6';
  var KEY='ergal-te';
  var me=document.currentScript;
  var hub=me && me.getAttribute('data-scope')==='hub';
  function get(s){try{return s.getItem(KEY)}catch(e){return null}}
  if(get(sessionStorage)===HASH||get(localStorage)===HASH) return;

  var root=document.documentElement;
  root.classList.add('te-locked');
  var st=document.createElement('style');
  st.textContent=
    (hub
      ? '.te-locked #gia-ekpaideftikous .zone,.te-locked #gia-ekpaideftikous .share{display:none!important}'
      : '.te-locked body>*:not(.te-gate):not(.ergal-top){display:none!important}')+
    '.te-gate{max-width:420px;width:calc(100% - 24px);box-sizing:border-box;margin:'+(hub?'8px 0':'40px auto')+';padding:24px;border-radius:18px;background:#fff;color:#1d1d2b;'+
    'border:1px solid #e2dbe6;box-shadow:0 6px 24px rgba(0,0,0,.08);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}'+
    '.te-gate h2{margin:0 0 6px;font-size:22px}.te-gate p{margin:0 0 14px;color:#5d5866}'+
    '.te-gate input[type=password]{width:100%;box-sizing:border-box;font:inherit;padding:12px 14px;border:1px solid #cfc6d6;border-radius:10px;margin-bottom:10px}'+
    '.te-gate label.rem{display:flex;gap:8px;align-items:center;font-size:14px;color:#5d5866;margin-bottom:14px}'+
    '.te-gate button{font:600 16px system-ui,-apple-system,"Segoe UI",sans-serif;background:#6b3f72;color:#fff;border:0;border-radius:999px;padding:12px 20px;cursor:pointer}'+
    '.te-gate .err{color:#a3302a;font-size:14px;min-height:1.4em;margin:10px 0 0}'+
    '@media print{.te-gate{display:none}}';
  (document.head||root).appendChild(st);

  async function sha(t){
    var b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));
    return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('');
  }
  function build(){
    var box=document.createElement('form');
    box.className='te-gate'; box.autocomplete='off';
    box.innerHTML='<h2>🔒 Για εκπαιδευτικούς</h2>'+
      '<p>'+(hub?'Τα εργαλεία αυτής της ενότητας':'Αυτό το εργαλείο')+' ανοίγ'+(hub?'ουν':'ει')+' με τον κωδικό εκπαιδευτικού.</p>'+
      '<input type="password" id="tePw" placeholder="Κωδικός" aria-label="Κωδικός εκπαιδευτικού" required autocomplete="current-password">'+
      '<label class="rem"><input type="checkbox" id="teRem"> Να με θυμάται αυτή η συσκευή (όχι σε κοινόχρηστο υπολογιστή)</label>'+
      '<button type="submit">Ξεκλείδωμα</button><p class="err" id="teErr" aria-live="polite"></p>';
    if(hub){
      var sec=document.getElementById('gia-ekpaideftikous'); if(!sec) return;
      var head=sec.querySelector('.audhead');
      head?head.insertAdjacentElement('afterend',box):sec.prepend(box);
    } else {
      var bar=document.querySelector('body>.ergal-top');
      bar?bar.insertAdjacentElement('afterend',box):document.body.prepend(box);
      document.getElementById('tePw').focus();
    }
    box.addEventListener('submit',async function(e){
      e.preventDefault();
      var v=document.getElementById('tePw').value.trim();
      if(await sha(v)===HASH){
        try{sessionStorage.setItem(KEY,HASH)}catch(x){}
        if(document.getElementById('teRem').checked){try{localStorage.setItem(KEY,HASH)}catch(x){}}
        if(hub){box.remove();root.classList.remove('te-locked');}
        else location.reload();
      } else {
        document.getElementById('teErr').textContent='Λάθος κωδικός.';
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
})();
