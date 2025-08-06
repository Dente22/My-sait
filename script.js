const canvas = document.getElementById("stars-bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const sparks = Array(60).fill().map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 1.5 + 0.5,
  alpha: Math.random(),
  fade: Math.random() * 0.02 + 0.005
}));

const stars = Array(200).fill().map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 1.5,
  speed: Math.random() * 0.2 + 0.05,
  alpha: Math.random(), // ← новое свойство
  alphaChange: (Math.random() * 0.01) - 0.005 // от -0.005 до 0.005
}));


const fogs = Array(6).fill().map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 150 + 100,
  speedX: Math.random() * 0.2 - 0.1, // горизонтальное движение
  speedY: Math.random() * 0.1 - 0.05, // вертикальное
  opacity: Math.random() * 0.2 + 0.3 // прозрачность
}));

const shootingStars = [];

function createShootingStar() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.5;
  shootingStars.push({
    x,
    y,
    length: Math.random() * 100 + 100,
    speed: Math.random() * 2 + 1.5,
    angle: Math.PI / 4,
    alpha: 1,
    flash: true
  });

  // Удаляем через 1.5 секунды
  setTimeout(() => {
    shootingStars.shift();
  }, 1500);
}

// Запускаем каждые 10–15 секунд случайно
setInterval(() => {
  if (Math.random() < 0.5) createShootingStar();
}, 10000);


