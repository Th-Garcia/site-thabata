/* ================================================
THABATA — script.js
Animações, partículas, interações 💙
   ================================================ */

// ------------------------------------------------
// 1. PARTÍCULAS FLUTUANTES (canvas de fundo)
// ------------------------------------------------
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Cria partículas brilhantes
    function createParticle() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.8 + 0.4,
            dx: (Math.random() - 0.5) * 0.35,
            dy: -(Math.random() * 0.5 + 0.15),
            alpha: Math.random() * 0.6 + 0.1,
            da: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
            color: Math.random() < 0.6 ? '#00d4ff' : '#ffffff'
        };
    }

    for (let i = 0; i < 90; i++) particles.push(createParticle());

    function drawParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.alpha += p.da;

            if (p.alpha <= 0.05 || p.alpha >= 0.75) p.da *= -1;
            if (p.y < -10) { p.y = H + 5; p.x = Math.random() * W; }
            if (p.x < -10 || p.x > W + 10) p.x = Math.random() * W;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
})();


// ------------------------------------------------
// 2. SCROLL DETECTION — revela seção do círculo
// ------------------------------------------------
(function initScroll() {
    const hero = document.getElementById('section-hero');
    const circle = document.getElementById('section-circle');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.4 });

    observer.observe(circle);

    // Suporte a touch drag no mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (dy > 50) {
            circle.scrollIntoView({ behavior: 'smooth' });
        }
    }, { passive: true });
})();


// ------------------------------------------------
// 3. CLIQUE NO CÍRCULO — explosão de rosas
// ------------------------------------------------
(function initCircleClick() {
    const magicCircle = document.getElementById('magic-circle');

    function handleClick() {
        // Som de clique romântico (Web Audio API — simples)
        playRomanticSound();

        // Mostra seção revelação
        showReveal();
    }

    magicCircle.addEventListener('click', handleClick);
    magicCircle.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleClick();
    });
})();


// ------------------------------------------------
// 4. MOSTRAR REVELAÇÃO
// ------------------------------------------------
function showReveal() {
    // 1. Some com o círculo suavemente
    const circleWrapper = document.getElementById('magic-circle');
    const circleHint = document.querySelector('.circle-hint-text');
    const circleSub = document.querySelector('.circle-sub-hint');

    [circleWrapper, circleHint, circleSub].forEach(el => {
        if (el) {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '0';
            el.style.transform = 'scale(0.7)';
            el.style.pointerEvents = 'none';
        }
    });

    // 2. Após sumir, mostra a seção de revelação
    setTimeout(() => {
        const revealSection = document.getElementById('section-reveal');
        revealSection.classList.remove('hidden-section');
        revealSection.style.display = 'flex';
        void revealSection.offsetWidth; // força reflow

        // Dispara rosas voando
        setTimeout(() => launchFlyingRoses(), 100);

        // Dispara confetti
        setTimeout(() => launchConfetti(), 200);
    }, 500); // espera o círculo sumir (0.5s)
}


// ------------------------------------------------
// 5. ROSAS VOANDO — explosão de 12 rosas
// ------------------------------------------------
function launchFlyingRoses() {
    const container = document.getElementById('flying-roses-container');
    container.innerHTML = '';

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const count = 14;

    for (let i = 0; i < count; i++) {
        const rose = document.createElement('div');
        const isBlue = i % 2 === 0;
        const angle = (360 / count) * i + Math.random() * 20 - 10;
        const dist = 120 + Math.random() * 200;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * dist;
        const ty = Math.sin(rad) * dist - 60;
        const rotEnd = (Math.random() - 0.5) * 540;
        const rotMid = (Math.random() - 0.5) * 180;
        const delay = Math.random() * 0.4;
        const size = 40 + Math.random() * 35;

        rose.className = 'flying-rose';
        rose.style.cssText = `
    left: ${cx}px;
    top:  ${cy}px;
    --tx: ${tx}px;
    --ty: ${ty}px;
    --rot-mid: ${rotMid}deg;
    --rot-end: ${rotEnd}deg;
    animation-delay: ${delay}s;
    transform-origin: center;
    `;

        rose.innerHTML = isBlue ? makeRoseSVGBlue(size) : makeRoseSVGWhite(size);
        container.appendChild(rose);
    }
}

