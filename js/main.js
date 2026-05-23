function selectAndGo(brand) {
  sessionStorage.setItem('brand', brand);
  window.location.href = 'issue.html';
}
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

function getBrandHelp() {
  const selected = document.querySelector('input[name="brand"]:checked');
  if (!selected) {
    alert('Please select your printer brand first!');
    return;
  }
  sessionStorage.setItem('brand', selected.value);
  window.location.href = 'issue.html';
}

document.querySelectorAll('input[name="brand"]').forEach(input => {
  input.addEventListener('change', function() {
    document.getElementById('selectedBrandText').textContent =
      '✅ ' + this.value + ' selected — click GET HELP NOW';
  });
});
