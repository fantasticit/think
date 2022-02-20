import React, { useRef, useEffect } from "react";
import { useClickOutside } from "hooks/use-click-outside";
import interact from "interactjs";
import styles from "./style.module.scss";

interface IProps {
  width: number;
  height: number;
  onChange: (arg: { width: number; height: number }) => void;
}

const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;

export const Resizeable: React.FC<IProps> = ({
  width,
  height,
  onChange,
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
          width = width < MIN_WIDTH ? MIN_WIDTH : width;
          height = height < MIN_HEIGHT ? MIN_HEIGHT : height;

          Object.assign(event.target.style, {
            width: `${width}px`,
            height: `${height}px`,
            // transform: `translate(${x}px, ${y}px)`,
          });
          Object.assign(event.target.dataset, { x, y });
          onChange && onChange({ width, height });
        },
      },
    });
  }, []);

  return (
    <div
      id="js-resizeable-container"
      className={styles.resizable}
      ref={$container}
      style={{ width, height }}
    >
      <span
        className={styles.resizer + " " + styles.topLeft}
        ref={$topLeft}
        data-type={"topLeft"}
      ></span>
      <span
        className={styles.resizer + " " + styles.topRight}
        ref={$topRight}
        data-type={"topRight"}
      ></span>
      <span
        className={styles.resizer + " " + styles.bottomLeft}
        ref={$bottomLeft}
        data-type={"bottomLeft"}
      ></span>
      <span
        className={styles.resizer + " " + styles.bottomRight}
        ref={$bottomRight}
        data-type={"bottomRight"}
      ></span>
      {children}
    </div>
  );
};
