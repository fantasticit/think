import React, { useCallback, useState } from 'react';
import cls from 'classnames';
import styles from './style.module.scss';

import { Resizable } from 're-resizable';

interface IProps {
  width: number;
  height: number;
  onChange?: (arg: { width: number; height: number }) => void;
  onChangeEnd?: (arg: { width: number; height: number }) => void;
  className?: string;
}

const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;

export const Resizeable: React.FC<IProps> = ({
  width: defaultWidth,
  height: defaultHeight,
  className,
  onChange,
  onChangeEnd,
  children,
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);

  const onResizeStop = useCallback(
    (e, direction, ref, d) => {
      const nextWidth = width + d.width;
      const nextHeight = height + d.height;
      setWidth(nextWidth);
      setHeight(nextHeight);
      onChangeEnd({ width: nextWidth, height: nextHeight });
    },
    [width, height]
  );

  return (
    <Resizable
      size={{ width, height }}
      className={cls(className, styles.resizable)}
      minWidth={MIN_WIDTH}
      minHeight={MIN_HEIGHT}
      onResizeStop={onResizeStop}
    >
      {children}
    </Resizable>
  );
};
