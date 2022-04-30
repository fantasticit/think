import tippy from 'tippy.js';
import ReactDOM from 'react-dom';
import { Button, Tooltip, Space } from '@douyinfe/semi-ui';
import { IconBold, IconFont, IconMark } from '@douyinfe/semi-icons';
import { ColorPicker } from 'tiptap/menus/_components/color-picker';
import { findEle } from '../utils/dom';

const Toolbar = ({ toggleBold, setFontColor, setBackgroundColor }) => {
  return (
    <Space spacing={4}>
      <Tooltip content="加粗" zIndex={10000}>
        <Button
          type="tertiary"
          theme="borderless"
          size="small"
          onClick={toggleBold}
          icon={<IconBold style={{ fontSize: '0.85em' }} />}
        />
      </Tooltip>

      <ColorPicker
        onSetColor={(color) => {
          setFontColor(color);
        }}
      >
        <Tooltip content="文本色" zIndex={10000}>
          <Button type="tertiary" theme="borderless" size="small" icon={<IconFont style={{ fontSize: '0.85em' }} />} />
        </Tooltip>
      </ColorPicker>

      <ColorPicker
        onSetColor={(color) => {
          setBackgroundColor(color);
        }}
      >
        <Tooltip content="背景色" zIndex={10000}>
          <Button type="tertiary" theme="borderless" size="small" icon={<IconMark />} />
        </Tooltip>
      </ColorPicker>
    </Space>
  );
};

export default function (mind) {
  const menuContainer = document.createElement('div');
  menuContainer.classList.add('node-toolbar-container');

  function toggleBold() {
    if (!mind.currentNode) return;
    if (!mind.currentNode.nodeObj.style) mind.currentNode.nodeObj.style = {};
    if (mind.currentNode.nodeObj.style.fontWeight === 'bold') {
      delete mind.currentNode.nodeObj.style.fontWeight;
      mind.updateNodeStyle(mind.currentNode.nodeObj);
    } else {
      mind.currentNode.nodeObj.style.fontWeight = 'bold';
      mind.updateNodeStyle(mind.currentNode.nodeObj);
    }
  }

  function setFontColor(color) {
    if (!mind.currentNode) return;
    if (!mind.currentNode.nodeObj.style) mind.currentNode.nodeObj.style = {};
    mind.currentNode.nodeObj.style.color = color;
    mind.updateNodeStyle(mind.currentNode.nodeObj);
  }

  function setBackgroundColor(color) {
    if (!mind.currentNode) return;
    if (!mind.currentNode.nodeObj.style) mind.currentNode.nodeObj.style = {};
    mind.currentNode.nodeObj.style.background = color;
    mind.updateNodeStyle(mind.currentNode.nodeObj);
  }

  function setTags(newTags: string[]) {
    if (!mind.currentNode) return;
    mind.updateNodeTags(mind.currentNode.nodeObj, newTags);
  }

  function setIcons(newIcons: string[]) {
    if (!mind.currentNode) return;
    mind.updateNodeIcons(mind.currentNode.nodeObj, newIcons);
  }

  ReactDOM.render(
    <Toolbar toggleBold={toggleBold} setFontColor={setFontColor} setBackgroundColor={setBackgroundColor} />,
    menuContainer
  );

  const toolbarInstance = tippy(mind.container, {
    duration: 0,
    getReferenceClientRect: null,
    content: menuContainer,
    interactive: true,
    trigger: 'manual',
    placement: 'top',
    hideOnClick: 'toggle',
    offset: [-42, 40],
    appendTo: mind.container,
  }) as any;

  mind.bus.addListener('selectNode', function (nodeObj, clickEvent) {
    if (!clickEvent) return;
    const element = findEle(nodeObj.id, mind) as HTMLElement;
    toolbarInstance.setProps({
      getReferenceClientRect: () => element.getBoundingClientRect(),
    });
    toolbarInstance.show();
  });

  mind.bus.addListener('unselectNode', function () {
    toolbarInstance.hide();
  });
}
