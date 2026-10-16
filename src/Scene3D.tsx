import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Har section mein cup ki position. x: left(-)/right(+)  y: neeche(-)/upar(+)  s: size  ry: rotation */
const STATES = [
  { selector: ".hero", x: 3.4, y: -0.2, s: 1.0, ry: 0.5 },
  { selector: ".welcome-section", x: -4.2, y: 0.2, s: 0.8, ry: -0.9 },
  { selector: ".bestsellers-section", x: 4.6, y: 1.6, s: 0.7, ry: 1.6 },
  { selector: ".menu-section", x: -4.8, y: -1.2, s: 0.65, ry: 3.0 },
  { selector: ".deal-section", x: 4.2, y: 0.4, s: 0.9, ry: 4.4 },
  { selector: ".delivery-section", x: 0.2, y: 1.6, s: 1.1, ry: 6.0 },
];

const MOBILE = { x: 1.6, y: 2.6, s: 0.45 };
const LATTE_DESKTOP = 0.7; // exploded latte ka size
const LATTE_MOBILE = 0.45;

export default function Scene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const isMobile = () => window.innerWidth < 700;

    // ---------- Renderer / Scene / Camera ----------
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 11;

    // ---------- Lights ----------
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const sun = new THREE.DirectionalLight(0xfff1dd, 2.4);
    sun.position.set(4, 6, 6);
    scene.add(sun);
    const warm = new THREE.PointLight(0xbd754b, 30, 20);
    warm.position.set(-4, -2, 4);
    scene.add(warm);

    // =====================================================
    //  CUP (jo pehle se tha)
    // =====================================================
    const mover = new THREE.Group();
    const spin = new THREE.Group();
    mover.add(spin);
    scene.add(mover);

    const cupProfile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.6, 0),
      new THREE.Vector2(0.8, 0.1),
      new THREE.Vector2(1.15, 1.5),
      new THREE.Vector2(1.2, 1.6),
      new THREE.Vector2(1.1, 1.6),
      new THREE.Vector2(0.75, 0.2),
      new THREE.Vector2(0, 0.2),
    ];
    spin.add(
      new THREE.Mesh(
        new THREE.LatheGeometry(cupProfile, 64),
        new THREE.MeshStandardMaterial({
          color: 0xfffaf1,
          roughness: 0.25,
          side: THREE.DoubleSide,
        }),
      ),
    );

    const coffee = new THREE.Mesh(
      new THREE.CircleGeometry(1.1, 48),
      new THREE.MeshStandardMaterial({ color: 0x4a2c1a, roughness: 0.4 }),
    );
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 1.4;
    spin.add(coffee);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.1, 16, 32, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xfffaf1, roughness: 0.25 }),
    );
    handle.position.set(1.15, 0.85, 0);
    handle.rotation.z = -Math.PI / 2;
    spin.add(handle);

    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 1.5, 0.1, 64),
      new THREE.MeshStandardMaterial({ color: 0x465b40, roughness: 0.35 }),
    );
    saucer.position.y = -0.05;
    spin.add(saucer);

    const orbs: THREE.Mesh[] = [];
    const orbColors = [0xbd754b, 0x465b40, 0xd5b18b];
    for (let i = 0; i < 9; i++) {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.1 + Math.random() * 0.16, 24, 24),
        new THREE.MeshStandardMaterial({
          color: orbColors[i % 3],
          roughness: 0.4,
        }),
      );
      const angle = (i / 9) * Math.PI * 2;
      const radius = 2.3 + Math.random() * 1.2;
      orb.position.set(
        Math.cos(angle) * radius,
        0.2 + Math.random() * 2.4,
        Math.sin(angle) * radius * 0.6,
      );
      orb.userData = { base: orb.position.y, speed: 0.6 + Math.random() };
      orbs.push(orb);
      spin.add(orb);
    }
    spin.rotation.x = 0.35;

    // =====================================================
    //  EXPLODED ICED MATCHA LATTE (naya)
    // =====================================================
    const latte = new THREE.Group();
    latte.scale.setScalar(0); // shuru mein chhupa hua
    latte.position.y = -0.4;
    scene.add(latte);

    const latteSpin = new THREE.Group();
    latte.add(latteSpin);

    // Har part: rest = jab jura hua ho, lift = khulne par kitna upar/neeche jaye
    const parts: { obj: THREE.Object3D; rest: number; lift: number }[] = [];
    const addPart = (obj: THREE.Object3D, rest: number, lift: number) => {
      obj.position.y = rest;
      latteSpin.add(obj);
      parts.push({ obj, rest, lift });
    };

    // Glass (neeche jata hai)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glass = new THREE.Group();
    glass.add(
      new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.78, 3.2, 48, 1, true), glassMat),
    );
    const glassBase = new THREE.Mesh(new THREE.CircleGeometry(0.78, 48), glassMat);
    glassBase.rotation.x = -Math.PI / 2;
    glassBase.position.y = -1.6;
    glass.add(glassBase);
    addPart(glass, 0, -2.6);

    // Milk
    addPart(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.76, 0.76, 1.2, 48),
        new THREE.MeshStandardMaterial({ color: 0xf3ead8, roughness: 0.5 }),
      ),
      -1.0,
      0.7,
    );

    // Matcha
    addPart(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 1.0, 48),
        new THREE.MeshStandardMaterial({ color: 0x6f9150, roughness: 0.5 }),
      ),
      0.1,
      0.9,
    );

    // Ice cubes
    const ice = new THREE.Group();
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0xdff4ff,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6,
    });
    [
      [-0.3, 0.0, 0.1],
      [0.3, 0.1, -0.2],
      [0.0, 0.25, 0.3],
      [-0.1, -0.05, -0.35],
    ].forEach(([x, y, z], i) => {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), iceMat);
      cube.position.set(x, y, z);
      cube.rotation.set(i * 0.6, i * 0.9, i * 0.4);
      ice.add(cube);
    });
    addPart(ice, 0.85, 1.45);

    // Straw (sab se upar jata hai)
    const straw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 2.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xbd754b, roughness: 0.4 }),
    );
    addPart(straw, 0.9, 3.2);

    // =====================================================
    //  Scroll animation
    // =====================================================
    const apply = (st: (typeof STATES)[number]) => {
      const m = isMobile();
      gsap.to(mover.position, {
        x: m ? MOBILE.x : st.x,
        y: m ? MOBILE.y : st.y,
        duration: 1.4,
        ease: "power3.inOut",
        overwrite: true,
      });
      gsap.to(mover.rotation, {
        y: st.ry,
        duration: 1.6,
        ease: "power3.inOut",
        overwrite: true,
      });
      const sc = m ? MOBILE.s : st.s;
      gsap.to(mover.scale, {
        x: sc,
        y: sc,
        z: sc,
        duration: 1.4,
        ease: "power3.inOut",
        overwrite: true,
      });
    };

    const showLatte = () => {
      gsap.to(mover.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.6,
        ease: "power2.in",
        overwrite: true,
      });
      const s = isMobile() ? LATTE_MOBILE : LATTE_DESKTOP;
      gsap.to(latte.scale, {
        x: s,
        y: s,
        z: s,
        duration: 1,
        ease: "back.out(1.4)",
        overwrite: true,
      });
    };
    const hideLatte = () => {
      gsap.to(latte.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.6,
        ease: "power2.in",
        overwrite: true,
      });
    };

    const explodeSection = document.querySelector<HTMLElement>(".explode-section");
    let target = 0; // scroll progress (0 to 1)
    let ex = 0; // smooth explode value (0 = jura, 1 = poora khula)

    const ctx = gsap.context(() => {
      // Pinned explode section (pehle banana zaroori hai)
      ScrollTrigger.create({
        trigger: ".explode-section",
        start: "top top",
        end: "+=200%",
        pin: true,
        onEnter: showLatte,
        onEnterBack: showLatte,
        onLeave: () => {
          hideLatte();
          apply(STATES[2]);
        },
        onLeaveBack: () => {
          hideLatte();
          apply(STATES[1]);
        },
        onUpdate: (self) => {
          target = self.progress;
        },
      });

      STATES.forEach((st) => {
        ScrollTrigger.create({
          trigger: st.selector,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => apply(st),
          onEnterBack: () => apply(st),
        });
      });
    });

    apply(STATES[0]);

    // ---------- Mouse ----------
    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // ---------- Render loop ----------
    let frame = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // cup
      spin.position.y = Math.sin(t * 1.2) * 0.15;
      spin.rotation.y += 0.004;
      spin.rotation.x += (0.35 + mouse.y * 0.15 - spin.rotation.x) * 0.05;
      spin.rotation.z += (-mouse.x * 0.1 - spin.rotation.z) * 0.05;
      orbs.forEach((orb, i) => {
        orb.position.y =
          orb.userData.base + Math.sin(t * orb.userData.speed + i) * 0.25;
      });

      // exploded latte
      const goal = THREE.MathUtils.smoothstep(target, 0.12, 0.65);
      ex += (goal - ex) * 0.08;
      parts.forEach((p) => {
        p.obj.position.y = p.rest + p.lift * ex;
      });
      ice.rotation.y = t * 0.4;
      latteSpin.rotation.y = 0.5 + t * 0.15 + ex * 1.2;
      latteSpin.rotation.x = 0.12 + mouse.y * 0.08;
      explodeSection?.style.setProperty("--e", ex.toFixed(3));

      renderer.render(scene, camera);
    };
    tick();

    // ---------- Resize ----------
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      ctx.revert();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 40,
      }}
    />
  );
}