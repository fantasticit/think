export const Divider = ({ vertical = false }) => {
  return (
    <div
      style={{
        display: 'inline-block',
        width: 1,
        height: 24,
        margin: '0 6px',
        backgroundColor: 'var(--semi-color-border)',
        transform: `rotate(${vertical ? 90 : 0}deg)`,
      }}
    ></div>
  );
};
