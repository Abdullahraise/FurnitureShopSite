const WHATSAPP_NUMBER = '919710088114';

const menuBtn = document.querySelector('#menu-btn');
const closeBtn = document.querySelector('#close-menu');
const drawer = document.querySelector('#nav-drawer');
const scrim = document.querySelector('#scrim');

function setMenu(open) {
  if (!drawer || !scrim || !menuBtn) return;
  drawer.classList.toggle('active', open);
  scrim.classList.toggle('active', open);
  document.body.classList.toggle('nav-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  drawer.setAttribute('aria-hidden', String(!open));
  if (open) closeBtn?.focus();
}

menuBtn?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
scrim?.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
drawer?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

document.querySelectorAll('[data-wa-message]').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openWhatsApp(link.dataset.waMessage);
  });
});

const enquiryForm = document.querySelector('#whatsapp-enquiry-form');
if (enquiryForm) {
  const fields = {
    name: enquiryForm.querySelector('#name'),
    phone: enquiryForm.querySelector('#phone'),
    service: enquiryForm.querySelector('#service'),
    message: enquiryForm.querySelector('#message')
  };

  const showError = (field, text) => {
    const error = enquiryForm.querySelector(`[data-error-for="${field.id}"]`);
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
    if (error) error.textContent = text;
  };

  Object.values(fields).forEach(field => field?.addEventListener('input', () => showError(field, '')));

  enquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    let valid = true;
    const name = fields.name.value.trim();
    const phone = fields.phone.value.replace(/\s+/g, '').trim();
    const service = fields.service.value;
    const message = fields.message.value.trim();

    if (name.length < 2) { showError(fields.name, 'Please enter your name.'); valid = false; }
    if (!/^[+]?\d{10,13}$/.test(phone)) { showError(fields.phone, 'Enter a valid phone number.'); valid = false; }
    if (!service) { showError(fields.service, 'Please choose what you need.'); valid = false; }
    if (message.length < 5) { showError(fields.message, 'Tell us briefly what you need.'); valid = false; }
    if (!valid) return;

    const text = [
      'Hi Mulberry Furniture, I would like to make an enquiry.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Requirement: ${service}`,
      `Details: ${message}`,
      '',
      'Sent from the Mulberry Furniture website.'
    ].join('\n');

    openWhatsApp(text);
  });
}
