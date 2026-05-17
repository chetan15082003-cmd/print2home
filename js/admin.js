// =============================================
// ADMIN SETTINGS — CHANGE THESE!
// =============================================
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzaz8OPqtHJHuxXTmHawIY4RfY4ddJXalHIFCeFBhtF0x6Ia4ra9s2sPvhk3e19-ljqXQ/exec';
const RECOVERY_EMAIL = 'chetan15082003@gmail.com'; // Your email for password reset

// EmailJS Settings (for forgot password email)
const EMAILJS_SERVICE  = 'service_uox7aj6';
const EMAILJS_TEMPLATE = 'etvm9g5';
const EMAILJS_KEY      = '3cFcsb7TjIIUz_47-';
// =============================================

// Default credentials (stored in localStorage)
let ADMIN_USER = localStorage.getItem('adminUser') || 'admin';
let ADMIN_PASS = localStorage.getItem('adminPass') || 'print2home123';
let generatedCode = '';
let allTickets = [];

// Initialize EmailJS
emailjs.init(EMAILJS_KEY);

// ===== LOGIN =====
function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err  = document.getElementById('loginError');

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display  = 'block';
    sessionStorage.setItem('adminLoggedIn', 'yes');
    loadData();
  } else {
    err.textContent = '❌ Wrong username or password!';
    setTimeout(() => err.textContent = '', 3000);
  }
}

function doLogout() {
  sessionStorage.removeItem('adminLoggedIn');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminPanel').style.display  = 'none';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

// Auto-login check
if (sessionStorage.getItem('adminLoggedIn') === 'yes') {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display  = 'block';
  loadData();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (document.getElementById('loginForm').style.display !== 'none') doLogin();
  }
});

// ===== TOGGLE PASSWORD VISIBILITY =====
function togglePass(id, btn) {
  const input = document.getElementById(id);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

// ===== SHOW/HIDE FORMS =====
function showForgot() {
  document.getElementById('loginForm').style.display  = 'none';
  document.getElementById('forgotForm').style.display = 'block';
  document.getElementById('resetForm').style.display  = 'none';
  document.getElementById('successMsg').style.display = 'none';
}

function showLogin() {
  document.getElementById('loginForm').style.display  = 'block';
  document.getElementById('forgotForm').style.display = 'none';
  document.getElementById('resetForm').style.display  = 'none';
  document.getElementById('successMsg').style.display = 'none';
}

// ===== FORGOT PASSWORD — SEND CODE =====
async function sendResetCode() {
  const email = document.getElementById('recoveryEmail').value.trim();
  const err   = document.getElementById('forgotError');

  if (!email) {
    err.textContent = '❌ Please enter your email!';
    return;
  }

  if (email !== RECOVERY_EMAIL) {
    err.textContent = '❌ This email is not registered as admin email!';
    return;
  }

  // Generate 6-digit code
  generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

  const btn = document.querySelector('#forgotForm .login-btn');
  btn.textContent = '📧 Sending...';
  btn.disabled    = true;

  try {
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
      to_email:   email,
      reset_code: generatedCode,
      to_name:    'Admin',
      message:    `Your Print2Home Admin reset code is: ${generatedCode}\n\nThis code expires in 10 minutes.`
    });

    document.getElementById('forgotForm').style.display = 'none';
    document.getElementById('resetForm').style.display  = 'block';
    err.textContent = '';

  } catch(e) {
    err.textContent = '❌ Failed to send email. Check EmailJS settings.';
    btn.textContent = '📧 Send Reset Code';
    btn.disabled    = false;
  }
}

// ===== RESET PASSWORD =====
function resetPassword() {
  const code        = document.getElementById('resetCode').value.trim();
  const newPass     = document.getElementById('newPass').value;
  const confirmPass = document.getElementById('confirmPass').value;
  const err         = document.getElementById('resetError');

  if (!code) { err.textContent = '❌ Please enter the reset code!'; return; }
  if (code !== generatedCode) { err.textContent = '❌ Wrong reset code! Check your email.'; return; }
  if (!newPass) { err.textContent = '❌ Please enter a new password!'; return; }
  if (newPass.length < 6) { err.textContent = '❌ Password must be at least 6 characters!'; return; }
  if (newPass !== confirmPass) { err.textContent = '❌ Passwords do not match!'; return; }

  // Save new password
  ADMIN_PASS = newPass;
  localStorage.setItem('adminPass', newPass);

  // Show success
  document.getElementById('resetForm').style.display  = 'none';
  document.getElementById('successMsg').style.display = 'block';
  generatedCode = '';
}

// ===== CHANGE PASSWORD (from admin panel) =====
function showChangePass() {
  document.getElementById('changePassModal').style.display = 'flex';
}

function closeChangePass() {
  document.getElementById('changePassModal').style.display = 'none';
  document.getElementById('currentPass').value    = '';
  document.getElementById('modalNewPass').value   = '';
  document.getElementById('modalConfirmPass').value = '';
  document.getElementById('changePassError').textContent = '';
}

function changePassword() {
  const current = document.getElementById('currentPass').value;
  const newP    = document.getElementById('modalNewPass').value;
  const confirm = document.getElementById('modalConfirmPass').value;
  const err     = document.getElementById('changePassError');

  if (current !== ADMIN_PASS) { err.textContent = '❌ Current password is wrong!'; return; }
  if (!newP) { err.textContent = '❌ Enter a new password!'; return; }
  if (newP.length < 6) { err.textContent = '❌ Password must be 6+ characters!'; return; }
  if (newP !== confirm) { err.textContent = '❌ Passwords do not match!'; return; }

  ADMIN_PASS = newP;
  localStorage.setItem('adminPass', newP);
  closeChangePass();
  alert('✅ Password changed successfully!');
}

