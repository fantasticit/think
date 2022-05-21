import { IconHelpCircle, IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { Button, Descriptions, Modal, Popover, Space, Spin, Typography } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { IconDrawBoard, IconMindCenter, IconStructure } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { load, renderMind } from 'thirtypart/kityminder';
import { Editor } from 'tiptap/editor';
import { clamp } from 'tiptap/prose-utils';

import { cancelSubject, OPEN_MIND_SETTING_MODAL, subject } from '../_event';
import { MAX_ZOOM, MIN_ZOOM, TEMPLATES, THEMES, ZOOM_STEP } from './constant';
import styles from './style.module.scss';

type IProps = { editor: Editor };

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

export const MindSettingModal: React.FC<IProps> = ({ editor }) => {
  const $mind = useRef(null);
  const [initialData, setInitialData] = useState({ template: '', theme: '' });
  const [template, setTemplateState] = useState('');
  const [theme, setThemeState] = useState('');
  const [visible, toggleVisible] = useToggle(false);
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState(null);

  const setZoom = useCallback((type: 'minus' | 'plus') => {
    return () => {
      const mind = $mind.current;
      if (!mind) return;
      const currentZoom = mind.getZoomValue();
      const nextZoom = clamp(type === 'minus' ? currentZoom - ZOOM_STEP : currentZoom + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
      mind.zoom(nextZoom);
    };
  }, []);

  const setCenter = useCallback(() => {
    const mind = $mind.current;
    if (!mind) return;
    mind.execCommand('camera');
  }, []);

  const setTemplate = useCallback((template) => {
    const mind = $mind.current;
    if (!mind) return;
    mind.execCommand('template', template);
    setTemplateState(template);
  }, []);

  const setTheme = useCallback((theme) => {
    const mind = $mind.current;
    if (!mind) return;
    mind.execCommand('theme', theme);
    setThemeState(theme);
  }, []);

  const setMind = useCallback(
    (div) => {
      if (!div) return;

      if ($mind.current) {
        $mind.current.destroy();
        $mind.current = null;
      }

      $mind.current = renderMind({
        container: div,
        data: initialData,
        isEditable: true,
      });
    },
    [initialData]
  );

  useEffect(() => {
    load()
      .catch(setError)
      .finally(() => toggleLoading(false));

    return () => {
      if ($mind.current) {
        $mind.current.destroy();
        $mind.current = null;
      }
    };
  }, [toggleLoading]);

  const save = useCallback(() => {
    if (!$mind.current) {
      toggleVisible(false);
      return;
    }
    const data = $mind.current.exportJson();
    editor.chain().focus().setMind({ data }).run();
    toggleVisible(false);
  }, [editor, toggleVisible]);

  useEffect(() => {
    const handler = (data) => {
      toggleVisible(true);
      if (data) {
        setInitialData(data.data);
        setTemplateState(data.data.template);
        setThemeState(data.data.theme);
      }
    };

    subject(editor, OPEN_MIND_SETTING_MODAL, handler);

    return () => {
      cancelSubject(editor, OPEN_MIND_SETTING_MODAL, handler);
    };
  }, [editor, toggleVisible]);

  return (
    <Modal
      centered
      title="思维导图"
      fullScreen
      visible={visible}
      onCancel={toggleVisible}
      onOk={save}
      okText="保存"
      cancelText="退出"
    >
      <div
        style={{
          position: 'relative',
          height: 'calc(100vh - 152px)',
          margin: '0 -24px',
          border: '1px solid var(--semi-color-border)',
        }}
      >
        {loading && (
          <Spin spinning>
            {/* FIXME: semi-design 的问题，不加 div，文字会换行! */}
            <div></div>
          </Spin>
        )}
        {error && <Text>{(error && error.message) || '未知错误'}</Text>}
        <div style={{ height: '100%', maxHeight: '100%', overflow: 'hidden' }} ref={setMind}></div>

        <div className={styles.toolbarWrap}>
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
                icon={<IconMinus style={{ fontSize: '0.85em' }} />}
                onClick={setZoom('minus')}
              />
            </Tooltip>
            <Tooltip content="放大">
              <Button
                size="small"
                theme="borderless"
                type="tertiary"
                icon={<IconPlus style={{ fontSize: '0.85em' }} />}
                onClick={setZoom('plus')}
              />
            </Tooltip>

            <Popover
              zIndex={10000}
              spacing={10}
              style={{ padding: '0 12px 12px', overflow: 'hidden' }}
              position="bottomLeft"
              content={
                <section className={styles.sectionWrap}>
                  <Descriptions data={HELP_MESSAGE} style={HELP_MESSAGE_STYLE} />
                </section>
              }
            >
              <Button
                size="small"
                theme="borderless"
                type="tertiary"
                icon={<IconHelpCircle style={{ fontSize: '0.85em' }} />}
              />
            </Popover>
          </Space>
        </div>
      </div>
    </Modal>
  );
};
