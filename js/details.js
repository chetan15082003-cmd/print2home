const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzaz8OPqtHJHuxXTmHawIY4RfY4ddJXalHIFCeFBhtF0x6Ia4ra9s2sPvhk3e19-ljqXQ/exec';

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

async function submitDetails() {
  const name      = document.getElementById('detName').value.trim();
  const country   = document.getElementById('detCountry').value;
  const phone     = document.getElementById('detPhone').value.trim();
  const email     = document.getElementById('detEmail').value.trim();
  const wantsCall = document.getElementById('callToggle').checked;

  if (!name)    { alert('Please enter your full name!');    return; }
  if (!country) { alert('Please select your country!');     return; }
  if (!phone)   { alert('Please enter your phone number!'); return; }
  if (!email)   { alert('Please enter your email!');        return; }

  const brand  = sessionStorage.getItem('brand')  || '—';
  const issue  = sessionStorage.getItem('issue')  || '—';
  const device = sessionStorage.getItem('device') || '—';

  sessionStorage.setItem('name',    name);
  sessionStorage.setItem('email',   email);
  sessionStorage.setItem('phone',   phone);
  sessionStorage.setItem('country', country);
  sessionStorage.setItem('call',    wantsCall ? 'yes' : 'no');

  const btn     = document.querySelector('.continue-res-btn');
  btn.innerHTML = '⏳ Please wait...';
  btn.disabled  = true;

  try {
    await fetch(SHEET_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, country, brand, issue, device })
    });
  } catch(e) {
    console.log('Sheet:', e);
  }

  window.location.href = 'thankyou.html';
}