// ===== LOAD DATA =====
async function loadData() {
  try {
    const res  = await fetch(SHEET_API_URL);
    const json = await res.json();
    if (json.status === 'success') {
      allTickets = json.data.reverse();
      renderStats();
      renderBrandStats();
      renderTickets(allTickets);
    }
  } catch(e) {
    allTickets = [];
    renderStats();
    renderBrandStats();
    renderTickets([]);
  }
}

// ===== STATS =====
function renderStats() {
  document.getElementById('statTotal').textContent    = allTickets.length;
  document.getElementById('statOpen').textContent     = allTickets.filter(t => t.status === 'Open').length;
  document.getElementById('statProgress').textContent = allTickets.filter(t => t.status === 'In Progress').length;
  document.getElementById('statResolved').textContent = allTickets.filter(t => t.status === 'Resolved').length;
}

// ===== BRAND STATS =====
function renderBrandStats() {
  const brands = ['HP','Canon','Epson','Brother'];
  const colors = { HP:'#0096d6', Canon:'#e31b23', Epson:'#003087', Brother:'#003087' };
  document.getElementById('brandStats').innerHTML = brands.map(b => `
    <div class="brand-card">
      <div class="brand-circle" style="background:${colors[b]}">${b[0]}</div>
      <div class="brand-card-info">
        <strong>${allTickets.filter(t => t.brand === b).length}</strong>
        <span>${b} Tickets</span>
      </div>
    </div>`).join('');
}

// ===== RENDER TICKETS =====
function renderTickets(tickets) {
  const tbody = document.getElementById('ticketsBody');
  if (!tickets.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#6B7280">No tickets found.</td></tr>';
    return;
  }
  tbody.innerHTML = tickets.map((t, i) => `
    <tr>
      <td><span class="ticket-no">${t.ticket || '—'}</span></td>
      <td>
        <div class="customer-name">${t.name || '—'}</div>
        <div class="customer-email">${t.email || '—'}</div>
        <div class="customer-phone">${t.phone || '—'}</div>
      </td>
      <td><span class="brand-badge brand-${t.brand || 'default'}">${t.brand || '—'}</span></td>
      <td>${t.issue || '—'}</td>
      <td>${t.device || '—'}</td>
      <td><span class="status-badge status-${(t.status||'Open').replace(' ','')}">${t.status || 'Open'}</span></td>
      <td>${t.date || '—'}</td>
      <td>
        <button class="action-btn view" onclick="viewTicket(${i})">View →</button>
        <button class="action-btn resolve" onclick="resolveTicket(${i})">✓ Resolve</button>
      </td>
    </tr>`).join('');
}

// ===== VIEW & RESOLVE =====
function viewTicket(i) {
  const t = allTickets[i];
  alert(`TICKET: ${t.ticket}\nNAME:    ${t.name}\nEMAIL:   ${t.email}\nPHONE:   ${t.phone}\nCOUNTRY: ${t.country}\nBRAND:   ${t.brand}\nISSUE:   ${t.issue}\nDEVICE:  ${t.device}\nSTATUS:  ${t.status}\nDATE:    ${t.date}`);
}

async function resolveTicket(i) {
  const t = allTickets[i];
  if (!confirm(`Mark ${t.ticket} as Resolved?`)) return;
  allTickets[i].status = 'Resolved';
  renderStats();
  renderTickets(filterCurrent());
  try {
    await fetch(SHEET_API_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateStatus', ticket: t.ticket, status: 'Resolved' })
    });
  } catch(e) { console.log(e); }
}

// ===== FILTER =====
function filterCurrent() {
  const search = document.getElementById('searchBox').value.toLowerCase();
  const status = document.getElementById('filterStatus').value;
  const brand  = document.getElementById('filterBrand').value;
  return allTickets.filter(t => {
    const matchSearch = !search || [t.name,t.email,t.ticket,t.issue].some(v => (v||'').toLowerCase().includes(search));
    return matchSearch && (!status || t.status === status) && (!brand || t.brand === brand);
  });
}

function filterTickets() { renderTickets(filterCurrent()); }
// Payment System
function showPayment() {
  document.getElementById('paymentModal').style.display = 'flex';
}
function closePayment() {
  document.getElementById('paymentModal').style.display = 'none';
}

function sendPayment() {
  const name    = document.getElementById('payName').value.trim();
  const email   = document.getElementById('payEmail').value.trim();
  const amount  = document.getElementById('payAmount').value;
  const service = document.getElementById('payService').value;
  const method  = document.querySelector('input[name="payMethod"]:checked').value;
  const note    = document.getElementById('payNote').value;
  const err     = document.getElementById('payError');

  if (!name)   { err.textContent = '❌ Enter customer name!';   return; }
  if (!email)  { err.textContent = '❌ Enter customer email!';  return; }
  if (!amount) { err.textContent = '❌ Enter payment amount!';  return; }

  err.textContent = '';

  // Build payment link based on method
  let payLink = '';
  if (method === 'paypal') {
    payLink = `https://www.paypal.com/paypalme/print2home/${amount}`;
  } else if (method === 'card') {
    payLink = `https://buy.stripe.com/your-payment-link?amount=${amount*100}`;
  } else {
    payLink = '';
  }

  // Show success
  closePayment();
  document.getElementById('paySuccessMsg').innerHTML = `
    Payment request of <strong>$${amount}</strong> sent to <strong>${email}</strong><br>
    Method: ${method.toUpperCase()} | Service: ${service}
    ${payLink ? `<br><br><a href="${payLink}" target="_blank" style="color:#1A56DB;font-weight:700">Open Payment Link →</a>` : ''}
  `;
  document.getElementById('paySuccessModal').style.display = 'flex';
}