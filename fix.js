const fs = require('fs');

const files = [
  'index.html','issue.html','details.html','thankyou.html',
  'about.html','pricing.html','privacy.html','terms.html',
  'printer-setup.html','troubleshooting.html','wifi-support.html',
  'ink-help.html','buying-guides.html'
];

files.forEach(file => {
  if (!fs.existsSync(file)) { console.log('Skipped: ' + file); return; }
  let c = fs.readFileSync(file, 'utf8');

  // Remove social media buttons
  c = c.replace(/<div class="footer-socials">[\s\S]*?<\/div>/g, '');

  fs.writeFileSync(file, c, 'utf8');
  console.log('✅ Fixed: ' + file);
});

console.log('\n🎉 Social buttons removed!');
