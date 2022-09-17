import { Dropdown, SideSheet, Typography } from '@douyinfe/semi-ui';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { useMemo } from 'react';

import styles from './style.module.scss';

const { Text } = Typography;

const colors = [
  '#000000',
  '#262626',
  '#595959',
  '#8C8C8C',
  '#BFBFBF',
  '#D9D9D9',
  '#E9E9E9',
  '#F5F5F5',
  '#FAFAFA',
  '#FFFFFF',
  '#F5222D',
  '#FA541C',
  '#FA8C16',
  '#FADB14',
  '#52C41A',
  '#13C2C2',
  '#1890FF',
  '#2F54EB',
  '#722ED1',
  '#EB2F96',
  '#FFE8E6',
  '#FFECE0',
  '#FFEFD1',
  '#FCFCCA',
  '#E4F7D2',
  '#D3F5F0',
  '#D4EEFC',
  '#DEE8FC',
  '#EFE1FA',
  '#FAE1EB',
  '#FFA39E',
  '#FFBB96',
  '#FFD591',
  '#FFFB8F',
  '#B7EB8F',
  '#87E8DE',
  '#91D5FF',
  '#ADC6FF',
  '#D3ADF7',
  '#FFADD2',
  '#FF4D4F',
  '#FF7A45',
  '#FFA940',
  '#FFEC3D',
  '#73D13D',
  '#36CFC9',
  '#40A9FF',
  '#597EF7',
  '#9254DE',
  '#F759AB',
  '#CF1322',
  '#D4380D',
  '#D46B08',
  '#D4B106',
  '#389E0D',
  '#08979C',
  '#096DD9',
  '#1D39C4',
  '#531DAB',
  '#C41D7F',
  '#820014',
  '#871400',
  '#873800',
  '#614700',
  '#135200',
  '#00474F',
  '#003A8C',
  '#061178',
  '#22075E',
  '#780650',
];

export const ColorPicker: React.FC<{
  title?: string;
  onSetColor: (arg: string) => void;
  disabled?: boolean;
}> = ({ children, title = '颜色管理', onSetColor, disabled = false }) => {
  const { isMobile } = IsOnMobile.useHook();
  const [visible, toggleVisible] = useToggle(false);

  const content = useMemo(
    () =>
      !visible ? null : (
        <div style={{ padding: isMobile ? '24px 0 24px' : '12px 16px', width: isMobile ? 'auto' : 272 }}>
          <div className={styles.emptyWrap} onClick={() => onSetColor(null)}>
            <span></span>
            <Text>无颜色</Text>
          </div>

          <div className={styles.colorWrap}>
            {colors.map((color) => {
              return (
                <div key={color} className={styles.colorItem} onClick={() => onSetColor(color)}>
                  <span style={{ backgroundColor: color }}></span>
                </div>
              );
            })}
          </div>
        </div>
      ),
    [onSetColor, isMobile, visible]
  );

  if (disabled) return <span style={{ display: 'inline-block' }}>{children}</span>;

  return (
    <span>
      {isMobile ? (
        <>
          <SideSheet
            headerStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
            placement="bottom"
            title={title}
            visible={visible}
            onCancel={toggleVisible}
            height={284}
            mask={false}
          >
            {content}
          </SideSheet>
          <span style={{ display: 'inline-block' }} onMouseDown={() => toggleVisible(true)}>
            {children}
          </span>
        </>
      ) : (
        <Dropdown
          visible={visible}
          onVisibleChange={toggleVisible}
          zIndex={10000}
          trigger="click"
          position={'bottomLeft'}
          render={content}
        >
          <span style={{ display: 'inline-block' }}>{children}</span>
        </Dropdown>
      )}
    </span>
  );
};
