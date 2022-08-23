import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import zhCN from '@react-pdf-viewer/locales/lib/zh_CN.json';
import React from 'react';

import styles from './index.module.scss';

interface IProps {
  url: string;
}

export const PDFPlayer: React.FC<IProps> = ({ url }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className={styles.playerWrap}>
      <Viewer fileUrl={url} localization={zhCN} plugins={[defaultLayoutPluginInstance]} />
    </div>
  );
};
