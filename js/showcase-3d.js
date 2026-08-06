/* ==========================================================================
   WAJIHA'S CAFE - Perfectly Centered Showcase Engine with Orbiting Seeds
   ========================================================================== */

(function () {
  const container = document.getElementById('showcase-canvas');
  if (!container) return;

  const parent = container.parentElement;

  let isWebGLAvailable = false;
  let renderer, scene, camera, showcaseGroup, orbitingSeeds = [];

  try {
    scene = new THREE.Scene();

    // Camera centered on cup middle (y = 0.8)
    camera = new THREE.PerspectiveCamera(42, parent.clientWidth / parent.clientHeight, 0.1, 100);
    camera.position.set(0, 0.8, 5.0);
    camera.lookAt(0, 0.8, 0);

    renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    isWebGLAvailable = true;
  } catch (e) {
    console.warn("Showcase 3D WebGL context restricted, rendering 2D Interactive Craft Canvas.", e);
  }

  if (isWebGLAvailable) {
    const ambient = new THREE.AmbientLight(0x5D4037, 2.2);
    scene.add(ambient);

    const spot = new THREE.SpotLight(0xE5C158, 4.5);
    spot.position.set(4, 6, 4);
    scene.add(spot);

    const rimLight = new THREE.PointLight(0xC89B3C, 2.5, 8);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    showcaseGroup = new THREE.Group();
    // Center the group vertically in camera view
    showcaseGroup.position.set(0, 0, 0);
    scene.add(showcaseGroup);

    // Cup Body
    const cupPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.85, 0),
      new THREE.Vector2(0.95, 0.1),
      new THREE.Vector2(1.25, 1.5),
      new THREE.Vector2(1.28, 1.6),
      new THREE.Vector2(1.18, 1.6),
      new THREE.Vector2(1.12, 1.52),
      new THREE.Vector2(0.9, 0.2),
      new THREE.Vector2(0, 0.2)
    ];

    const cupGeo = new THREE.LatheGeometry(cupPoints, 50);
    const cupMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAF7F3,
      roughness: 0.12,
      metalness: 0.08,
      clearcoat: 1.0,
      reflectivity: 0.95
    });
    const cupMesh = new THREE.Mesh(cupGeo, cupMat);
    showcaseGroup.add(cupMesh);

    // Gold Rim Accent
    const rimGeo = new THREE.TorusGeometry(1.25, 0.025, 16, 100);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.15 });
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 1.58;
    showcaseGroup.add(rimMesh);

    // Handle
    const handleGeo = new THREE.TorusGeometry(0.55, 0.09, 16, 32, Math.PI * 1.1);
    const handleMesh = new THREE.Mesh(handleGeo, cupMat);
    handleMesh.position.set(1.25, 0.9, 0);
    handleMesh.rotation.z = -Math.PI / 6;
    showcaseGroup.add(handleMesh);

    // Saucer Plate
    const saucerPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1.0, 0.02),
      new THREE.Vector2(2.0, 0.28),
      new THREE.Vector2(2.05, 0.26),
      new THREE.Vector2(1.0, 0),
      new THREE.Vector2(0, 0)
    ];
    const saucerGeo = new THREE.LatheGeometry(saucerPoints, 50);
    const saucerMesh = new THREE.Mesh(saucerGeo, cupMat);
    saucerMesh.position.y = -0.05;
    showcaseGroup.add(saucerMesh);

    // Liquid Surface
    const liquidGeo = new THREE.CircleGeometry(1.12, 48);
    const liquidMat = new THREE.MeshStandardMaterial({ color: 0x22120B, roughness: 0.08, metalness: 0.4 });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.rotation.x = -Math.PI / 2;
    liquidMesh.position.y = 1.42;
    showcaseGroup.add(liquidMesh);

    // Orbiting Coffee Seeds/Beans around Showcase Cup
    const seedGeo = new THREE.SphereGeometry(0.12, 16, 16);
    seedGeo.scale(1.6, 0.85, 1.0);
    const seedMat = new THREE.MeshStandardMaterial({ color: 0x3E2419, roughness: 0.35 });

    const seedGroup = new THREE.Group();
    scene.add(seedGroup);

    for (let s = 0; s < 14; s++) {
      const seedMesh = new THREE.Mesh(seedGeo, seedMat);
      seedGroup.add(seedMesh);

      const angle = (s / 14) * Math.PI * 2;
      const radius = 2.0 + Math.random() * 0.4;
      const speed = 0.012 + (Math.random() - 0.5) * 0.004;

      orbitingSeeds.push({
        mesh: seedMesh,
        angle: angle,
        radius: radius,
        speed: speed,
        y: 0.3 + Math.sin(angle) * 0.5,
        rotSpeed: Math.random() * 0.03 + 0.01
      });
    }

    let controls;
    if (window.THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.8;
      controls.target.set(0, 0.8, 0); // Keep centered on cup
    }

    // Responsive Canvas Resize
    window.addEventListener('resize', () => {
      if (camera && renderer && parent) {
        camera.aspect = parent.clientWidth / parent.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(parent.clientWidth, parent.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    });

    const clock = new THREE.Clock();

    function animate3D() {
      requestAnimationFrame(animate3D);
      const elapsedTime = clock.getElapsedTime();

      if (controls) {
        controls.update();
      } else {
        showcaseGroup.rotation.y += 0.012;
      }

      // Orbit seeds around centered showcase cup
      orbitingSeeds.forEach(s => {
        s.angle += s.speed;
        s.mesh.position.x = Math.cos(s.angle) * s.radius;
        s.mesh.position.z = Math.sin(s.angle) * s.radius;
        s.mesh.position.y = 0.8 + Math.sin(elapsedTime * 1.5 + s.angle) * 0.4;
        s.mesh.rotation.x += s.rotSpeed;
        s.mesh.rotation.y += s.rotSpeed;
      });

      renderer.render(scene, camera);
    }
    animate3D();

  } else {
    // 2D Craft Fallback - Perfectly Centered
    const ctx = container.getContext('2d');
    function resizeShowcase() {
      container.width = parent.clientWidth;
      container.height = parent.clientHeight;
    }
    resizeShowcase();

    const seeds2D = [];
    for (let s = 0; s < 10; s++) {
      seeds2D.push({
        angle: (s / 10) * Math.PI * 2,
        radiusX: 130 + Math.random() * 20,
        radiusY: 45 + Math.random() * 10,
        speed: 0.016,
        size: 11
      });
    }

    let rot = 0;
    function render2DShowcase() {
      rot += 0.02;
      ctx.clearRect(0, 0, container.width, container.height);

      const cx = container.width / 2;
      const cy = container.height / 2 + 10; // Perfectly centered

      // Orbiting seeds behind
      seeds2D.forEach(s => {
        s.angle += s.speed;
        const sx = cx + Math.cos(s.angle) * s.radiusX;
        const sy = cy + Math.sin(s.angle) * s.radiusY;
        if (Math.sin(s.angle) < 0) {
          ctx.save();
          ctx.translate(sx, sy);
          ctx.beginPath();
          ctx.ellipse(0, 0, s.size * 1.4, s.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#3E2419';
          ctx.fill();
          ctx.restore();
        }
      });

      // Centered Cup & Saucer
      ctx.save();
      ctx.shadowBlur = 30;
      ctx.shadowColor = 'rgba(200, 155, 60, 0.4)';

      // Saucer
      ctx.beginPath();
      ctx.ellipse(cx, cy + 45, 100, 22, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FAF7F3';
      ctx.fill();

      // Cup
      ctx.beginPath();
      ctx.moveTo(cx - 55, cy - 25);
      ctx.bezierCurveTo(cx - 55, cy + 40, cx + 55, cy + 40, cx + 55, cy - 25);
      ctx.fillStyle = '#FAF7F3';
      ctx.fill();

      // Gold Rim
      ctx.beginPath();
      ctx.ellipse(cx, cy - 25, 55, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#C89B3C';
      ctx.fill();

      ctx.restore();

      // Orbiting seeds in front
      seeds2D.forEach(s => {
        const sx = cx + Math.cos(s.angle) * s.radiusX;
        const sy = cy + Math.sin(s.angle) * s.radiusY;
        if (Math.sin(s.angle) >= 0) {
          ctx.save();
          ctx.translate(sx, sy);
          ctx.beginPath();
          ctx.ellipse(0, 0, s.size * 1.4, s.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#4E2E20';
          ctx.fill();
          ctx.restore();
        }
      });

      requestAnimationFrame(render2DShowcase);
    }
    render2DShowcase();
  }
})();
