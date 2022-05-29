import { IconArticle } from '@douyinfe/semi-icons';
import { Button, Popover, Radio, RadioGroup, Slider, Typography } from '@douyinfe/semi-ui';
import { throttle } from 'helpers/throttle';
import { useDocumentStyle } from 'hooks/use-document-style';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { useMemo } from 'react';

import styles from './index.module.scss';

const { Text } = Typography;

export const DocumentStyle = () => {
  const { isMobile } = IsOnMobile.useHook();
  const { width, fontSize, setWidth, setFontSize } = useDocumentStyle();
  const [visible, toggleVisible] = useToggle(false);
  const throttleSetWidth = useMemo(() => {
    return throttle((e) => {
      setWidth(e.target.value);
    }, 200);
  }, [setWidth]);

  return (
    <Popover
      key="style"
      showArrow
      trigger="click"
      zIndex={1061}
      position={isMobile ? 'topRight' : 'bottomLeft'}
      visible={visible}
      onVisibleChange={toggleVisible}
      style={{ padding: 0 }}
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
              <RadioGroup type="button" value={width} onChange={throttleSetWidth} style={{ marginTop: '0.5em' }}>
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
