export function fixHTML(html) {
  const container = document.createElement('div');
  container.innerHTML = html;

  let el;

  while ((el = container.querySelector('a > img'))) {
    unwrapLink(el.parentNode, el.getAttribute('alt') || 'Image link');
  }

  while ((el = container.querySelector('p > img'))) {
    unwrap(el.parentNode);
  }

  while ((el = container.querySelector('a:not(p a)'))) {
    wrap(el, document.createElement('p'));
  }

  return container.innerHTML;
}

function unwrap(el) {
  const parent = el.parentNode;

  // Move all children to the parent element.
  while (el.firstChild) parent.insertBefore(el.firstChild, el);

  parent.removeChild(el);
}

function unwrapLink(el, replacementText) {
  const parent = el.parentNode;

  while (el.firstChild) parent.insertBefore(el.firstChild, el);

  el.textContent = replacementText;
}

function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}
