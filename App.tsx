<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>فلتر آيفون ١٧</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#f2f2f4;--card:#fff;--tx:#1c1c1e;--mut:#6c6c70;--ac:#0a84ff;--bd:#d8d8dc;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#000;--card:#1c1c1e;--tx:#f2f2f7;--mut:#98989f;--ac:#409cff;--bd:#38383a}}
:root[data-theme="dark"]{--bg:#000;--card:#1c1c1e;--tx:#f2f2f7;--mut:#98989f;--ac:#409cff;--bd:#38383a}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font-family:'Cairo',-apple-system,system-ui,'Segoe UI',Tahoma,sans-serif;line-height:1.6}
.wrap{max-width:560px;margin:0 auto;padding:20px 16px 40px}
h1{font-size:1.7rem;margin:8px 0 4px;font-weight:700}
.sub{color:var(--mut);margin:0 0 18px;font-size:.95rem}
.pick{display:block;border:2px dashed var(--bd);border-radius:18px;padding:28px 16px;text-align:center;background:var(--card);cursor:pointer;font-weight:600}
.pick:focus-within{outline:2px solid var(--ac)}
.pick input{position:absolute;opacity:0;width:1px;height:1px}
.stage{margin-top:16px;display:none}
.stage.on{display:block}
.frame{position:relative;background:var(--card);border-radius:18px;overflow:hidden;border:1px solid var(--bd)}
.frame img{display:block;width:100%;height:auto;-webkit-touch-callout:default}
.tag{position:absolute;top:10px;inset-inline-start:10px;background:rgba(0,0,0,.6);color:#fff;font-size:.8rem;padding:2px 10px;border-radius:99px}
.busy{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.35);color:#fff;font-weight:600}
.busy.on{display:flex}
.panel{background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:14px 16px;margin-top:12px}
.row{display:flex;align-items:center;gap:12px;margin:8px 0}
.row label{flex:0 0 92px;font-size:.92rem}
.row input[type=range]{flex:1;accent-color:var(--ac);min-width:0}
.row output{flex:0 0 36px;text-align:end;color:var(--mut);font-size:.85rem}
select{flex:1;font:inherit;padding:8px;border-radius:10px;border:1px solid var(--bd);background:var(--bg);color:var(--tx)}
.btns{display:flex;gap:10px;margin-top:12px}
button{flex:1;font:inherit;font-weight:600;padding:12px;border-radius:14px;border:0;background:var(--ac);color:#fff;cursor:pointer;touch-action:manipulation;-webkit-user-select:none;user-select:none}
button.alt{background:var(--card);color:var(--tx);border:1px solid var(--bd)}
button:focus-visible{outline:3px solid var(--ac);outline-offset:2px}
.hint{color:var(--mut);font-size:.85rem;margin:12px 2px 0}
</style>
</head>
<body>
<div class="wrap">
  <h1>فلتر آيفون ١٧</h1>
  <p class="sub">ارفع صورتك، ونعطيها ألوان وحدّة بأسلوب كاميرا آيفون، مع رفع الجودة.</p>

  <label class="pick">
    <input type="file" id="f" accept="image/*">
    اختر صورة من جهازك
  </label>

  <div class="stage" id="stage">
    <div class="frame">
      <img id="out" alt="الصورة بعد التحسين">
      <span class="tag" id="tag">بعد</span>
      <div class="busy" id="busy">جارٍ المعالجة…</div>
    </div>

    <div class="panel">
      <div class="row"><label for="amt">قوة الفلتر</label><input type="range" id="amt" min="0" max="100" value="70"><output id="amtO">70</output></div>
      <div class="row"><label for="shp">الحدّة</label><input type="range" id="shp" min="0" max="100" value="45"><output id="shpO">45</output></div>
      <div class="row"><label for="up">رفع الدقة</label>
        <select id="up"><option value="1">بدون</option><option value="2" selected>مرتين (٢×)</option></select>
      </div>
      <div class="btns">
        <button class="alt" id="cmp">اضغط مطولاً للمقارنة</button>
        <button id="share" hidden>مشاركة / حفظ</button>
      </div>
      <p class="hint">لحفظ الصورة: اضغط عليها مطولاً واختر «حفظ في الصور». المعالجة تتم على جهازك والصورة لا تُرفع لأي مكان.</p>
    </div>
  </div>
</div>

<script>
const $ = id => document.getElementById(id);
let src = null, origURL = '', resURL = '', blob = null, timer = 0;

$('f').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const fr = new FileReader();
  fr.onload = () => {
    const im = new Image();
    im.onload = () => { src = im; origURL = fr.result; $('stage').classList.add('on'); schedule(0); };
    im.onerror = () => alert('تعذّر فتح الصورة، جرّب صورة ثانية.');
    im.src = fr.result;
  };
  fr.readAsDataURL(file);
});

['amt', 'shp'].forEach(id => $(id).addEventListener('input', () => { $(id + 'O').textContent = $(id).value; schedule(200); }));
$('up').addEventListener('change', () => schedule(0));

function schedule(ms) {
  clearTimeout(timer);
  $('busy').classList.add('on');
  timer = setTimeout(run, ms + 30);
}

function run() {
  if (!src) return;
  const k = +$('amt').value / 100, sh = +$('shp').value / 100, M = 4096;
  const W0 = src.naturalWidth, H0 = src.naturalHeight;
  const s = Math.min(+$('up').value, M / Math.max(W0, H0));
  const w = Math.round(W0 * s), h = Math.round(H0 * s);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
  x.drawImage(src, 0, 0, w, h);
  const id = x.getImageData(0, 0, w, h), d = id.data;

  // iPhone-style tone: lifted shadows, gentle contrast, richer colour, slightly warm
  const con = 1 + 0.16 * k, sat = 1 + 0.2 * k;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2];
    const l0 = .299 * r + .587 * g + .114 * b;
    const lift = Math.pow(1 - l0 / 255, 2) * 16 * k + 4 * k;
    r = (r - 128) * con + 128 + lift + 6 * k;
    g = (g - 128) * con + 128 + lift;
    b = (b - 128) * con + 128 + lift - 5 * k;
    const l = .299 * r + .587 * g + .114 * b;
    d[i] = l + (r - l) * sat; d[i + 1] = l + (g - l) * sat; d[i + 2] = l + (b - l) * sat;
  }

  // sharpening (3x3)
  if (sh > 0) {
    const a = sh * 0.8, o = new Uint8ClampedArray(d), st = w * 4;
    for (let y = 1; y < h - 1; y++) {
      for (let p = y * st + 4, e = p + st - 8; p < e; p += 4) {
        for (let ch = 0; ch < 3; ch++) {
          const q = p + ch;
          d[q] = o[q] * (1 + 4 * a) - a * (o[q - 4] + o[q + 4] + o[q - st] + o[q + st]);
        }
      }
    }
  }

  x.putImageData(id, 0, 0);
  resURL = c.toDataURL('image/jpeg', 0.95);
  $('out').src = resURL;
  $('tag').textContent = 'بعد';
  $('busy').classList.remove('on');
  c.toBlob(b => { blob = b; }, 'image/jpeg', 0.95);
}

// hold to compare
const cmp = $('cmp');
const showOrig = () => { if (origURL) { $('out').src = origURL; $('tag').textContent = 'قبل'; } };
const showRes = () => { if (resURL) { $('out').src = resURL; $('tag').textContent = 'بعد'; } };
cmp.addEventListener('pointerdown', showOrig);
['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => cmp.addEventListener(ev, showRes));
cmp.addEventListener('contextmenu', e => e.preventDefault());

// share (when the browser supports sharing files)
(async () => {
  try {
    const t = new File([new Blob(['x'])], 't.jpg', { type: 'image/jpeg' });
    if (navigator.canShare && navigator.canShare({ files: [t] })) $('share').hidden = false;
  } catch (e) {}
})();
$('share').addEventListener('click', async () => {
  if (!blob) return;
  try {
    await navigator.share({ files: [new File([blob], 'iphone17-photo.jpg', { type: 'image/jpeg' })] });
  } catch (e) { /* cancelled or blocked: long-press the image instead */ }
});
</script>
</body>
</html>
