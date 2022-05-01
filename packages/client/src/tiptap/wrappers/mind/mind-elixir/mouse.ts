import { dragMoveHelper } from './utils/index';

export default function (mind) {
  const onClick = (e) => {
    // if (dragMoveHelper.afterMoving) return
    // e.preventDefault() // can cause a tag don't work
    if (e.target.nodeName === 'EPD') {
      mind.expandNode(e.target.previousSibling);
    } else if (e.target.parentElement.nodeName === 'T' || e.target.parentElement.nodeName === 'ROOT') {
      mind.selectNode(e.target, false, e);
    } else if (e.target.nodeName === 'path') {
      if (e.target.parentElement.nodeName === 'g') {
        mind.selectLink(e.target.parentElement);
      }
    } else if (e.target.className === 'circle') {
      // skip circle
    } else {
      mind.unselectNode();
      mind.hideLinkController();
    }
  };

  const onDbClick = (e) => {
    e.preventDefault();
    if (!mind.editable) return;
    if (e.target.parentElement.nodeName === 'T' || e.target.parentElement.nodeName === 'ROOT') {
      mind.beginEdit(e.target);
    }
  };

  const onMouseMove = (e) => {
    // click trigger mousemove in windows chrome
    // the 'true' is a string
    if (e.target.contentEditable !== 'true') {
      dragMoveHelper.onMove(e, mind.container);
    }
  };

  const onMouseDown = (e) => {
    if (e.target.contentEditable !== 'true') {
      dragMoveHelper.afterMoving = false;
      dragMoveHelper.mousedown = true;
    }
  };

  const onMouseLeave = (e) => {
    dragMoveHelper.clear();
  };

  const onMouseUp = (e) => {
    dragMoveHelper.clear();
  };

  mind.map.addEventListener('click', onClick);
  mind.map.addEventListener('dblclick', onDbClick);
  mind.map.addEventListener('mousemove', onMouseMove);
  mind.map.addEventListener('mousedown', onMouseDown);
  mind.map.addEventListener('mouseleave', onMouseLeave);
  mind.map.addEventListener('mouseup', onMouseUp);

  mind.bus.addListener('destroy', () => {
    mind.map.removeEventListener('click', onClick);
    mind.map.removeEventListener('dblclick', onDbClick);
    mind.map.removeEventListener('mousemove', onMouseMove);
    mind.map.removeEventListener('mousedown', onMouseDown);
    mind.map.removeEventListener('mouseleave', onMouseLeave);
    mind.map.removeEventListener('mouseup', onMouseUp);
  });
}
