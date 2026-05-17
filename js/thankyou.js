const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger) hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

function generateTicket() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let t = 'P2H-';
  for (let i = 0; i < 7; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

const name    = sessionStorage.getItem('name')    || 'Valued Customer';
const email   = sessionStorage.getItem('email')   || '—';
const phone   = sessionStorage.getItem('phone')   || '—';
const country = sessionStorage.getItem('country') || '—';
const brand   = sessionStorage.getItem('brand')   || '—';
const issue   = sessionStorage.getItem('issue')   || '—';
const device  = sessionStorage.getItem('device')  || '—';

document.getElementById('tyName').textContent   = name;
document.getElementById('tyBrand').textContent  = brand;
document.getElementById('tyIssue').textContent  = issue;
document.getElementById('tyDevice').textContent = device;
document.getElementById('tyTicket').textContent = generateTicket();

sessionStorage.clear();