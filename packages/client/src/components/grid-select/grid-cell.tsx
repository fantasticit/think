import React, { MouseEventHandler } from 'react';

type CellProperties = {
  active: boolean;
  hover: boolean;
  disabled: boolean;
  cellSize: number;
  onClick: MouseEventHandler<HTMLDivElement>;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  styles: Record<string, React.CSSProperties>;
  id: string;
};

const getBaseStyles = (cellSize) => ({
  cell: {
    width: cellSize,
    height: cellSize,
    background: '#fff',
    cursor: 'pointer',
    borderRadius: 3,
    border: '1px solid #bababa',
  },
  active: {
    border: '1px solid #4d6cdd',
    background: '#4d6cdd',
  },
  hover: {
    border: '1px solid #fff',
    background: '#4d6cdd',
  },
  disabled: {
    filter: 'brightness(0.7)',
  },
});

const getMergedStyle = (baseStyles, styles, styleClass) => ({
  ...baseStyles[styleClass],
  ...(styles && styles[styleClass] ? styles[styleClass] : {}),
});

export const GridCell = ({ active, hover, disabled, onClick, onMouseEnter, cellSize, styles, id }: CellProperties) => {
  const baseStyles = getBaseStyles(cellSize);
  const cellStyles = {
    cell: getMergedStyle(baseStyles, styles, 'cell'),
    active: getMergedStyle(baseStyles, styles, 'active'),
    hover: getMergedStyle(baseStyles, styles, 'hover'),
    disabled: getMergedStyle(baseStyles, styles, 'disabled'),
  };

  return (
    <div
      id={id}
      style={{
        ...cellStyles.cell,
        ...(active && cellStyles.active),
        ...(hover && cellStyles.hover),
        ...(!active && disabled && cellStyles.disabled),
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    />
  );
};
