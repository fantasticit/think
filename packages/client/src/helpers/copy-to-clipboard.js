/* eslint-disable */
'use strict';

var deselectCurrent = require('toggle-selection');

function copy(text, onCopy) {
  var reselectPrevious,
    range,
    selection,
    mark,
    success = false;

  reselectPrevious = deselectCurrent();
  range = document.createRange();
  selection = document.getSelection();

  mark = document.createElement('span');
  mark.textContent = text;
  mark.style.all = 'unset';
  mark.style.position = 'fixed';
  mark.style.top = 0;
  mark.style.clip = 'rect(0, 0, 0, 0)';
  mark.style.whiteSpace = 'pre';
  mark.style.webkitUserSelect = 'text';
  mark.style.MozUserSelect = 'text';
  mark.style.msUserSelect = 'text';
  mark.style.userSelect = 'text';
  mark.addEventListener('copy', function (e) {
    var data = [];

    if (typeof text === 'string') {
      data = [{ format: 'text/plain', text: text }];
    } else if (Array.isArray(text)) {
      text.forEach(function (item) {
        data.push({
          format: item.format || 'text/plain',
          text: item.text || item,
        });
      });
    } else {
      data.push({
        format: 'text/plain',
        text: text,
      });
    }

    data.forEach(function (item) {
      e.clipboardData.setData(item.format, item.text);
    });

    e.preventDefault();

    onCopy && onCopy();
  });

  document.body.appendChild(mark);
  range.selectNodeContents(mark);
  selection.addRange(range);
  var successful = document.execCommand('copy');

  if (!successful) {
    throw new Error('copy command was unsuccessful');
  }

  success = true;
  return success;
}

module.exports = copy;
