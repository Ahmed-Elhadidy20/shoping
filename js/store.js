// ============================================================
//   متجر الحديدي — store.js
//   السلة + المنتجات + الفلتر + إضافة منتج
// ============================================================

let cart     = JSON.parse(localStorage.getItem('hd_cart')     || '[]');
let products = JSON.parse(localStorage.getItem('hd_products') || '[]');
let currentImgData = '';

// ===== منتجات افتراضية عند أول تشغيل =====
const defaultProducts = [
  { id:1, name:'حذاء رياضي كلاسيك',  price:349, cat:'أحذية',      desc:'حذاء رياضي مريح ومتين لكل المناسبات', img:'./images/1.png'  },
  { id:2, name:'حقيبة يد أنيقة',       price:189, cat:'حقائب',      desc:'حقيبة بتصميم عصري وخامة فاخرة',       img:'./images/2.webp' },
  { id:3, name:'حذاء كاجوال',          price:275, cat:'أحذية',      desc:'حذاء يومي خفيف ومريح',                 img:'./images/3.webp' },
  { id:4, name:'حذاء جلد كلاسيكي',    price:420, cat:'أحذية',      desc:'حذاء كلاسيكي للمناسبات الرسمية',       img:'./images/4.webp' },
  { id:5, name:'حقيبة ظهر رياضية',    price:159, cat:'حقائب',      desc:'حقيبة ظهر واسعة ومريحة للسفر',         img:'./images/5.webp' },
  { id:6, name:'حذاء صيفي',            price:199, cat:'أحذية',      desc:'حذاء صيفي خفيف مثالي للإجازات',        img:'./images/6.webp' },
  { id:7, name:'محفظة جلد',            price:120, cat:'محافظ',      desc:'محفظة من الجلد الطبيعي عالي الجودة',   img:'./images/7.webp' },
  { id:8, name:'ساعة ذكية',            price:799, cat:'إكسسوارات', desc:'ساعة ذكية بمميزات متقدمة وتصميم أنيق', img:'./images/8.png'  },
];

function init() {
  if (products.length === 0) {
    products = defaultProducts;
    saveProducts();
  }
  renderFilters();
  renderProducts('الكل');
  updateCartUI();
}

// ===== حفظ =====
function saveProducts() { localStorage.setItem('hd_products', JSON.stringify(products)); }
function saveCart()     { localStorage.setItem('hd_cart',     JSON.stringify(cart));     }

