// Custom cursor
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});
function animTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.transform = `translate(${tx - 18}px, ${ty - 18}px)`;
  requestAnimationFrame(animTrail);
}
animTrail();
document.querySelectorAll('a, button, .chip, .service-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => trail.classList.add('hover'));
  el.addEventListener('mouseleave', () => trail.classList.remove('hover'));
});

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// Counter animation
function animateCount(el, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + (target > 100 ? '%' : '+');
    if (current >= target) clearInterval(timer);
  }, 25);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      animateCount(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// WhatsApp form
function enviarWhatsApp() {
  const nome = document.getElementById('nome').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const email = document.getElementById('email').value.trim();
  const projeto = document.getElementById('projeto').value;
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !whatsapp || !projeto) {
    shakeForm();
    showError('Por favor, preencha os campos obrigatórios: Nome, WhatsApp e Tipo de projeto.');
    return;
  }

  const telefone = whatsapp.replace(/\D/g, '');
  if (telefone.length < 10) {
    showError('Por favor, insira um WhatsApp válido.');
    return;
  }

  // NÚMERO DA PATRICIA — SUBSTITUA AQUI
  const numeroPatricia = '5511940277272';

  let texto = `Olá Patricia! 👋\n\n`;
  texto += `*Novo lead pelo site!*\n\n`;
  texto += `👤 *Nome:* ${nome}\n`;
  texto += `📱 *WhatsApp:* ${whatsapp}\n`;
  if (email) texto += `📧 *E-mail:* ${email}\n`;
  texto += `💼 *Projeto:* ${projeto}\n`;
  if (mensagem) texto += `💬 *Mensagem:* ${mensagem}\n`;
  texto += `\n_Mensagem enviada pelo portfólio patricia.dev_`;

  const url = `https://wa.me/${numeroPatricia}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');

  // Success state
  showSuccess(nome);
}

function showError(msg) {
  let err = document.getElementById('formError');
  if (!err) {
    err = document.createElement('div');
    err.id = 'formError';
    err.style.cssText = 'background:rgba(255,45,120,0.1);border:1px solid rgba(255,45,120,0.4);border-radius:10px;padding:12px 18px;color:#ff6b9d;font-size:0.85rem;margin-bottom:16px;';
    document.getElementById('contactForm').insertBefore(err, document.querySelector('.btn-submit'));
  }
  err.textContent = msg;
  setTimeout(() => err && err.remove(), 4000);
}

function shakeForm() {
  const card = document.querySelector('.form-card');
  card.style.animation = 'shake 0.4s ease';
  setTimeout(() => card.style.animation = '', 400);
}

function showSuccess(nome) {
  const form = document.getElementById('contactForm');
  form.innerHTML = `
    <div style="text-align:center;padding:40px 20px">
      <div style="font-size:4rem;margin-bottom:20px;animation:bounceIn 0.6s ease">🎉</div>
      <h3 style="font-family:'Syne',sans-serif;font-size:1.5rem;margin-bottom:12px">Mensagem enviada!</h3>
      <p style="color:var(--muted);line-height:1.7">Obrigada, <strong style="color:var(--plasma)">${nome}</strong>! Sua mensagem foi aberta no WhatsApp. Te respondo em até 2 horas! 💜</p>
      <button onclick="location.reload()" style="margin-top:28px;background:rgba(92,45,232,0.15);border:1px solid rgba(92,45,232,0.3);color:var(--plasma);padding:12px 28px;border-radius:100px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.9rem;">Enviar outra mensagem</button>
    </div>
  `;
}

// WhatsApp mask
document.getElementById('whatsapp').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length >= 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length >= 3) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length >= 1) v = `(${v}`;
  this.value = v;
});

// Shake animation
const style = document.createElement('style');
style.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}@keyframes bounceIn{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`;
document.head.appendChild(style);