function makeRoseSVGBlue(size) {
    return `<svg width="${size}" height="${size * 1.3}" viewBox="0 0 120 155" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 0 8px #00d4ff) drop-shadow(0 0 20px #00d4ff80)">
    <line x1="60" y1="140" x2="60" y2="88" stroke="#1a6b3c" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="60" cy="68" rx="18" ry="22" fill="#2a5298" opacity="0.85" transform="rotate(-15 60 68)"/>
    <ellipse cx="60" cy="68" rx="18" ry="22" fill="#2a5298" opacity="0.85" transform="rotate(15 60 68)"/>
    <ellipse cx="60" cy="68" rx="18" ry="22" fill="#2a5298" opacity="0.85" transform="rotate(50 60 68)"/>
    <ellipse cx="60" cy="68" rx="18" ry="22" fill="#1e3c72" opacity="0.85" transform="rotate(-50 60 68)"/>
    <ellipse cx="60" cy="65" rx="13" ry="17" fill="#3a6bc8" opacity="0.9" transform="rotate(-20 60 65)"/>
    <ellipse cx="60" cy="65" rx="13" ry="17" fill="#3a6bc8" opacity="0.9" transform="rotate(20 60 65)"/>
    <ellipse cx="60" cy="65" rx="13" ry="17" fill="#3a6bc8" opacity="0.9" transform="rotate(65 60 65)"/>
    <circle cx="60" cy="62" r="8" fill="#00d4ff" opacity="0.7"/>
</svg>`;
}

function makeRoseSVGWhite(size) {
    return `<svg width="${size}" height="${size * 1.3}" viewBox="0 0 120 155" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 20px #ffffff80)">
    <line x1="60" y1="140" x2="60" y2="88" stroke="#2d7a4f" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="60" cy="68" rx="18" ry="22" fill="#e0e8f0" opacity="0.85" transform="rotate(-15 60 68)"/>
    <ellipse cx="60" cy="68" rx="18" ry="22" fill="#e0e8f0" opacity="0.85" transform="rotate(15 60 68)"/>
    <ellipse cx="60" cy="68" rx="18" ry="22" fill="#d0d8e8" opacity="0.85" transform="rotate(50 60 68)"/>
    <ellipse cx="60" cy="68" rx="18" ry="22" fill="#c8d0e0" opacity="0.85" transform="rotate(-50 60 68)"/>
    <ellipse cx="60" cy="65" rx="13" ry="17" fill="#f0f4f8" opacity="0.9" transform="rotate(-20 60 65)"/>
    <ellipse cx="60" cy="65" rx="13" ry="17" fill="#f0f4f8" opacity="0.9" transform="rotate(20 60 65)"/>
    <ellipse cx="60" cy="65" rx="13" ry="17" fill="#f0f4f8" opacity="0.9" transform="rotate(65 60 65)"/>
    <circle cx="60" cy="62" r="8" fill="#ffffff" opacity="0.9"/>
</svg>`;
}


// ------------------------------------------------
// 6. CONFETTI LUMINOSO
// ------------------------------------------------
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00d4ff', '#ffffff', '#4db8ff', '#e0f0ff', '#80e0ff', '#0099cc'];
    const pieces = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
        pieces.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 120,
            y: canvas.height / 2 + (Math.random() - 0.5) * 80,
            w: Math.random() * 8 + 4,
            h: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 12,
            vy: -(Math.random() * 10 + 5),
            gravity: 0.25,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 8,
            alpha: 1,
            fade: Math.random() * 0.008 + 0.004
        });
    }

    let frame = 0;
    function animateConfetti() {
        if (frame > 300) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.99;
            p.rotation += p.rotSpeed;
            p.alpha -= p.fade;
            if (p.alpha < 0) p.alpha = 0;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        frame++;
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
}


// ------------------------------------------------
// 7. SOM ROMÂNTICO (Web Audio API)
// ------------------------------------------------
function playRomanticSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ac = new AudioCtx();

        // Toca notas suaves em sequência — acorde de Mi maior
        const notes = [329.63, 415.30, 493.88, 659.25]; // E4, G#4, B4, E5

        notes.forEach((freq, i) => {
            const osc = ac.createOscillator();
            const gain = ac.createGain();

            osc.connect(gain);
            gain.connect(ac.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ac.currentTime);

            const start = ac.currentTime + i * 0.15;
            const end = start + 0.8;

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.12, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, end);

            osc.start(start);
            osc.stop(end);
        });
    } catch (e) {
        // Silencioso se não suportado
    }
}


// ------------------------------------------------
// 8. PWA — Service Worker Registration
// ------------------------------------------------
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => { });
    });
}