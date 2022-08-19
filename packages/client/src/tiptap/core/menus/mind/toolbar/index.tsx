import { IconBold, IconRedo, IconUndo } from '@douyinfe/semi-icons';
import { Button, Space, Tooltip } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { IconMindCenter } from 'components/icons';
import { IconZoomIn, IconZoomOut } from 'components/icons';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useState } from 'react';

import { BgColor } from './bgcolor';
import { FontColor } from './font-color';
import { Help } from './help';
import { Image } from './image';
import { Link } from './link';
import { Priority } from './priority';
import { Progress } from './progress';
import { Template } from './template';
import { Theme } from './theme';

export const Toolbar = ({ mind }) => {
  const [node, setNode] = useState(null); // 当前选择节点

  const [hasUndo, toggleHasUndo] = useToggle(false);
  const [hasRedo, toggleHasRedo] = useToggle(false);

  const [isBold, toggleIsBold] = useToggle(false);
  const [textColor, setTextColor] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');

  const [template, setTemplateState] = useState('');
  const [theme, setThemeState] = useState('');

  /**
   * 撤销
   */
  const undo = useCallback(() => {
    if (!mind) return;
    if (mind.editor.history.hasUndo()) {
      mind.editor.history.undo();
    }
  }, [mind]);

  /**
   * 重做
   */
  const redo = useCallback(() => {
    if (!mind) return;
    if (mind.editor.history.hasRedo()) {
      mind.editor.history.redo();
    }
  }, [mind]);

  /**
   * 加粗
   */
  const toggleBold = useCallback(() => {
    if (!mind) return;

    mind.execCommand('Bold');
  }, [mind]);

  /**
   * 设置文字颜色
   */
  const setFontColor = useCallback(
    (color) => {
      if (!mind) return;

      mind.execCommand('ForeColor', color);
    },
    [mind]
  );

  /**
   * 设置背景色
   */
  const setBackgroundColor = useCallback(
    (color) => {
      if (!mind) return;

      mind.execCommand('Background', color);
    },
    [mind]
  );

  /**
   * 设置链接
   */
  const setHyperLink = useCallback(
    (url) => {
      if (!mind) return;

      mind.execCommand('HyperLink', url);
    },
    [mind]
  );

  /**
   * 插入图片
   */
  const insertImage = useCallback(
    (url) => {
      if (!mind) return;

      mind.execCommand('Image', url);
    },
    [mind]
  );

  /**
   * 设置进度
   */
  const setProgress = useCallback(
    (value) => () => {
      if (!mind) return;

      const node = mind.getSelectedNode();
      if (!node) return;

      mind.execCommand('progress', value);
    },
    [mind]
  );

  /**
   * 设置优先级
   */
  const setPriority = useCallback(
    (value) => () => {
      if (!mind) return;

      const node = mind.getSelectedNode();
      if (!node) return;

      mind.execCommand('priority', value);
    },
    [mind]
  );

  /**
   * 模板
   */
  const setTemplate = useCallback(
    (template) => {
      if (!mind) return;

      mind.execCommand('template', template);
    },
    [mind]
  );

  /**
   * 主题
   */
  const setTheme = useCallback(
    (theme) => {
      if (!mind) return;

      mind.execCommand('theme', theme);
    },
    [mind]
  );

  /**
   * 缩放
   */
  const setZoom = useCallback(
    (type: 'minus' | 'plus') => {
      return () => {
        if (!mind) return;
        mind.execCommand(type === 'minus' ? 'zoomOut' : 'zoomIn');
      };
    },
    [mind]
  );

  /**
   * 定位到根节点
   */
  const setCenter = useCallback(() => {
    if (!mind) return;
    mind.execCommand('camera', mind.getRoot(), 600);
  }, [mind]);

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

      toggleHasUndo(mind.editor.history.hasUndo());
      toggleHasRedo(mind.editor.history.hasRedo());

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
  }, [mind, toggleHasUndo, toggleHasRedo, toggleIsBold, setBackgroundColor]);

  return (
    <Space>
      <Tooltip content="撤销">
        <Button
          onClick={undo}
          icon={<IconUndo />}
          disabled={!hasUndo}
          theme={hasUndo ? 'light' : 'borderless'}
          type="tertiary"
        />
      </Tooltip>

      <Tooltip content="重做">
        <Button
          onClick={redo}
          icon={<IconRedo />}
          disabled={!hasRedo}
          theme={hasRedo ? 'light' : 'borderless'}
          type="tertiary"
        />
      </Tooltip>

      <Divider />

      <Tooltip content="加粗" zIndex={10000}>
        <Button
          disabled={!node}
          theme={isBold ? 'light' : 'borderless'}
          type="tertiary"
          onClick={toggleBold}
          icon={<IconBold />}
        />
      </Tooltip>

      <FontColor selectedNode={node} textColor={textColor} setFontColor={setFontColor} />
      <BgColor selectedNode={node} bgColor={bgColor} setBackgroundColor={setBackgroundColor} />
      <Link disabled={!node} link={link} setLink={setHyperLink} />
      <Image disabled={!node} image={image} setImage={insertImage} />

      <Divider />

      <Progress selectedNode={node} setProgress={setProgress} />
      <Priority selectedNode={node} setPriority={setPriority} />

      <Divider />

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

      <Divider />

      <Template template={template} setTemplate={setTemplate} />
      <Theme theme={theme} setTheme={setTheme} />

      <Divider />

      <Help />
    </Space>
  );
};
