import { IconBold, IconFont, IconHelpCircle, IconMark } from '@douyinfe/semi-icons';
import { Button, Descriptions, Popover, Space, Tooltip, Typography } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { IconDrawBoard, IconMindCenter, IconStructure } from 'components/icons';
import { IconZoomIn, IconZoomOut } from 'components/icons';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useState } from 'react';
import { ColorPicker } from 'tiptap/components/color-picker';
import { clamp } from 'tiptap/prose-utils';

import { MAX_ZOOM, MIN_ZOOM, TEMPLATES, THEMES, ZOOM_STEP } from '../constant';
import { Image } from './image';
import styles from './index.module.scss';
import { Link } from './link';

const { Text } = Typography;

const HELP_MESSAGE = [
  { key: '新增同级节点', value: 'Enter 键' },
  { key: '新增子节点', value: 'Tab 键' },
  { key: '编辑节点文字', value: '双击节点' },
  { key: '编辑节点菜单', value: '在节点右键' },
];

const HELP_MESSAGE_STYLE = {
  width: '200px',
};

export const Toolbar = ({ mind }) => {
  const [template, setTemplateState] = useState('');
  const [theme, setThemeState] = useState('');
  const [node, setNode] = useState(null);
  const [isBold, toggleIsBold] = useToggle(false);
  const [textColor, setTextColor] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');

  const setTemplate = useCallback(
    (template) => {
      mind.execCommand('template', template);
    },
    [mind]
  );

  const setTheme = useCallback(
    (theme) => {
      mind.execCommand('theme', theme);
    },
    [mind]
  );

  const setZoom = useCallback(
    (type: 'minus' | 'plus') => {
      return () => {
        if (!mind) return;
        const currentZoom = mind.getZoomValue();
        const nextZoom = clamp(
          type === 'minus' ? currentZoom - ZOOM_STEP : currentZoom + ZOOM_STEP,
          MIN_ZOOM,
          MAX_ZOOM
        );
        mind.zoom(nextZoom);
      };
    },
    [mind]
  );

  const setCenter = useCallback(() => {
    if (!mind) return;
    mind.execCommand('camera');
  }, [mind]);

  const toggleBold = useCallback(() => {
    mind.execCommand('Bold');
  }, [mind]);

  const setFontColor = useCallback(
    (color) => {
      mind.execCommand('ForeColor', color);
    },
    [mind]
  );

  const setBackgroundColor = useCallback(
    (color) => {
      mind.execCommand('Background', color);
    },
    [mind]
  );

  const setHyperLink = useCallback(
    (url) => {
      mind.execCommand('HyperLink', url);
    },
    [mind]
  );

  const insertImage = useCallback(
    (url) => {
      mind.execCommand('Image', url);
    },
    [mind]
  );

  useEffect(() => {
    if (!mind) return;

    const handler = () => {
      const node = mind.getSelectedNode();

      let isBold = false;
      let textColor;
      let bgColor;
      let link;
      let image;

      if (node) {
        isBold = mind.queryCommandState('Bold') === 1;
        textColor = mind.queryCommandValue('ForeColor');
        bgColor = mind.queryCommandValue('Background');
        link = mind.queryCommandValue('HyperLink').url;
        image = mind.queryCommandValue('Image').url;
        setNode(node);
      } else {
        setNode(null);
      }

      setTemplateState(mind.queryCommandValue('Template'));
      setThemeState(mind.queryCommandValue('Theme'));
      toggleIsBold(isBold);
      setTextColor(textColor);
      setBgColor(bgColor);
      setLink(link);
      setImage(image);
    };

    mind.on('interactchange', handler);

    return () => {
      mind.off('interactchange', handler);
    };
  }, [mind, toggleIsBold, setBackgroundColor]);

  return (
    <Space>
      <Popover
        zIndex={10000}
        spacing={10}
        style={{ padding: '0 12px 12px', overflow: 'hidden' }}
        position="bottomLeft"
        content={
          <section className={styles.sectionWrap}>
            <Text type="secondary">布局</Text>
            <div>
              <ul>
                {TEMPLATES.map((item) => {
                  return (
                    <li
                      key={item.label}
                      className={cls(template === item.value && styles.active)}
                      onClick={() => setTemplate(item.value)}
                    >
                      <Text>{item.label}</Text>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        }
      >
        <Button icon={<IconStructure />} type="tertiary" theme="borderless" size="small" />
      </Popover>

      <Popover
        zIndex={10000}
        spacing={10}
        style={{ padding: '0 12px 12px', overflow: 'hidden' }}
        position="bottomLeft"
        content={
          <section className={styles.sectionWrap}>
            <Text type="secondary">主题</Text>
            <div>
              <ul>
                {THEMES.map((item) => {
                  return (
                    <li
                      key={item.label}
                      className={cls(theme === item.value && styles.active)}
                      style={item.style || {}}
                      onClick={() => setTheme(item.value)}
                    >
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        }
      >
        <Button icon={<IconDrawBoard />} type="tertiary" theme="borderless" size="small" />
      </Popover>

      <Tooltip content="居中">
        <Button
          size="small"
          theme="borderless"
          type="tertiary"
          icon={<IconMindCenter style={{ fontSize: '0.85em' }} />}
          onClick={setCenter}
        />
      </Tooltip>

      <Tooltip content="缩小">
        <Button
          size="small"
          theme="borderless"
          type="tertiary"
          icon={<IconZoomOut style={{ fontSize: '0.85em' }} />}
          onClick={setZoom('minus')}
        />
      </Tooltip>

      <Tooltip content="放大">
        <Button
          size="small"
          theme="borderless"
          type="tertiary"
          icon={<IconZoomIn style={{ fontSize: '0.85em' }} />}
          onClick={setZoom('plus')}
        />
      </Tooltip>

      <Tooltip content="加粗" zIndex={10000}>
        <Button
          disabled={!node}
          type="tertiary"
          theme={isBold ? 'light' : 'borderless'}
          onClick={toggleBold}
          icon={<IconBold />}
        />
      </Tooltip>

      <ColorPicker
        onSetColor={(color) => {
          setFontColor(color);
        }}
      >
        <Tooltip content="文本色" zIndex={10000}>
          <Button
            disabled={!node}
            type="tertiary"
            theme={textColor ? 'light' : 'borderless'}
            icon={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <IconFont />
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
          <Button
            disabled={!node}
            type="tertiary"
            theme={bgColor ? 'light' : 'borderless'}
            icon={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <IconMark />
                <span
                  style={{
                    width: 12,
                    height: 2,
                    backgroundColor: bgColor,
                  }}
                ></span>
              </div>
            }
          />
        </Tooltip>
      </ColorPicker>

      <Link disabled={!node} link={link} setLink={setHyperLink} />

      <Image disabled={!node} image={image} setImage={insertImage} />

      <Popover
        zIndex={10000}
        spacing={10}
        style={{ padding: 12, overflow: 'hidden' }}
        position="bottomLeft"
        content={
          <section className={styles.sectionWrap}>
            <Descriptions data={HELP_MESSAGE} style={HELP_MESSAGE_STYLE} />
          </section>
        }
      >
        <Button size="small" theme="borderless" type="tertiary" icon={<IconHelpCircle />} />
      </Popover>
    </Space>
  );
};