function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.alpha += star.alphaChange;
    if (star.alpha <= 0 || star.alpha >= 1) {
      star.alphaChange *= -1;
    }

    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.speed;
    if (star.y > canvas.height) star.y = 0;
  });

  sparks.forEach(spark => {
  ctx.beginPath();
  ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 180, ${spark.alpha})`;
  ctx.fill();

  spark.alpha -= spark.fade;
  if (spark.alpha <= 0) {
    spark.x = Math.random() * canvas.width;
    spark.y = Math.random() * canvas.height;
    spark.radius = Math.random() * 1.5 + 0.5;
    spark.alpha = 1;
    spark.fade = Math.random() * 0.02 + 0.005;
  }

    shootingStars.forEach(star => {
    const xEnd = star.x + Math.cos(star.angle) * star.length;
    const yEnd = star.y + Math.sin(star.angle) * star.length;

    const grad = ctx.createLinearGradient(star.x, star.y, xEnd, yEnd);
    grad.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
    grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();

    // движение
    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;
    star.alpha -= 0.005;
  });

});

  requestAnimationFrame(animateStars);

    fogs.forEach(fog => {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(fog.x, fog.y, 0, fog.x, fog.y, fog.radius);
    ctx.globalAlpha = 0.9; // ← делаем всё чуть ярче
    gradient.addColorStop(0, `rgba(255, 255, 255, ${fog.opacity})`);
    gradient.addColorStop(0.6, `rgba(220, 240, 255, ${fog.opacity / 4.0})`);
    gradient.addColorStop(1, `rgba(220, 240, 255, 0)`);
    ctx.fillStyle = gradient;
    ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1; // ← возвращаем как было


    fog.x += fog.speedX;
    fog.y += fog.speedY;

    // Перемещение за пределы экрана — сбрасываем
    if (fog.x > canvas.width + fog.radius || fog.x < -fog.radius || fog.y > canvas.height + fog.radius || fog.y < -fog.radius) {
      fog.x = Math.random() * canvas.width;
      fog.y = Math.random() * canvas.height;
    }
  });

}


animateStars();

// Интро — ждёт клика
window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-screen");
  const particles = document.getElementById("intro-particles");

  if (intro) {
    intro.addEventListener("click", () => {
      intro.classList.add("hidden");
      document.body.classList.remove("intro-active");
      document.body.style.overflow = "auto";
    });
  }
});



// 🎇 Частицы в интро
const introParticles = document.createElement("div");
introParticles.id = "intro-particles";
document.getElementById("intro-screen").appendChild(introParticles);

for (let i = 0; i < 80; i++) {
  const particle = document.createElement("div");
  particle.classList.add("particle");
  particle.style.left = Math.random() * 100 + "vw";
  particle.style.animationDuration = (5 + Math.random() * 5) + "s";
  particle.style.animationDelay = Math.random() * 5 + "s";
  particle.style.opacity = Math.random() * 0.6 + 0.2;
  introParticles.appendChild(particle);
}


// Музыка
document.addEventListener('DOMContentLoaded', () => {
  const music1 = document.getElementById('bg-music-1');
  const music2 = document.getElementById('bg-music-2');

  if (music1 && music2) {
    music1.volume = 0.3;
    music2.volume = 0.3;

    // Первый клик для запуска (требуется браузером)
    document.addEventListener('click', () => {
      if (music1.paused && music2.paused) {
        music1.play();
      }
    }, { once: true });

    // Зацикливание между треками
    music1.addEventListener('ended', () => music2.play());
    music2.addEventListener('ended', () => music1.play());

    // Остановка при уходе со вкладки
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        music1.pause();
        music2.pause();
      } else {
        if (music1.paused && music2.paused) {
          if (music1.currentTime > 0 && music1.currentTime < music1.duration) {
            music1.play();
          } else {
            music2.play();
          }
        }
      }
    });
  } else {
    console.error('🎵 Аудиоэлементы не найдены!');
  }
});

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY;
  const parchment = document.getElementById('parchment-block');
  if (parchment) {
    parchment.style.transform = `translateY(${scrollPos * 0.08}px) rotate(-0.3deg)`; // дрейф
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const candle = document.getElementById("floating-candle");

  // Путь к картинкам
  const litSrc = 'images/candle_lit.png';
  const unlitSrc = 'images/candle_unlit.png';

  // При клике — переключаем режим
  candle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    candle.src = isDark ? unlitSrc : litSrc;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menu-icon");
  const magicMenu = document.getElementById("magic-menu");

  menuIcon?.addEventListener("click", () => {
    magicMenu.style.display = (magicMenu.style.display === "block") ? "none" : "block";
  });
});

  let currentMusicIndex = 0;

function updateSlide() {
  const cards = document.querySelectorAll('.track-card-music');
  const track = document.querySelector('.carousel-track-music');

  cards.forEach((card, index) => {
    card.classList.remove('active');
    if (index === currentMusicIndex) {
      card.classList.add('active');
    }
  });

  const offset = -currentMusicIndex * cards[0].offsetWidth;
  track.style.transform = `translateX(${offset}px)`;
}

function changeSlide(direction) {
  const cards = document.querySelectorAll('.track-card-music');
  currentMusicIndex += direction;

  if (currentMusicIndex < 0) currentMusicIndex = 0;
  if (currentMusicIndex >= cards.length) currentMusicIndex = cards.length - 1;

  updateSlide();
}

// swipe
let touchStartX = 0;
let touchEndX = 0;
const wrapper = document.querySelector('.carousel-wrapper');

wrapper.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

wrapper.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) changeSlide(1);
  if (touchEndX > touchStartX + 50) changeSlide(-1);
}, false);

// init on load
updateSlide();


// настройки
document.addEventListener('DOMContentLoaded', () => {
  const musicToggle = document.getElementById('toggle-music');
  const candleToggle = document.getElementById('toggle-candle');

  const music1 = document.getElementById('bg-music-1');
  const music2 = document.getElementById('bg-music-2');
  const candle = document.getElementById('floating-candle');

  // ==== Загрузка настроек из localStorage ====
  const savedMusic = localStorage.getItem('musicEnabled');
  const savedCandle = localStorage.getItem('candleEnabled');

  if (savedMusic !== null) {
    musicToggle.checked = savedMusic === 'true';
  }

  if (savedCandle !== null) {
    candleToggle.checked = savedCandle === 'true';
  }

  // ==== Применение настроек при загрузке ====
  if (!musicToggle.checked) {
    music1.pause();
    music2.pause();
  }

  if (candle) {
    candle.style.display = candleToggle.checked ? 'block' : 'none';
  }

  // ==== Обработка переключателей ====

  musicToggle.addEventListener('change', () => {
    localStorage.setItem('musicEnabled', musicToggle.checked);

    if (musicToggle.checked) {
      // Начать проигрывание
      if (music1.paused && music2.paused) {
        music1.play().catch(() => {});
      }
    } else {
      // Остановить всё
      music1.pause();
      music2.pause();
    }
  });

  candleToggle.addEventListener('change', () => {
    localStorage.setItem('candleEnabled', candleToggle.checked);
    if (candle) {
      candle.style.display = candleToggle.checked ? 'block' : 'none';
    }
  });
});
