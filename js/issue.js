const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

const brand = sessionStorage.getItem('brand') || 'Unknown';
const brandDisplay = document.getElementById('brandDisplay');
if (brandDisplay) brandDisplay.textContent = brand;

let selectedIssue  = '';
let selectedDevice = '';

function selectIssue(btn) {
  document.querySelectorAll('.issue-grid .option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedIssue = btn.textContent.trim();
}

function selectDevice(btn) {
  document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedDevice = btn.textContent.trim();
}

function submitIssue() {
  if (!selectedIssue) {
    alert('Please select the type of printer issue!');
    return;
  }
  if (!selectedDevice) {
    alert('Please select your device type!');
    return;
  }
  sessionStorage.setItem('issue',  selectedIssue);
  sessionStorage.setItem('device', selectedDevice);
  window.location.href = 'details.html';
}