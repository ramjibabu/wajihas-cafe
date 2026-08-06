/* ==========================================================================
   WAJIHA'S CAFE - Core Application & Animation Logic
   Lenis Smooth Scroll, GSAP ScrollTrigger, Menu Data Engine, Lightbox
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. LENIS SMOOTH SCROLL INITIALIZATION
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0, 0);
    }
  }

  // 2. PRELOADER & HERO FADE-IN TIMELINE
  const preloader = document.getElementById('preloader');
  const loaderPercent = document.getElementById('loader-percent');
  let count = 0;

  const countInterval = setInterval(() => {
    count += Math.floor(Math.random() * 3) + 2;
    if (count >= 100) {
      count = 100;
      clearInterval(countInterval);
      setTimeout(finishPreloader, 400);
    }
    if (loaderPercent) loaderPercent.textContent = count;
  }, 50);

  function finishPreloader() {
    if (preloader) preloader.classList.add('loaded');

    // GSAP Hero Entrance Animations
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to('.hero-badge', { opacity: 1, y: 0, duration: 1 })
        .to('.hero-title', { opacity: 1, y: 0, duration: 1.2 }, '-=0.6')
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1 }, '-=0.8')
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
    }
  }

  // 3. CUSTOM CURSOR LOGIC
  const cursorDot = document.getElementById('cursor-dot');
  const cursorFollower = document.getElementById('cursor-follower');

  if (cursorDot && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function renderCursor() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .menu-item-card, .gallery-item, .cat-tab');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

  // 4. NAVBAR STICKY & SCROLL EFFECTS
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });

    const mobileClose = document.getElementById('mobile-close');
    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    }
  }

  // 5. OFFICIAL MENU DATA ENGINE (Exact items from uploaded menu board)
  const menuItemsData = [
    // HOT DRINKS
    { name: 'Tea', price: '₹15', category: 'hot-drinks', desc: 'Classic soothing hot milk tea infused with aromatic cardamom.', isBestseller: false },
    { name: 'Black Tea', price: '₹15', category: 'hot-drinks', desc: 'Pure hot black tea brew with subtle notes of natural tea leaves.', isBestseller: false },
    { name: 'Black Coffee', price: '₹15', category: 'hot-drinks', desc: 'Bold, dark espresso brew to ignite your senses.', isBestseller: true },
    { name: 'Milk', price: '₹20', category: 'hot-drinks', desc: 'Warm steaming fresh milk with a touch of sweetness.', isBestseller: false },
    { name: 'Green Tea', price: '₹20', category: 'hot-drinks', desc: 'Antioxidant-rich organic green tea brew.', isBestseller: false },
    { name: 'Lemon Tea', price: '₹20', category: 'hot-drinks', desc: 'Refreshing hot tea with real zesty lemon twist.', isBestseller: false },
    { name: 'Coffee', price: '₹20', category: 'hot-drinks', desc: 'Signature Wajiha hot milk coffee brewed with rich espresso.', isBestseller: true },
    { name: 'Cotton Seed Milk', price: '₹25', category: 'hot-drinks', desc: 'Traditional nourishing cotton seed milk drink with dry fruits.', isBestseller: true },
    { name: 'Boost', price: '₹25', category: 'hot-drinks', desc: 'Malt chocolate energy drink served piping hot.', isBestseller: false },
    { name: 'Horlicks', price: '₹25', category: 'hot-drinks', desc: 'Classic nutritious malted milk drink.', isBestseller: false },
    { name: 'Badam Milk', price: '₹25', category: 'hot-drinks', desc: 'Rich hot almond milk garnished with crushed nuts & saffron.', isBestseller: true },

    // MAGGI
    { name: 'Double Maggie', price: '₹50', category: 'maggi', desc: 'Double serving of hot comforting noodles cooked to perfection.', isBestseller: false },
    { name: 'Masala Maggie', price: '₹70', category: 'maggi', desc: 'Spicy Indian herbs & fresh vegetable tossed noodles.', isBestseller: true },
    { name: 'Pasta', price: '₹50', category: 'maggi', desc: 'Delicately seasoned pasta tossed in creamy savory sauce.', isBestseller: false },
    { name: 'Egg Maggie', price: '₹80', category: 'maggi', desc: 'Hot masala noodles topped with scrambled spiced eggs.', isBestseller: true },

    // SANDWICHES
    { name: 'Veg Sandwich', price: '₹50', category: 'sandwiches', desc: 'Fresh cucumber, tomato & mint chutney stuffed toasted bread.', isBestseller: false },
    { name: 'Bread Omlet', price: '₹50', category: 'sandwiches', desc: 'Classic golden fried fluffy egg omlet stuffed inside butter toast.', isBestseller: true },
    { name: 'Egg Sandwich', price: '₹65', category: 'sandwiches', desc: 'Double egg layers with herbs, onions & special house sauce.', isBestseller: true },

    // BIRYANI & RICE
    { name: 'Variety Rice', price: '₹60', category: 'biryani', desc: 'Chef special seasoned rice of the day served with raita.', isBestseller: false },
    { name: 'Biryani Rice', price: '₹90', category: 'biryani', desc: 'Aromatic slow-cooked basmati biryani rice infused with whole spices.', isBestseller: false },
    { name: 'Egg Biryani', price: '₹100', category: 'biryani', desc: 'Fragrant biryani rice served with boiled spiced eggs & gravies.', isBestseller: false },
    { name: 'Chicken Biryani', price: '₹150', category: 'biryani', desc: 'Authentic slow-cooked Dum Chicken Biryani with tender juicy chicken.', isBestseller: true },

    // SNACKS
    { name: 'Sundal', price: '₹20', category: 'snacks', desc: 'Tempered healthy chickpea salad with mustard, curry leaves & coconut.', isBestseller: false },
    { name: 'Aloo Samosa', price: '₹15', category: 'snacks', desc: 'Handcrafted golden crispy samosa stuffed with spiced potato mash.', isBestseller: true },
    { name: 'Fruit Salad', price: '₹40', category: 'snacks', desc: 'Fresh seasonal fruits bowl topped with honey syrup.', isBestseller: false },

    // BEVERAGES
    { name: 'Badam Milk (Chilled)', price: '₹30', category: 'beverages', desc: 'Chilled creamy almond drink served cold.', isBestseller: true },
    { name: 'Rose Milk', price: '₹30', category: 'beverages', desc: 'Fragrant chilled milk blended with organic rose syrup.', isBestseller: true },
    { name: 'Butter Milk', price: '₹10', category: 'beverages', desc: 'Traditional spiced cold buttermilk with curry leaves & ginger.', isBestseller: false },
    { name: 'Roohafzah', price: '₹25', category: 'beverages', desc: 'Cooling herbal cooling summer drink.', isBestseller: false },
    { name: 'Milk Roohafzah', price: '₹30', category: 'beverages', desc: 'Creamy chilled milk infused with Roohafzah syrup.', isBestseller: false },
    { name: 'Nannari', price: '₹30', category: 'beverages', desc: 'Traditional herbal root extract sherbet with fresh lemon juice.', isBestseller: true },
    { name: 'Lemon Juice', price: '₹15', category: 'beverages', desc: 'Freshly squeezed sweet & salt lemon cooler.', isBestseller: false }
  ];

  const menuGrid = document.getElementById('menu-grid');
  const searchInput = document.getElementById('menu-search');
  const categoryTabs = document.querySelectorAll('.cat-tab');

  let activeCategory = 'all';

  function renderMenuItems(items) {
    if (!menuGrid) return;
    menuGrid.innerHTML = '';

    if (items.length === 0) {
      menuGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No matching menu items found.</div>';
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-item-card';

      card.innerHTML = `
        <div>
          <div class="card-top">
            <h3 class="item-name">${item.name}</h3>
            <span class="item-price">${item.price}</span>
          </div>
          <p class="item-desc">${item.desc}</p>
        </div>
        <div class="item-meta">
          <span class="item-category-tag">${item.category.replace('-', ' ')} ${item.isBestseller ? '★ Popular' : ''}</span>
          <button class="item-order-btn" onclick="openOrderModal('${item.name}')">Order Now</button>
        </div>
      `;

      menuGrid.appendChild(card);
    });
  }

  // Initial Menu Render
  renderMenuItems(menuItemsData);

  // Category Filtering
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      filterMenu();
    });
  });

  // Search Input Filtering
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterMenu();
    });
  }

  function filterMenu() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = menuItemsData.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesQuery = item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    renderMenuItems(filtered);
  }

  // 6. LIGHTBOX MODAL HANDLERS
  window.openLightbox = function (src, captionText) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (modal && img) {
      img.src = src;
      modal.classList.add('active');
    }
  };

  window.closeLightbox = function () {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.remove('active');
  };

  // 7. RESERVATION FORM & GLASS TOAST NOTIFICATION
  window.openOrderModal = function (itemName) {
    const notesInput = document.getElementById('form-notes');
    const contactSection = document.getElementById('contact');

    if (notesInput) {
      notesInput.value = `Order Request: ${itemName}`;
    }

    if (lenis) {
      lenis.scrollTo('#contact');
    } else if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.handleFormSubmit = function (e) {
    e.preventDefault();
    showToast('Your reservation request has been received! We will call you back shortly.');
    const form = document.getElementById('reservation-form');
    if (form) form.reset();
  };

  function showToast(message) {
    const toast = document.getElementById('glass-toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4500);
    }
  }

  // 8. GSAP SCROLLTRIGGER REVEAL ANIMATIONS
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%'
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.feature-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%'
        },
        opacity: 0,
        y: 35,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out'
      });
    });
  }
});
