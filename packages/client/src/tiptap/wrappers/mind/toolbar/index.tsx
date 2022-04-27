import cls from 'classnames';
import { Button, Popover, Typography } from '@douyinfe/semi-ui';
import { IconMinus, IconPlus, IconAlignCenter } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { IconStructure, IconDrawBoard, IconZoomIn, IconZoomOut } from 'components/icons';
import { Divider } from '../../../divider';
import { TEMPLATES, THEMES, MAX_ZOOM, MIN_ZOOM } from './constant';
import styles from './index.module.scss';

const { Text } = Typography;

interface IProps {
  isEditable: boolean;
  zoom: number | string;
  template: string;
  theme: string;
  setZoomMinus: () => void;
  setZoomPlus: () => void;
  setCenter: () => void;
  setTemplate: (arg: string) => void;
  setTheme: (arg: string) => void;
}

export const Toolbar: React.FC<IProps> = ({
  isEditable,
  template,
  theme,
  zoom,
  setZoomMinus,
  setZoomPlus,
  setCenter,
  setTemplate,
  setTheme,
}) => {
  return (
    <div className={styles.wrap}>
      {isEditable ? (
        <>
          <Tooltip content="缩小" position="right">
            <Button
              size="small"
              type="tertiary"
              theme="borderless"
              disabled={+zoom <= MIN_ZOOM}
              icon={<IconZoomOut />}
              onClick={setZoomMinus}
            />
          </Tooltip>
          <Text style={{ width: 26, textAlign: 'center' }}>{zoom}</Text>
          <Tooltip content="放大" position="right">
            <Button
              size="small"
              type="tertiary"
              theme="borderless"
              disabled={+zoom >= MAX_ZOOM}
              icon={<IconZoomIn />}
              onClick={setZoomPlus}
            />
          </Tooltip>

          <Tooltip content="居中" position="right">
            <Button size="small" type="tertiary" theme="borderless" icon={<IconAlignCenter />} onClick={setCenter} />
          </Tooltip>

          <Popover
            position="right"
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
            position="right"
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
        </>
      ) : (
        <>
          <Tooltip content="缩小" position="right">
            <Button
              size="small"
              theme="borderless"
              type="tertiary"
              icon={<IconMinus style={{ fontSize: 14 }} />}
              onClick={setZoomMinus}
            />
          </Tooltip>
          <Tooltip content="放大" position="right">
            <Button
              size="small"
              theme="borderless"
              type="tertiary"
              icon={<IconPlus style={{ fontSize: 14 }} />}
              onClick={setZoomPlus}
            />
          </Tooltip>
          <Tooltip content="居中" position="right">
            <Button
              size="small"
              theme="borderless"
              type="tertiary"
              icon={<IconAlignCenter style={{ fontSize: 14 }} />}
              onClick={setCenter}
            />
          </Tooltip>
        </>
      )}
    </div>
  );
};
