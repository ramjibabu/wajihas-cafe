/* ==========================================================================
   WAJIHA'S CAFE - Split Layout 3D Coffee Engine
   Unblocked 3D Coffee Cup on Right, Orbiting Beans & Steam forming "W"
   ========================================================================== */

(function () {
  const container = document.getElementById('hero-canvas');
  if (!container) return;

  let isWebGLAvailable = false;
  let renderer, scene, camera, cupGroup, steamGeometry, steamParticles;
  let orbitingBeans = [], floatingSparkles = [];

  try {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1A0F0B, 0.008);

    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Responsive Camera Setup (Cup on right for desktop, centered for mobile)
    const isMobile = window.innerWidth < 992;
    const cupOffsetX = isMobile ? 0 : 1.4;

    camera.position.set(cupOffsetX * 0.8, 2.0, 5.8);
    camera.lookAt(cupOffsetX, 0.4, 0);

    renderer = new THREE.WebGLRenderer({
      canvas: container,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    isWebGLAvailable = true;
  } catch (e) {
    console.warn("WebGL hardware renderer restricted, initializing 2D Canvas split engine.", e);
  }

  if (isWebGLAvailable) {
    const isMobile = window.innerWidth < 992;
    const cupOffsetX = isMobile ? 0 : 1.4;

    // 1. Lighting System
    const ambientLight = new THREE.AmbientLight(0x5D4037, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFE0B2, 3.8);
    keyLight.position.set(cupOffsetX + 4, 7, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.SpotLight(0xE5C158, 6, 25, Math.PI / 3, 0.5);
    rimLight.position.set(cupOffsetX - 6, 7, -3);
    scene.add(rimLight);

    const cupGlowLight = new THREE.PointLight(0xFFB74D, 3.5, 8);
    cupGlowLight.position.set(cupOffsetX, 1.4, 0);
    scene.add(cupGlowLight);

    // 2. Coffee Cup Assembly (Positioned on the Right Side)
    cupGroup = new THREE.Group();
    cupGroup.position.set(cupOffsetX, -0.3, 0);
    scene.add(cupGroup);

    // Cup Lathe Geometry
    const cupPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.9, 0),
      new THREE.Vector2(1.0, 0.1),
      new THREE.Vector2(1.35, 1.6),
      new THREE.Vector2(1.38, 1.7),
      new THREE.Vector2(1.26, 1.7),
      new THREE.Vector2(1.20, 1.6),
      new THREE.Vector2(0.95, 0.22),
      new THREE.Vector2(0, 0.22)
    ];

    const cupGeometry = new THREE.LatheGeometry(cupPoints, 64);
    const ceramicMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFAF7F3,
      roughness: 0.12,
      metalness: 0.08,
      clearcoat: 1.0,
      reflectivity: 0.98,
      shadowSide: THREE.DoubleSide
    });

    const cupMesh = new THREE.Mesh(cupGeometry, ceramicMaterial);
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    cupGroup.add(cupMesh);

    // Gold Lip Rim
    const rimGeo = new THREE.TorusGeometry(1.35, 0.028, 16, 100);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.92, roughness: 0.12 });
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 1.68;
    cupGroup.add(rimMesh);

    // Handle
    const handleGeo = new THREE.TorusGeometry(0.58, 0.095, 16, 32, Math.PI * 1.1);
    const handleMesh = new THREE.Mesh(handleGeo, ceramicMaterial);
    handleMesh.position.set(1.35, 0.95, 0);
    handleMesh.rotation.z = -Math.PI / 6;
    handleMesh.castShadow = true;
    cupGroup.add(handleMesh);

    // Saucer
    const saucerPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1.1, 0.02),
      new THREE.Vector2(2.1, 0.3),
      new THREE.Vector2(2.15, 0.28),
      new THREE.Vector2(1.1, 0),
      new THREE.Vector2(0, 0)
    ];
    const saucerGeo = new THREE.LatheGeometry(saucerPoints, 64);
    const saucerMesh = new THREE.Mesh(saucerGeo, ceramicMaterial);
    saucerMesh.position.y = -0.05;
    saucerMesh.receiveShadow = true;
    saucerMesh.castShadow = true;
    cupGroup.add(saucerMesh);

    // Liquid Surface
    const liquidGeo = new THREE.CircleGeometry(1.22, 64);
    const liquidMat = new THREE.MeshStandardMaterial({ color: 0x22120B, roughness: 0.05, metalness: 0.45 });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.rotation.x = -Math.PI / 2;
    liquidMesh.position.y = 1.52;
    cupGroup.add(liquidMesh);

    // Wooden Tabletop
    const tableGeo = new THREE.CylinderGeometry(9.5, 9.5, 0.4, 64);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x1F110A, roughness: 0.3 });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.set(cupOffsetX, -0.5, 0);
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // 3. Orbiting Coffee Beans (Seeds) System
    const beanGroup = new THREE.Group();
    beanGroup.position.set(cupOffsetX, 0, 0);
    scene.add(beanGroup);

    const beanGeo = new THREE.SphereGeometry(0.14, 16, 16);
    beanGeo.scale(1.65, 0.88, 1.0);
    const beanMat = new THREE.MeshStandardMaterial({ color: 0x3E2419, roughness: 0.35, metalness: 0.15 });

    const beanCount = 28;
    for (let b = 0; b < beanCount; b++) {
      const beanMesh = new THREE.Mesh(beanGeo, beanMat);
      beanMesh.castShadow = true;
      beanGroup.add(beanMesh);

      const isInnerRing = b % 2 === 0;
      const radius = isInnerRing ? 2.2 + Math.random() * 0.4 : 3.4 + Math.random() * 0.6;
      const initialAngle = (b / beanCount) * Math.PI * 2 + Math.random() * 0.5;
      const speed = (isInnerRing ? 0.012 : -0.008) + (Math.random() - 0.5) * 0.004;

      orbitingBeans.push({
        mesh: beanMesh,
        radius: radius,
        angle: initialAngle,
        speed: speed,
        yOffset: (Math.random() - 0.5) * 1.5 + 0.8,
        rotSpeedX: Math.random() * 0.04 + 0.01,
        rotSpeedY: Math.random() * 0.04 + 0.01
      });
    }

    // 4. Volumetric Steam System forming "W" above Cup
    const steamParticleCount = 550;
    steamGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(steamParticleCount * 3);
    const targetWPos = new Float32Array(steamParticleCount * 3);

    for (let i = 0; i < steamParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.5;
      positions[i * 3] = cupOffsetX + Math.cos(angle) * r;
      positions[i * 3 + 1] = 1.5 + Math.random() * 0.2;
      positions[i * 3 + 2] = Math.sin(angle) * r;

      const wProg = i / steamParticleCount;
      let wx = 0;
      if (wProg < 0.25) wx = -1.1 + wProg * 4.4;
      else if (wProg < 0.5) wx = 0 - (wProg - 0.25) * 4.4;
      else if (wProg < 0.75) wx = 0 + (wProg - 0.5) * 4.4;
      else wx = 1.1 - (wProg - 0.75) * 4.4;

      targetWPos[i * 3] = cupOffsetX + wx * 0.85;
      targetWPos[i * 3 + 1] = 1.9 + Math.sin(wProg * Math.PI) * 0.85;
      targetWPos[i * 3 + 2] = Math.cos(wProg * Math.PI * 2) * 0.35;
    }

    steamGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 245, 230, 0.95)');
    grad.addColorStop(0.35, 'rgba(245, 215, 160, 0.5)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const steamTex = new THREE.CanvasTexture(canvas);
    const steamMaterial = new THREE.PointsMaterial({
      color: 0xFFF8E7,
      size: 0.48,
      map: steamTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    steamParticles = new THREE.Points(steamGeometry, steamMaterial);
    scene.add(steamParticles);

    // Sparkles
    const sparkleGeo = new THREE.BufferGeometry();
    const sparkleCount = 120;
    const sparklePos = new Float32Array(sparkleCount * 3);
    for (let s = 0; s < sparkleCount; s++) {
      sparklePos[s * 3] = cupOffsetX + (Math.random() - 0.5) * 5;
      sparklePos[s * 3 + 1] = Math.random() * 2.8;
      sparklePos[s * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    const sparkleMat = new THREE.PointsMaterial({ color: 0xE5C158, size: 0.1, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparkles);

    // Mouse Parallax & Touch Interaction
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    }, { passive: true });

    // Window Resize Handler
    window.addEventListener('resize', () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    });

    // Animation Loop
    const clock = new THREE.Clock();
    const startTime = Date.now();

    function render3D() {
      requestAnimationFrame(render3D);
      const elapsedTime = clock.getElapsedTime();
      const elapsedSec = (Date.now() - startTime) / 1000;

      camera.position.x += (cupOffsetX * 0.8 + mouseX * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (2.0 - mouseY * 0.4 + Math.sin(elapsedTime * 0.5) * 0.05 - camera.position.y) * 0.05;
      camera.lookAt(cupOffsetX, 0.5, 0);

      cupGroup.rotation.y = elapsedTime * 0.18;

      orbitingBeans.forEach(b => {
        b.angle += b.speed;
        b.mesh.position.x = Math.cos(b.angle) * b.radius;
        b.mesh.position.z = Math.sin(b.angle) * b.radius;
        b.mesh.position.y = b.yOffset + Math.sin(elapsedTime * 1.5 + b.angle) * 0.3;
        b.mesh.rotation.x += b.rotSpeedX;
        b.mesh.rotation.y += b.rotSpeedY;
      });

      const posAttr = steamGeometry.attributes.position;
      const cycle = (elapsedSec % 7) / 7;

      for (let i = 0; i < steamParticleCount; i++) {
        let px = posAttr.getX(i);
        let py = posAttr.getY(i);
        let pz = posAttr.getZ(i);

        if (cycle > 0.15 && cycle < 0.75) {
          px += (targetWPos[i * 3] - px) * 0.045;
          py += (targetWPos[i * 3 + 1] - py) * 0.045;
          pz += (targetWPos[i * 3 + 2] - pz) * 0.045;
        } else {
          py += 0.01;
          px += Math.sin(py * 2.5 + elapsedTime) * 0.005;
          pz += Math.cos(py * 2.5 + elapsedTime) * 0.005;
          if (py > 2.85) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 0.4;
            px = cupOffsetX + Math.cos(angle) * r;
            py = 1.5 + Math.random() * 0.1;
            pz = Math.sin(angle) * r;
          }
        }
        posAttr.setXYZ(i, px, py, pz);
      }
      steamGeometry.attributes.position.needsUpdate = true;

      const sAttr = sparkleGeo.attributes.position;
      for (let s = 0; s < sparkleCount; s++) {
        let sy = sAttr.getY(s) + 0.005;
        if (sy > 4.5) sy = 0;
        sAttr.setY(s, sy);
      }
      sparkleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    render3D();

  } else {
    // 2D Canvas Engine (Right Side Positioned Cup)
    const ctx = container.getContext('2d');
    function resize2D() {
      container.width = window.innerWidth;
      container.height = window.innerHeight;
    }
    resize2D();
    window.addEventListener('resize', resize2D);

    const isMobile = window.innerWidth < 992;
    const cx = isMobile ? container.width / 2 : container.width * 0.72;
    const cy = container.height * 0.62;

    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 50,
        y: cy - 35,
        size: Math.random() * 25 + 15,
        speedY: Math.random() * 1.3 + 0.9,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    const beans2D = [];
    for (let b = 0; b < 16; b++) {
      beans2D.push({
        angle: (b / 16) * Math.PI * 2,
        radiusX: 160 + Math.random() * 30,
        radiusY: 50 + Math.random() * 10,
        speed: 0.015,
        size: 13
      });
    }

    let t = 0;
    function render2D() {
      t += 0.018;
      ctx.clearRect(0, 0, container.width, container.height);

      const isMob = window.innerWidth < 992;
      const cupX = isMob ? container.width / 2 : container.width * 0.72;

      beans2D.forEach(b => {
        b.angle += b.speed;
        const bx = cupX + Math.cos(b.angle) * b.radiusX;
        const by = cy + Math.sin(b.angle) * b.radiusY - 20;
        if (Math.sin(b.angle) < 0) {
          ctx.save();
          ctx.translate(bx, by);
          ctx.beginPath();
          ctx.ellipse(0, 0, b.size * 1.4, b.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#3E2419';
          ctx.fill();
          ctx.restore();
        }
      });

      // Cup & Saucer
      ctx.save();
      ctx.shadowBlur = 35;
      ctx.shadowColor = 'rgba(200, 155, 60, 0.45)';

      ctx.beginPath();
      ctx.ellipse(cupX, cy + 50, 125, 26, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FAF7F3';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cupX - 70, cy - 35);
      ctx.bezierCurveTo(cupX - 70, cy + 45, cupX + 70, cy + 45, cupX + 70, cy - 35);
      ctx.fillStyle = '#FAF7F3';
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(cupX, cy - 35, 70, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#C89B3C';
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(cupX, cy - 35, 64, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#22120B';
      ctx.fill();
      ctx.restore();

      beans2D.forEach(b => {
        const bx = cupX + Math.cos(b.angle) * b.radiusX;
        const by = cy + Math.sin(b.angle) * b.radiusY - 20;
        if (Math.sin(b.angle) >= 0) {
          ctx.save();
          ctx.translate(bx, by);
          ctx.beginPath();
          ctx.ellipse(0, 0, b.size * 1.4, b.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#4E2E20';
          ctx.fill();
          ctx.restore();
        }
      });

      particles.forEach((p, idx) => {
        p.y -= p.speedY;
        const progress = (cy - p.y) / (cy - 100);

        if (progress > 0.2 && progress < 0.8) {
          const wPhase = (idx / 120);
          let targetOffset = 0;
          if (wPhase < 0.25) targetOffset = -60 + wPhase * 240;
          else if (wPhase < 0.5) targetOffset = 0 - (wPhase - 0.25) * 240;
          else if (wPhase < 0.75) targetOffset = 0 + (wPhase - 0.5) * 240;
          else targetOffset = 60 - (wPhase - 0.75) * 240;

          p.x += (cupX + targetOffset - p.x) * 0.055;
        } else {
          p.x += Math.sin(t + p.y * 0.02) * 0.8;
        }

        p.alpha -= 0.007;

        if (p.y < cy - 210 || p.alpha <= 0) {
          p.x = cupX + (Math.random() - 0.5) * 40;
          p.y = cy - 35;
          p.alpha = Math.random() * 0.6 + 0.2;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(255, 245, 230, ${p.alpha})`);
        grad.addColorStop(0.5, `rgba(200, 155, 60, ${p.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render2D);
    }
    render2D();
  }
})();
