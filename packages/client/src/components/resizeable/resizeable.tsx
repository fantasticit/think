import React, { useRef, useEffect } from 'react';
import cls from 'classnames';
import { useClickOutside } from 'hooks/use-click-outside';
import interact from 'interactjs';
import styles from './style.module.scss';

type ISize = { width: number; height: number };

interface IProps {
  width: number;
  height: number;
  maxWidth?: number;
  onChange?: (arg: ISize) => void;
  onChangeEnd?: (arg: ISize) => void;
  className?: string;
}

const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;

function clamp(val: number, min: number, max: number): number {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}

export const Resizeable: React.FC<IProps> = ({
  width,
  height,
  maxWidth,
  className,
  onChange,
  onChangeEnd,
  children,
}) => {
  const $container = useRef<HTMLDivElement>(null);
  const $topLeft = useRef<HTMLDivElement>(null);
  const $topRight = useRef<HTMLDivElement>(null);
  const $bottomLeft = useRef<HTMLDivElement>(null);
  const $bottomRight = useRef<HTMLDivElement>(null);

  useClickOutside($container, {
    in: () => $container.current.classList.add(styles.isActive),
    out: () => $container.current.classList.remove(styles.isActive),
  });

  useEffect(() => {
    interact($container.current).resizable({
      edges: {
        top: true,
        right: true,
        bottom: true,
        left: true,
      },
      listeners: {
        move: function (event) {
          let { x, y } = event.target.dataset;
          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          let { width, height } = event.rect;
          width = clamp(width, MIN_WIDTH, maxWidth || Infinity);
          height = clamp(height, MIN_HEIGHT, Infinity);

          Object.assign(event.target.style, {
            width: `${width}px`,
            height: `${height}px`,
          });
          Object.assign(event.target.dataset, { x, y });
          onChange && onChange({ width, height });
        },
        end: function (event) {
          let { width, height } = event.rect;
          width = clamp(width, MIN_WIDTH, maxWidth || Infinity);
          height = clamp(height, MIN_HEIGHT, Infinity);

          onChangeEnd && onChangeEnd({ width, height });
        },
      },
    });
  }, [maxWidth]);

  useEffect(() => {
    Object.assign($container.current.style, {
      width: `${width}px`,
      height: `${height}px`,
    });
  }, [width, height]);

  return (
    <div
      id="js-resizeable-container"
      className={cls(className, styles.resizable)}
      ref={$container}
      style={{ width, height }}
    >
      <span className={styles.resizer + ' ' + styles.topLeft} ref={$topLeft} data-type={'topLeft'}></span>
      <span className={styles.resizer + ' ' + styles.topRight} ref={$topRight} data-type={'topRight'}></span>
      <span className={styles.resizer + ' ' + styles.bottomLeft} ref={$bottomLeft} data-type={'bottomLeft'}></span>
      <span className={styles.resizer + ' ' + styles.bottomRight} ref={$bottomRight} data-type={'bottomRight'}></span>
      {children}
    </div>
  );
};
