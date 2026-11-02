// สร้างภาพโซเชียลใหม่: node design/social/generate.js "$PWD/design"
const { chromium } = require('playwright'); const fs = require('fs');
const D = process.argv[2]; const OUT = D + '/social/';
const HEAD = fs.readFileSync(D + '/mascot-b-cheetah.svg', 'utf8').replace(/<svg /, '<svg class="head" ');
const BLUE = '#0b5cff', ORANGE = '#ff7a00', NAVY = '#0f1420', SOFT = '#e8f0ff', CREAM = '#fff4e3', LINEG = '#06c755';
const css = `*{box-sizing:border-box}body{margin:0;font-family:'Noto Sans Thai',sans-serif}
.f{position:relative;overflow:hidden;display:flex;flex-direction:column}
.head{display:block}.brand{font-weight:700}.brand b{color:#ffb03a}
.pill{display:inline-block;border-radius:999px;font-weight:700}
.line{background:${LINEG};color:#fff;border-radius:999px;font-weight:700;display:inline-flex;align-items:center;gap:.4em}
.dot{position:absolute;border-radius:50%}`;
const brandRow = (size, color = '#fff') => `<div style="display:flex;align-items:center;gap:${size*.3}px;color:${color}"><div style="width:${size*1.6}px;height:${size*1.6}px;background:#fff;border-radius:50%;display:grid;place-items:center">${HEAD.replace('class="head"', `class="head" width="${size*1.5}" height="${size*1.5}"`)}</div><span class="brand" style="font-size:${size}px">Rod<b>Wai</b> <span style="font-size:${size*.6}px;opacity:.85">รถไว</span></span></div>`;
const headBig = (px, bg = '#fff') => `<div style="width:${px}px;height:${px}px;background:${bg};border-radius:50%;display:grid;place-items:center;flex:none">${HEAD.replace('class="head"', `class="head" width="${px*.92}" height="${px*.92}"`)}</div>`;
const lineBtn = (fs) => `<span class="line" style="font-size:${fs}px;padding:${fs*.45}px ${fs*1.1}px">แอด LINE @216fjaks</span>`;

