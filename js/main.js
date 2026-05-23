function selectAndGo(brand) {
  animateAndGo(null, brand);
}

function animateAndGo(el, brand) {
  sessionStorage.setItem('brand', brand);

  // Show overlay
  const overlay = document.getElementById('brandOverlay');
  const name    = document.getElementById('brandOverlayName');

  if (overlay && name) {
    name.textContent = brand.toUpperCase() + ' SUPPORT';
    overlay.style.display        = 'flex';
    overlay.style.animation      = 'overlayIn 0.3s ease forwards';
    overlay.style.background     = brand === 'HP'      ? '#0096d6' :
                                   brand === 'Canon'   ? '#e31b23' :
                                   brand === 'Epson'   ? '#00539b' :
                                   brand === 'Brother' ? '#003087' : '#1A56DB';
  }

  setTimeout(function() {
    window.location.href = 'issue.html';
  }, 1800);
}

// Hamburger
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger) {
  hamburger.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
  });
}
