import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Button, Tooltip } from '@douyinfe/semi-ui';
import { IconDownload } from '@douyinfe/semi-icons';
import { download } from '../../services/download';
import styles from './index.module.scss';

export const AttachmentWrapper = ({ node }) => {
  const { name, url } = node.attrs;

  return (
    <NodeViewWrapper as="div">
      <div className={styles.wrap}>
        <span>{name}</span>
        <span>
          <Tooltip zIndex={10000} content="下载">
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
