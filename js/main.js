// ===== BRAND SELECTION WITH ANIMATION =====
function selectAndGo(brand) {
  animateAndGo(null, brand);
}

function animateAndGo(el, brand) {
  sessionStorage.setItem('brand', brand);

  // Create full screen overlay
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <div style="
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(26,86,219,0.95);
      z-index:99999;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      animation:fadeInOverlay 0.3s ease forwards;
    ">
      <div style="
        width:120px;height:120px;border-radius:50%;
        border:6px solid white;border-top-color:transparent;
        animation:spin 0.8s linear infinite;
        margin-bottom:24px;
      "></div>
      <h2 style="color:white;font-size:1.8rem;font-weight:900;margin:0 0 8px">
        ${brand} Support
      </h2>
      <p style="color:rgba(255,255,255,0.8);font-size:1rem;margin:0">
        Loading your support page...
      </p>
    </div>
  `;

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOverlay {
      from { opacity:0; transform:scale(0.9); }
      to   { opacity:1; transform:scale(1); }
    }
    @keyframes spin {
      from { transform:rotate(0deg); }
      to   { transform:rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  // Navigate after animation
  setTimeout(function() {
    window.location.href = 'issue.html';
  }, 1500);
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if(hamburger) {
  hamburger.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
  });
}
