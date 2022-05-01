export default function (mind, option?) {
  const createLi = (id, name) => {
    const div = document.createElement('div');
    div.id = id;
    div.innerHTML = `<svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-${name}"></use>
  </svg>`;
    return div;
  };

  const add_child = createLi('cm-add_child', 'zijiedian');
  const add_sibling = createLi('cm-add_sibling', 'tongjijiedian-');
  const remove_child = createLi('cm-remove_child', 'shanchu2');
  const up = createLi('cm-up', 'rising');
  const down = createLi('cm-down', 'falling');
  const edit = createLi('cm-edit', 'edit');

  const menuUl = document.createElement('ul');
  menuUl.className = 'menu-list';

  if (option && option.extend) {
    for (let i = 0; i < option.extend.length; i++) {
      const item = option.extend[i];
      const dom = createLi(item.name, item.name);
      menuUl.appendChild(dom);
      dom.onclick = (e) => {
        item.onclick(e);
      };
    }
  }
  const menuContainer = document.createElement('mmenu');
  menuContainer.appendChild(add_child);
  menuContainer.appendChild(add_sibling);
  menuContainer.appendChild(remove_child);
  menuContainer.appendChild(up);
  menuContainer.appendChild(down);
  menuContainer.appendChild(edit);
  menuContainer.hidden = true;

  mind.container.append(menuContainer);
  let isRoot = true;

  mind.bus.addListener('unselectNode', function () {
    menuContainer.hidden = true;
  });
  mind.bus.addListener('selectNode', function (nodeObj) {
    menuContainer.hidden = false;
    if (nodeObj.root) {
      isRoot = true;
    } else {
      isRoot = false;
    }
  });
  menuContainer.onclick = (e) => {
    if (e.target === menuContainer) menuContainer.hidden = true;
  };

  add_child.onclick = (e) => {
    mind.addChild();
  };
  add_sibling.onclick = (e) => {
    if (isRoot) return;
    mind.insertSibling();
  };
  remove_child.onclick = (e) => {
    if (isRoot) return;
    mind.removeNode();
  };
  up.onclick = (e) => {
    if (isRoot) return;
    mind.moveUpNode();
  };
  down.onclick = (e) => {
    if (isRoot) return;
    mind.moveDownNode();
  };
  edit.onclick = (e) => {
    mind.beginEdit();
  };
}
