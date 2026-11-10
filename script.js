const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
}));

const commentForm = document.querySelector('#comment-form');
const commentsList = document.querySelector('#comments-list');
const storageKey = 'funseka-homepage-comments';
const ratingInputs = [...document.querySelectorAll('.rating-stars input')];
const ratingLabels = [...document.querySelectorAll('.rating-stars label')];
function readComments() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
}
function paintRating(value) {
  ratingLabels.forEach(label => {
    const starValue = Number(label.htmlFor.replace('rating-', ''));
    const selected = starValue >= 6 - Number(value);
    label.classList.toggle('selected', selected);
    label.textContent = selected ? '★' : '☆';
  });
}
ratingInputs.forEach(input => input.addEventListener('change', () => paintRating(input.value)));
ratingLabels.forEach(label => {
  label.addEventListener('mouseenter', () => paintRating(label.htmlFor.replace('rating-', '')));
  label.addEventListener('mouseleave', () => paintRating(document.querySelector('.rating-stars input:checked')?.value || 0));
});
function renderComments() {
  const comments = readComments();
  commentsList.replaceChildren();
  document.querySelector('#comment-total').textContent = `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`;
  if (!comments.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-comments';
    empty.textContent = 'No comments yet — be the first to share your experience.';
    commentsList.append(empty);
    return;
  }
  comments.slice().reverse().forEach(comment => {
    const item = document.createElement('article');
    item.className = 'comment-review-item';
    const initial = document.createElement('span');
    initial.className = 'comment-review-initial';
    initial.textContent = comment.name.trim().slice(0, 1).toUpperCase();
    const body = document.createElement('div');
    body.className = 'comment-review-content';
    const meta = document.createElement('div');
    meta.className = 'comment-review-meta';
    const author = document.createElement('strong');
    author.textContent = comment.name;
    const location = document.createElement('small');
    location.textContent = comment.location ? `· ${comment.location}` : (comment.date || 'Funseka customer');
    meta.append(author, location);
    const stars = document.createElement('div');
    stars.className = 'comment-review-stars';
    const score = Math.max(1, Math.min(5, Number(comment.rating) || 5));
    stars.setAttribute('aria-label', `${score} out of 5 stars`);
    stars.textContent = '★'.repeat(score) + '☆'.repeat(5 - score);
    const message = document.createElement('p');
    message.textContent = comment.message;
    body.append(meta, stars, message);
    item.append(initial, body);
    commentsList.append(item);
  });
}
commentForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!commentForm.reportValidity()) return;
  const data = new FormData(commentForm);
  const comments = readComments();
  comments.push({ name: String(data.get('name')).trim(), location: String(data.get('location') || '').trim(), rating: String(data.get('rating')), message: String(data.get('message')).trim(), date: new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short' }).format(new Date()) });
  try {
    localStorage.setItem(storageKey, JSON.stringify(comments.slice(-30)));
    renderComments();
    commentForm.reset();
    paintRating(0);
    document.querySelector('#comment-status').textContent = 'Thanks — your comment is posted on this device.';
  } catch {
    document.querySelector('#comment-status').textContent = 'This browser could not save your comment. Please contact us on WhatsApp.';
  }
});
renderComments();

const pageLoader = document.querySelector('#page-loader');
window.setTimeout(() => {
  pageLoader.classList.add('is-hidden');
  window.setTimeout(() => pageLoader.remove(), 500);
}, 1450);
