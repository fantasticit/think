import React from 'react';
import { RadioGroup, Radio, Typography, Slider, Popover, Button } from '@douyinfe/semi-ui';
import { IconArticle } from '@douyinfe/semi-icons';
import { useWindowSize } from 'hooks/use-window-size';
import { useDocumentStyle } from 'hooks/use-document-style';
import { useToggle } from 'hooks/use-toggle';
import styles from './index.module.scss';

const { Text } = Typography;

export const DocumentStyle = () => {
  const { isMobile } = useWindowSize();
  const { width, fontSize, setWidth, setFontSize } = useDocumentStyle();
  const [visible, toggleVisible] = useToggle(false);

  return (
    <Popover
      key="style"
      zIndex={1061}
      position={isMobile ? 'topRight' : 'bottomLeft'}
      visible={visible}
      onVisibleChange={toggleVisible}
      content={
        <div className={styles.wrap}>
          <div className={styles.item}>
            <Text>正文大小</Text>
            <Text style={{ fontSize: '0.8em' }}> {fontSize}px</Text>
            <Slider min={12} max={24} step={1} tooltipVisible={false} value={fontSize} onChange={setFontSize} />
          </div>
          <div className={styles.item}>
            <Text>页面尺寸</Text>
            <div>
              <RadioGroup
                type="button"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                style={{ marginTop: '0.5em' }}
              >
                <Radio value={'standardWidth'}>标宽模式</Radio>
                <Radio value={'fullWidth'}>超宽模式</Radio>
              </RadioGroup>
            </div>
          </div>
        </div>
      }
    >
      <Button icon={<IconArticle />} theme="borderless" type="tertiary" onMouseDown={toggleVisible} />
    </Popover>
  );
};
