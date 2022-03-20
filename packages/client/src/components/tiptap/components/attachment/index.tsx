import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Button } from '@douyinfe/semi-ui';
import { IconDownload } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { download } from '../../services/download';
import styles from './index.module.scss';

export const AttachmentWrapper = ({ node }) => {
  const { name, url } = node.attrs;

  return (
    <NodeViewWrapper as="div">
      <div className={styles.wrap}>
        <span>{name}</span>
        <span>
          <Tooltip content="下载">
            <Button
              theme={'borderless'}
              type="tertiary"
              icon={<IconDownload />}
              onClick={() => download(url, name)}
            />
          </Tooltip>
        </span>
      </div>
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
