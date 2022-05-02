import React from 'react';

export const _Divider = ({ vertical = false }) => {
  return (
    <div
      style={{
        display: 'inline-block',
        width: 1,
        height: 18,
        margin: '0 6px',
        backgroundColor: 'var(--semi-color-border)',
        transform: `rotate(${vertical ? 90 : 0}deg)`,
      }}
    ></div>
  );
};

export const Divider = React.memo(_Divider, (prevProps, nextProps) => {
  return prevProps.vertical === nextProps.vertical;
});
