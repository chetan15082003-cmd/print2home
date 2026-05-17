const fs = require('fs');

const disclaimer = `  <!-- DISCLAIMER BOX -->
  <div style="background:#0f172a;padding:16px 0 0">
    <div style="max-width:1180px;margin:0 auto;padding:0 24px 20px">
      <div style="border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:18px 24px">
        <p style="color:rgba(255,255,255,0.6);font-size:0.82rem;line-height:1.7;margin:0;font-family:Inter,sans-serif">
          <strong style="color:rgba(255,255,255,0.85)">Disclaimer:</strong> Print2Home operates as an independent third-party help site. We are not affiliated with, endorsed by, or connected to any printer brands shown here. We provide troubleshooting guides and expert tips to help fix printer issues. We are not liable for any damage that may occur while following our instructions.
        </p>
      </div>
    </div>
  </div>`;

const files = [
  'index.html','issue.html','details.html','thankyou.html',
  'about.html','pricing.html','privacy.html','terms.html',
  'printer-setup.html','troubleshooting.html','wifi-support.html',
  'ink-help.html','buying-guides.html','guide-hp-deskjet.html',
  'guide-hp-smart-tank-5103.html','guide-hp-smart-tank-5101.html',
  'guide-canon-pixma.html','guide-epson-ecotank.html',
  'guide-brother-laser.html','guide-hp-color-laser.html',
  'guide-canon-imageclass.html','guide-epson-workforce.html',
  'guide-brother-inkjet.html'
];

files.forEach(file => {
  if (!fs.existsSync(file)) { console.log('Skipped: ' + file); return; }
  let c = fs.readFileSync(file, 'utf8');

  // Remove old disclaimer
  c = c.replace(/\s*<!-- DISCLAIMER[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');
  c = c.replace(/\s*<div class="disclaimer-footer">[\s\S]*?<\/div>/g, '');

  // Add disclaimer just before footer-bottom div
  c = c.replace(
    /<div class="footer-bottom">/g,
    disclaimer + '\n  <div class="footer-bottom">'
  );

  fs.writeFileSync(file, c, 'utf8');
  console.log('✅ Fixed: ' + file);
});

console.log('\n🎉 Disclaimer added to all pages!');