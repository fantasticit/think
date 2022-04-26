import { useCallback } from 'react';
import { useRouter } from 'next/router';
import cls from 'classnames';
import { Space, Button, List, Popover, Typography, RadioGroup, Radio } from '@douyinfe/semi-ui';
import { IconEdit, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { IconStructure, IconDrawBoard, IconZoomIn, IconZoomOut } from 'components/icons';
import { BubbleMenu } from '../../views/bubble-menu';
import { Mind } from '../../extensions/mind';
import { Divider } from '../../divider';
import { clamp } from '../../utils/clamp';
import { TEMPLATES, THEMES, MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from './constant';
import styles from './bubble.module.scss';

const { Text } = Typography;

export const MindBubbleMenu = ({ editor }) => {
  const { template, theme, zoom } = editor.getAttributes(Mind.name);

  const setZoom = useCallback(
    (type: 'minus' | 'plus') => {
      return () => {
        editor
          .chain()
          .updateAttributes(Mind.name, {
            zoom: clamp(type === 'minus' ? parseInt(zoom) - ZOOM_STEP : parseInt(zoom) + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM),
          })
          .focus()
          .run();
      };
    },
    [editor, zoom]
  );

  const setTemplate = useCallback(
    (template) => {
      editor
        .chain()
        .updateAttributes(Mind.name, {
          template,
        })
        .focus()
        .run();
    },
    [editor]
  );

  const setTheme = useCallback(
    (theme) => {
      editor
        .chain()
        .updateAttributes(Mind.name, {
          theme,
        })
        .focus()
        .run();
    },
    [editor]
  );

  const deleteNode = useCallback(() => editor.chain().deleteSelection().run(), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="mind-bubble-menu"
      shouldShow={() => editor.isActive(Mind.name)}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space>
        <Tooltip content="缩小">
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            disabled={+zoom <= MIN_ZOOM}
            icon={<IconZoomOut />}
            onClick={setZoom('minus')}
          />
        </Tooltip>
        <Text style={{ width: 20, textAlign: 'center' }}>{zoom}</Text>
        <Tooltip content="放大">
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            disabled={+zoom >= MAX_ZOOM}
            icon={<IconZoomIn />}
            onClick={setZoom('plus')}
          />
        </Tooltip>

        <Popover
          zIndex={10000}
          spacing={10}
          style={{ padding: '0 12px 12px', overflow: 'hidden' }}
          content={
            <section className={styles.sectionWrap}>
              <Text type="secondary">布局</Text>
              <div>
                <ul>
                  {TEMPLATES.map((item) => {
                    return (
                      <li
                        className={cls(template === item.value && styles.active)}
                        onClick={() => setTemplate(item.value)}
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
          <Button icon={<IconStructure />} type="tertiary" theme="borderless" size="small" />
        </Popover>

        <Popover
          zIndex={10000}
          spacing={10}
          style={{ padding: '0 12px 12px', overflow: 'hidden' }}
          content={
            <section className={styles.sectionWrap}>
              <Text type="secondary">主题</Text>
              <div>
                <ul>
                  {THEMES.map((item) => {
                    return (
                      <li
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
        <Divider />
        <Tooltip content="删除节点" hideOnClick>
          <Button onClick={deleteNode} icon={<IconDelete />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
