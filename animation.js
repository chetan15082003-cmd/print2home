// Wait for page to fully load
window.addEventListener('load', function() {

  // Create overlay HTML directly
  var overlay = document.createElement('div');
  overlay.id = 'brandOverlay';
  overlay.innerHTML = `
    <div id="overlayInner" style="
      position:fixed;
      top:0;left:0;
      width:100vw;height:100vh;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      z-index:999999;
      opacity:0;
      transition:opacity 0.3s ease;
    ">
      <div id="overlayBrandName" style="
        font-size:3.5rem;
        font-weight:900;
        color:white;
        letter-spacing:4px;
        margin-bottom:30px;
        text-shadow:0 4px 20px rgba(0,0,0,0.3);
      ">HP SUPPORT</div>

      <div style="display:flex;gap:16px;margin-bottom:30px">
        <div id="dot1" style="width:20px;height:20px;border-radius:50%;background:white;"></div>
        <div id="dot2" style="width:20px;height:20px;border-radius:50%;background:white;"></div>
        <div id="dot3" style="width:20px;height:20px;border-radius:50%;background:white;"></div>
      </div>

      <div style="
        color:rgba(255,255,255,0.9);
        font-size:1.2rem;
        font-weight:600;
        letter-spacing:1px;
      ">Connecting to expert support...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Animate dots
  var dots = [
    document.getElementById('dot1'),
    document.getElementById('dot2'),
    document.getElementById('dot3')
  ];
  var dotIndex = 0;
  setInterval(function() {
    dots.forEach(function(d) {
      if(d) d.style.transform = 'translateY(0)';
      if(d) d.style.opacity = '0.3';
    });
    if(dots[dotIndex]) {
      dots[dotIndex].style.transform = 'translateY(-20px)';
      dots[dotIndex].style.opacity = '1';
    }
    dotIndex = (dotIndex + 1) % 3;
  }, 300);

  // Main function
  window.animateAndGo = function(el, brand) {
    sessionStorage.setItem('brand', brand);

    var colors = {
      'HP':      '#0096d6',
      'Canon':   '#e31b23',
      'Epson':   '#00539b',
      'Brother': '#003087'
    };

    var inner = document.getElementById('overlayInner');
    var name  = document.getElementById('overlayBrandName');

    if(inner && name) {
      inner.style.background = colors[brand] || '#1A56DB';
      name.textContent = brand.toUpperCase() + ' SUPPORT';
      inner.style.opacity = '1';
    }

    setTimeout(function() {
      window.location.href = 'issue.html';
    }, 2000);
  };

  window.selectAndGo = window.animateAndGo;

});
