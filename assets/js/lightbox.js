// Click any photo in an entry to view it full-size.
// Arrow keys / buttons move between photos on the page; Esc closes.
(function () {
  var images = Array.prototype.slice.call(document.querySelectorAll('.media img'));
  if (!images.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button class="lb-close" aria-label="Close">×</button>' +
    '<button class="lb-prev" aria-label="Previous photo">‹</button>' +
    '<img alt="">' +
    '<p></p>' +
    '<button class="lb-next" aria-label="Next photo">›</button>';
  document.body.appendChild(box);

  var big = box.querySelector('img');
  var caption = box.querySelector('p');
  var current = 0;

  function show(i) {
    current = (i + images.length) % images.length;
    var img = images[current];
    var cap = img.closest('figure').querySelector('figcaption');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    caption.textContent = cap ? cap.textContent : '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
    images[current].focus && images[current].focus();
  }

  images.forEach(function (img, i) {
    img.tabIndex = 0;
    img.addEventListener('click', function () { show(i); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') show(i);
    });
  });

  var single = images.length === 1;
  box.querySelector('.lb-prev').hidden = single;
  box.querySelector('.lb-next').hidden = single;

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && !single) show(current - 1);
    else if (e.key === 'ArrowRight' && !single) show(current + 1);
  });
})();