// ===== عرض المنتجات =====
function renderProducts(cat) {
  const grid = document.getElementById('products-grid');
  const list = cat === 'الكل' ? products : products.filter(p => p.cat === cat);

  if (list.length === 0) {
    grid.innerHTML = `<div class="no-products"><i class="fa-solid fa-box-open"></i><p>لا توجد منتجات في هذه الفئة</p></div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="card">
      <img src="${p.img || ''}" alt="${p.name}"
           onerror="this.src='https://via.placeholder.com/260x220?text=منتج'">
      <div class="content">
        <div class="cat-label">${p.cat}</div>
        <h2 class="title">${p.name}</h2>
        <p class="descrption">${p.desc || ''}</p>
        <div class="flex">
          <div class="price">${Number(p.price).toLocaleString('ar-EG')} ج.م</div>
          <button id="btn-${p.id}" onclick="addToCart(${p.id})" class="flex">
            <i class="fa-solid fa-cart-plus"></i> أضف للسلة
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// ===== فلتر الفئات =====
function renderFilters() {
  const cats = ['الكل', ...new Set(products.map(p => p.cat))];
  const bar = document.getElementById('filter-bar');
  bar.innerHTML = cats.map((c, i) =>
    `<button class="filter-btn ${i===0?'active':''}" onclick="filterProducts('${c}', this)">${c}</button>`
  ).join('');
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ===== إضافة منتج =====
function previewFromUrl(url) {
  currentImgData = '';
  const box = document.getElementById('url-preview');
  if (url) {
    box.innerHTML = `<img src="${url}" onerror="this.parentElement.innerHTML='<span>رابط الصورة غير صالح</span>'">`;
  } else {
    box.innerHTML = `<span><i class="fa-regular fa-image"></i> معاينة الصورة</span>`;
  }
}

function previewFromFile(input) {
  if (!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentImgData = e.target.result;
    document.getElementById('url-preview').innerHTML = `<img src="${currentImgData}">`;
    document.getElementById('inp-img-url').value = '';
  };
  reader.readAsDataURL(input.files[0]);
}

function addProduct() {
  const name  = document.getElementById('inp-name').value.trim();
  const price = parseFloat(document.getElementById('inp-price').value);
  const cat   = document.getElementById('inp-cat').value;
  const desc  = document.getElementById('inp-desc').value.trim();
  const imgUrl= document.getElementById('inp-img-url').value.trim();
  const img   = currentImgData || imgUrl;

  if (!name)            { showToast('⚠️ من فضلك أدخل اسم المنتج'); return; }
  if (!price || price<=0) { showToast('⚠️ من فضلك أدخل سعراً صحيحاً'); return; }

  const newP = { id: Date.now(), name, price, cat, desc: desc || 'منتج عالي الجودة', img };
  products.unshift(newP);
  saveProducts();
  renderFilters();
  renderProducts('الكل');

  // reset الفورم
  document.getElementById('inp-name').value  = '';
  document.getElementById('inp-price').value = '';
  document.getElementById('inp-desc').value  = '';
  document.getElementById('inp-img-url').value = '';
  document.getElementById('inp-img-file').value = '';
  document.getElementById('url-preview').innerHTML = `<span><i class="fa-regular fa-image"></i> معاينة الصورة</span>`;
  currentImgData = '';

  // فعّل فلتر "الكل"
  const allBtn = document.querySelector('.filter-btn');
  if (allBtn) { document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); allBtn.classList.add('active'); }

  showToast('✅ تم إضافة المنتج بنجاح!');
  document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
}

// ===== السلة =====
function addToCart(pid) {
  const p = products.find(x => x.id === pid);
  if (!p) return;
  const existing = cart.find(x => x.id === pid);
  if (existing) { existing.qty++; }
  else { cart.push({ ...p, qty: 1 }); }
  saveCart();
  updateCartUI();

  const btn = document.getElementById('btn-' + pid);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> تمت الإضافة';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> أضف للسلة';
    }, 1500);
  }
  showToast('تمت إضافة "' + p.name + '" للسلة');
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  showToast('تم إفراغ السلة');
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  // الهيدر
  const headerTotal = document.getElementById('header-total');
  const headerCount = document.getElementById('header-count');
  if (headerTotal) headerTotal.textContent = total.toLocaleString('ar-EG') + ' ج.م';
  if (headerCount) headerCount.textContent = count;

  // الـ drawer
  const body   = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty-state"><i class="fa-solid fa-cart-shopping"></i><p>السلة فارغة</p></div>`;
    if (footer) footer.style.display = 'none';
  } else {
    body.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img || ''}" alt="${item.name}"
             onerror="this.src='https://via.placeholder.com/58?text=منتج'">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${(item.price * item.qty).toLocaleString('ar-EG')} ج.م</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="btn-del-item" onclick="removeFromCart(${item.id})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    if (footer) {
      footer.style.display = 'block';
      const shipping = total >= 99 ? 'مجاني' : '30 ج.م';
      const grand    = total >= 99 ? total : total + 30;
      document.getElementById('cart-subtotal').textContent    = total.toLocaleString('ar-EG') + ' ج.م';
      document.getElementById('cart-shipping').textContent    = shipping;
      document.getElementById('cart-grand-total').textContent = grand.toLocaleString('ar-EG') + ' ج.م';
    }
  }
}

// ===== فتح/إغلاق drawer =====
function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== Toast =====
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-text').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== ابدأ =====
init();
