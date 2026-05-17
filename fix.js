const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const images = [
  {
    name: 'hp-smart-tank-5103.jpg',
    url:  'https://www.hp.com/h20195/v2/getpdf.aspx?docname=c08350695&section=c08350695&content-type=image/png'
  },
  {
    name: 'hp-smart-tank-5101.jpg',
    url:  'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6474/6474824_sd.jpg'
  },
  {
    name: 'hp-deskjet-2855e.jpg',
    url:  'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6501/6501538_sd.jpg'
  },
  {
    name: 'brother-hl-l2350dw.jpg',
    url:  'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6287/6287823_sd.jpg'
  },
  {
    name: 'hp-color-laserjet-m255dw.jpg',
    url:  'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6453/6453018_sd.jpg'
  },
  {
    name: 'brother-mfc-j4335dw.jpg',
    url:  'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6501/6501900_sd.jpg'
  }
];

function download(url, filepath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) { reject(new Error('Too many redirects')); return; }
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(filepath, () => {});
        download(res.headers.location, filepath, redirectCount + 1).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error('Status: ' + res.statusCode));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  if (!fs.existsSync('images/printers')) {
    fs.mkdirSync('images/printers', { recursive: true });
  }

  for (const img of images) {
    const filepath = path.join('images', 'printers', img.name);
    try {
      await download(img.url, filepath);
      console.log('✅ Downloaded: ' + img.name);
    } catch(err) {
      console.log('❌ Failed: ' + img.name + ' — ' + err.message);
    }
  }
  console.log('\n🎉 Done!');
}

downloadAll();