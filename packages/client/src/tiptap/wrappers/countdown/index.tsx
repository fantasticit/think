import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { Typography } from '@douyinfe/semi-ui';
import Countdown from 'react-countdown';
import styles from './index.module.scss';

const { Text } = Typography;

export const CountdownWrapper = ({ editor, node }) => {
  const { title, date } = node.attrs;

  return (
    <NodeViewWrapper>
      <div className={cls(styles.wrap, 'render-wrapper')}>
        <Text style={{ marginBottom: 12 }}>{title}</Text>
        <Countdown date={date}></Countdown>
      </div>
    </NodeViewWrapper>
  );
};
