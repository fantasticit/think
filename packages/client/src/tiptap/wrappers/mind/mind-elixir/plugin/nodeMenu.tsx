import tippy from 'tippy.js';
import ReactDOM from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Tooltip, Space, Dropdown, Form } from '@douyinfe/semi-ui';
import { IconBold, IconFont, IconMark, IconLink } from '@douyinfe/semi-icons';
import { ColorPicker } from 'tiptap/menus/_components/color-picker';
import { findEle } from '../utils/dom';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';

export const Link = ({ mind, link, setLink }) => {
  const $form = useRef<FormApi>();
  const $input = useRef<HTMLInputElement>();
  const [initialState, setInitialState] = useState({ link });

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      setLink(values.link);
    });
  }, [setLink]);

  useEffect(() => {
    setInitialState({ link });
  }, [link]);

  return (
    <Dropdown
      stopPropagation
      zIndex={10000}
      trigger="click"
      position={'bottomLeft'}
      render={
        <div style={{ padding: 12 }}>
          <Form
            initValues={initialState}
            getFormApi={(formApi) => ($form.current = formApi)}
            labelPosition="left"
            onSubmit={handleOk}
            layout="horizontal"
          >
            <Form.Input
              autofocus
              label="链接"
              field="link"
              placeholder="请输入外链地址"
              onFocus={() => (mind.isInnerEditing = true)}
              onBlur={() => (mind.isInnerEditing = false)}
            />
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form>
        </div>
      }
    >
      <span style={{ display: 'inline-block' }}>
        <Tooltip content="设置链接" zIndex={10000}>
          <Button type="tertiary" theme="borderless" size="small" icon={<IconLink style={{ fontSize: '0.85em' }} />} />
        </Tooltip>
      </span>
    </Dropdown>
  );
};

const Toolbar = ({ mind, toggleBold, setFontColor, setBackgroundColor, setLink }) => {
  const [textColor, setTextColor] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [hyperLink, setHyperLink] = useState('');

  useEffect(() => {
    const listener = function (nodeObj, clickEvent) {
      if (!clickEvent) return;

      if (nodeObj.style) {
        setTextColor(nodeObj.style.color);
        setBgColor(nodeObj.style.background);
      } else {
        setTextColor('');
        setBgColor('');
      }

      setHyperLink(nodeObj.hyperLink);
    };

    mind.bus.addListener('selectNode', listener);

    return () => {
      mind.bus.removeListener('selectNode', listener);
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

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
          <Button
            type="tertiary"
            theme="borderless"
            size="small"
            icon={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <IconFont style={{ fontSize: '0.85em' }} />
                <span
                  style={{
                    width: 12,
                    height: 2,
                    backgroundColor: textColor,
                  }}
                ></span>
              </div>
            }
          />
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

      <Link mind={mind} link={hyperLink} setLink={setLink} />
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

  function setLink(link: string) {
    if (!mind.currentNode) return;
    mind.updateNodeHyperLink(mind.currentNode.nodeObj, link);
  }

  ReactDOM.render(
    <Toolbar
      mind={mind}
      toggleBold={toggleBold}
      setFontColor={setFontColor}
      setBackgroundColor={setBackgroundColor}
      setLink={setLink}
    />,
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
    offset: [-45, 45],
    appendTo: mind.container,
  }) as any;

  const onSelectNode = function (nodeObj) {
    const element = findEle(nodeObj.id, mind) as HTMLElement;
    toolbarInstance.setProps({
      getReferenceClientRect: () => element.getBoundingClientRect(),
    });
    toolbarInstance.show();
  };

  mind.bus.addListener('selectNode', onSelectNode);
  mind.bus.addListener('selectNewNode', onSelectNode);
  mind.bus.addListener('unselectNode', function () {
    toolbarInstance.hide();
  });
  mind.bus.addListener('removeNode', function (nodeObj) {
    const isRemoveCurrentNode = mind.currentNode && mind.currentNode.nodeObj.id === nodeObj.id;
    if (isRemoveCurrentNode) {
      toolbarInstance.hide();
    }
  });
}