const T = {
'facebook-cover': [1640, 624, `<div class="f" style="width:1640px;height:624px;background:${BLUE};flex-direction:row;align-items:center;gap:56px;padding-left:380px;color:#fff">
  <div class="dot" style="width:520px;height:520px;background:#1a68ff;left:-120px;top:-160px"></div>
  ${headBig(380)}
  <div><div class="brand" style="font-size:88px">Rod<b>Wai</b> รถไว</div><div style="font-size:54px;font-weight:700">ขายรถไว ได้ราคาดี</div><div style="font-size:34px;opacity:.9">ให้เต็นท์แข่งกันเสนอราคา · rodwai.com</div></div></div>`],

'ig-01-intro': [1080, 1080, `<div class="f" style="width:1080px;height:1080px;background:${BLUE};color:#fff;padding:80px;justify-content:space-between">
  <div class="dot" style="width:700px;height:700px;background:#1a68ff;right:-260px;top:-200px"></div>
  ${brandRow(46)}
  <div style="position:relative"><div style="font-size:112px;font-weight:700;line-height:1.15">ขายรถไว<br><span style="color:#ffb03a">ได้ราคาดี</span></div>
  <div style="font-size:44px;margin-top:20px;opacity:.95">ส่งข้อมูลรถครั้งเดียว<br>ให้เต็นท์แข่งกันเสนอราคา</div></div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end">${lineBtn(40)}${headBig(300)}</div></div>`],

'ig-02-steps': [1080, 1080, `<div class="f" style="width:1080px;height:1080px;background:${SOFT};color:${NAVY};padding:72px">
  ${brandRow(40, NAVY)}
  <div style="font-size:72px;font-weight:700;margin:24px 0 20px">ขายรถง่ายๆ <span style="color:${BLUE}">4 ขั้นตอน</span></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;min-height:0">
  ${[['ส่งข้อมูลรถ','ยี่ห้อ รุ่น ปี เลขไมล์ พร้อมรูป ทาง LINE'],['เต็นท์เสนอราคา','เต็นท์พาร์ทเนอร์แข่งกันเสนอราคา'],['ตรวจสภาพถึงที่','นัดดูรถที่บ้านหรือที่ทำงาน ทั่ว กทม.'],['เลือกข้อเสนอ รับเงิน','เลือกราคาที่พอใจ โอนรถถูกต้อง']].map((s,i)=>`<div style="background:#fff;border-radius:28px;padding:26px 30px"><div style="width:72px;height:72px;border-radius:50%;background:${i==3?ORANGE:BLUE};color:#fff;font-size:40px;font-weight:700;display:grid;place-items:center">${i+1}</div><div style="font-size:44px;font-weight:700;margin-top:16px">${s[0]}</div><div style="font-size:30px;color:#5b6474;margin-top:6px">${s[1]}</div></div>`).join('')}
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">${lineBtn(34)}<span style="font-size:32px;font-weight:700;color:${BLUE}">rodwai.com</span></div></div>`],

'ig-03-finance': [1080, 1080, `<div class="f" style="width:1080px;height:1080px;background:${ORANGE};color:#fff;padding:80px;justify-content:space-between">
  <div class="dot" style="width:640px;height:640px;background:#ff8f26;left:-220px;bottom:-240px"></div>
  ${brandRow(44)}
  <div style="position:relative"><div class="pill" style="background:#fff;color:${ORANGE};font-size:36px;padding:8px 28px">ผ่อนยังไม่หมด?</div>
  <div style="font-size:110px;font-weight:700;line-height:1.15;margin-top:24px">รถติดไฟแนนซ์<br>ก็ขายได้</div>
  <div style="font-size:42px;margin-top:20px">ช่วยประสานปิดยอดกับไฟแนนซ์<br>ส่วนต่างที่เหลือโอนให้คุณ</div></div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative">${lineBtn(40)}${headBig(280)}</div></div>`],

'ig-04-documents': [1080, 1080, `<div class="f" style="width:1080px;height:1080px;background:#fff;color:${NAVY};padding:72px;border:24px solid ${BLUE}">
  ${brandRow(38, NAVY)}
  <div style="font-size:70px;font-weight:700;margin:32px 0 8px">ขายรถต้องใช้<br><span style="color:${BLUE}">เอกสารอะไรบ้าง?</span></div>
  <div style="font-size:42px;line-height:1.75;margin-top:16px;flex:1">
  ${['เล่มทะเบียนรถตัวจริง','บัตรประชาชนเจ้าของรถ + สำเนา','ภาษีรถไม่ขาด / พ.ร.บ.','กุญแจสำรองครบ','สมุดประวัติเข้าศูนย์ (ถ้ามี)'].map(x=>`<div><span style="color:${LINEG};font-weight:700">✓</span> ${x}</div>`).join('')}
  </div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="font-size:30px;color:#5b6474">อ่านฉบับเต็มที่ rodwai.com/blog</div>${headBig(200, SOFT)}</div></div>`],

'ig-05-dealer': [1080, 1080, `<div class="f" style="width:1080px;height:1080px;background:${NAVY};color:#fff;padding:80px;justify-content:space-between">
  <div class="dot" style="width:600px;height:600px;background:#1b2335;right:-200px;top:-180px"></div>
  ${brandRow(44)}
  <div style="position:relative"><div class="pill" style="background:${ORANGE};font-size:36px;padding:8px 28px">สำหรับเต็นท์รถมือสอง</div>
  <div style="font-size:100px;font-weight:700;line-height:1.15;margin-top:24px">หารถเข้าเต็นท์<br><span style="color:#ffb03a">ง่ายขึ้น</span></div>
  <div style="font-size:40px;margin-top:20px;color:#c9d1de">รับข้อมูลรถจากเจ้าของโดยตรงใน กทม.<br>พร้อมรูป เสนอราคาเฉพาะคันที่สนใจ</div></div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative"><div><div style="font-size:44px;font-weight:700">สมัครพาร์ทเนอร์ฟรี</div><div style="font-size:34px;color:#ffb03a">rodwai.com/dealer</div></div>${headBig(260)}</div></div>`],

'story-01-sell': [1080, 1920, `<div class="f" style="width:1080px;height:1920px;background:${BLUE};color:#fff;padding:120px 80px;align-items:center;text-align:center;justify-content:space-between">
  <div class="dot" style="width:900px;height:900px;background:#1a68ff;left:-300px;top:-300px"></div>
  <div style="position:relative">${brandRow(52)}</div>
  <div style="position:relative">${headBig(520)}</div>
  <div style="position:relative"><div style="font-size:120px;font-weight:700;line-height:1.15">ขายรถไว<br><span style="color:#ffb03a">ได้ราคาดี</span></div>
  <div style="font-size:48px;margin-top:24px">ให้เต็นท์แข่งกันเสนอราคา<br>ฟรี ไม่มีข้อผูกมัด</div></div>
  <div style="position:relative">${lineBtn(52)}<div style="font-size:40px;margin-top:24px;opacity:.9">หรือ rodwai.com</div></div></div>`],

'story-02-dealer': [1080, 1920, `<div class="f" style="width:1080px;height:1920px;background:${NAVY};color:#fff;padding:120px 80px;align-items:center;text-align:center;justify-content:space-between">
  <div style="position:relative">${brandRow(52)}</div>
  <div>${headBig(460)}</div>
  <div><div class="pill" style="background:${ORANGE};font-size:44px;padding:10px 36px">เต็นท์รถมือสอง</div>
  <div style="font-size:112px;font-weight:700;line-height:1.15;margin-top:28px">หารถเข้าเต็นท์<br><span style="color:#ffb03a">กับ RodWai</span></div>
  <div style="font-size:46px;margin-top:24px;color:#c9d1de">รถจากเจ้าของโดยตรง พร้อมรูปและข้อมูล</div></div>
  <div><span class="line" style="font-size:52px;padding:22px 56px;background:${ORANGE}">สมัครฟรี rodwai.com/dealer</span></div></div>`],

'line-richmenu-2500x1686': [2500, 1686, `<div class="f" style="width:2500px;height:1686px;background:${SOFT};display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:12px;padding:12px">
  ${[['ประเมินราคาฟรี','ส่งข้อมูลรถ รับราคา',BLUE,'#fff',true],['ขายรถติดไฟแนนซ์','ผ่อนไม่หมดก็ขายได้',ORANGE,'#fff'],['ขั้นตอนขายรถ','4 ขั้นตอนง่ายๆ','#fff',NAVY],['เอกสารที่ต้องใช้','เช็กลิสต์ก่อนโอน','#fff',NAVY],['สำหรับเต็นท์รถ','สมัครพาร์ทเนอร์',NAVY,'#fff'],['เว็บไซต์','rodwai.com','#fff',BLUE]].map(c=>`<div style="background:${c[2]};color:${c[3]};border-radius:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:18px">${c[4]?headBig(300,'#fff'):''}<div style="font-size:${c[0].length>12?86:100}px;font-weight:700;line-height:1.1">${c[0]}</div><div style="font-size:60px;opacity:.85">${c[1]}</div></div>`).join('')}
  </div>`],

'line-cover-1080x878': [1080, 878, `<div class="f" style="width:1080px;height:878px;background:${BLUE};color:#fff;align-items:center;justify-content:center;text-align:center;gap:20px">
  <div class="dot" style="width:600px;height:600px;background:#1a68ff;right:-200px;bottom:-260px"></div>
  ${headBig(340)}
  <div style="position:relative"><div style="font-size:84px;font-weight:700">ขายรถไว <span style="color:#ffb03a">ได้ราคาดี</span></div><div style="font-size:40px;opacity:.95">ให้เต็นท์แข่งกันเสนอราคา · กรุงเทพฯ</div></div></div>`],

'profile-640': [640, 640, `<div class="f" style="width:640px;height:640px;background:${SOFT};align-items:center;justify-content:center">${HEAD.replace('class="head"','class="head" width="560" height="560"')}</div>`],
};

(async () => {
  const b = await chromium.launch();
  for (const [name, [w, h, html]] of Object.entries(T)) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700&display=swap" rel="stylesheet"><style>${css}</style></head><body>${html}</body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: OUT + name + '.png' }); await p.close();
  }
  // contact sheet
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const imgs = Object.keys(T).map(n => `<figure style="margin:0"><img src="file://${OUT}${n}.png" style="max-width:100%;max-height:300px;display:block;border:1px solid #ddd"><figcaption style="font:14px sans-serif">${n}</figcaption></figure>`).join('');
  await p.setContent(`<body style="margin:16px;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;background:#f3f6fb">${imgs}</body>`);
  await p.waitForTimeout(800); await p.screenshot({ path: D + '/social-sheet.png', fullPage: true });
  await b.close();
})();
