import cls from 'classnames';
import { useClickOutside } from 'hooks/use-click-outside';
import interact from 'interactjs';
import React, { useEffect, useRef } from 'react';

import styles from './style.module.scss';

type ISize = { width: number; height: number };

interface IProps {
  width: number;
  height: number;
  maxWidth?: number;
  isEditable?: boolean;
  onChange?: (arg: ISize) => void;
  onChangeEnd?: (arg: ISize) => void;
  className?: string;
  style?: React.CSSProperties;
}

const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;

function clamp(val: number, min: number, max: number): string {
  if (val < min) {
    return '' + min;
  }
  if (val > max) {
    return '' + max;
  }
  return '' + val;
}

function calcWidth(width, minWidth, maxWidth) {
  const val = parseInt(clamp(width, minWidth, maxWidth || Infinity));
  return val === maxWidth ? '100%' : val;
}

export const Resizeable: React.FC<IProps> = ({
  width,
  height,
  maxWidth,
  isEditable = false,
  className,
  onChange,
  onChangeEnd,
  style = {},
  children,
}) => {
  const $container = useRef<HTMLDivElement>(null);
  const $cloneNode = useRef<HTMLDivElement>(null);
  const $cloneNodeTip = useRef<HTMLDivElement>(null);
  const $placeholderNode = useRef<HTMLDivElement>(null);
  const $topLeft = useRef<HTMLDivElement>(null);
  const $topRight = useRef<HTMLDivElement>(null);
  const $bottomLeft = useRef<HTMLDivElement>(null);
  const $bottomRight = useRef<HTMLDivElement>(null);

  useClickOutside($container, {
    in: () => $container.current && $container.current.classList.add(styles.isActive),
    out: () => $container.current && $container.current.classList.remove(styles.isActive),
  });

  useEffect(() => {
    if (!isEditable || !$container.current) return;

    interact($container.current).resizable({
      edges: {
        top: true,
        right: true,
        bottom: true,
        left: true,
      },
      listeners: {
        move: function (event) {
          const placeholderNode = $placeholderNode.current;
          Object.assign(placeholderNode.style, {
            opacity: 0,
          });

          const cloneNode = $cloneNode.current;
          let { width, height } = event.rect;
          width = calcWidth(width, MIN_WIDTH, maxWidth || Infinity);
          height = parseInt(clamp(height, MIN_HEIGHT, Infinity));
          Object.assign(cloneNode.style, {
            width: `${width}px`,
            height: `${height}px`,
            zIndex: 1000,
          });

          const tipNode = $cloneNodeTip.current;
          tipNode.innerText = `${width}x${height}`;

          onChange && onChange({ width, height });
        },
        end: function (event) {
          let { width, height } = event.rect;
          width = calcWidth(width, MIN_WIDTH, maxWidth || Infinity);
          height = clamp(height, MIN_HEIGHT, Infinity);

          const cloneNode = $cloneNode.current;
          Object.assign(cloneNode.style, {
            zIndex: -1,
          });

          const tipNode = $cloneNodeTip.current;
          tipNode.innerText = ``;

          const placeholderNode = $placeholderNode.current;
          Object.assign(placeholderNode.style, {
            opacity: 1,
          });

          onChangeEnd && onChangeEnd({ width, height });
        },
      },
    });
  }, [maxWidth, isEditable, onChange, onChangeEnd]);

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
      style={{ ...style, width, height }}
    >
      {isEditable && (
        <>
          <div ref={$placeholderNode} className={styles.placeholderWrap} style={{ opacity: 1 }}>
            <span className={styles.resizer + ' ' + styles.topLeft} ref={$topLeft} data-type={'topLeft'}></span>
            <span className={styles.resizer + ' ' + styles.topRight} ref={$topRight} data-type={'topRight'}></span>
            <span
              className={styles.resizer + ' ' + styles.bottomLeft}
              ref={$bottomLeft}
              data-type={'bottomLeft'}
            ></span>
            <span
              className={styles.resizer + ' ' + styles.bottomRight}
              ref={$bottomRight}
              data-type={'bottomRight'}
            ></span>
          </div>

          <div ref={$cloneNode} className={styles.cloneNodeWrap} style={{ width, height, maxWidth }}>
            <span className={styles.resizer + ' ' + styles.topLeft} ref={$topLeft} data-type={'topLeft'}></span>
            <span className={styles.resizer + ' ' + styles.topRight} ref={$topRight} data-type={'topRight'}></span>
            <span
              className={styles.resizer + ' ' + styles.bottomLeft}
              ref={$bottomLeft}
              data-type={'bottomLeft'}
            ></span>
            <span
              className={styles.resizer + ' ' + styles.bottomRight}
              ref={$bottomRight}
              data-type={'bottomRight'}
            ></span>
            <span ref={$cloneNodeTip}></span>
          </div>
        </>
      )}

      {children}
    </div>
  );
};
