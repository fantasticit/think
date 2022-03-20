import React, { useEffect, useState } from 'react';
import { Popover, Button, Typography, Input, Space } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconSearchReplace } from 'components/icons';
import { SearchNReplace } from '../../extensions/search';

const { Text } = Typography;

export const Search = ({ editor }) => {
  const searchExtension = editor.extensionManager.extensions.find(
    (ext) => ext.name === SearchNReplace.name
  );
  const currentIndex = searchExtension ? searchExtension.options.currentIndex : -1;
  const results = searchExtension ? searchExtension.options.results : [];
  const [searchValue, setSearchValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');

  useEffect(() => {
    editor?.commands?.setSearchTerm(searchValue);
  }, [searchValue]);

  useEffect(() => {
    editor?.commands?.setReplaceTerm(replaceValue);
  }, [replaceValue]);

  return (
    <Popover
      showArrow
      zIndex={10000}
      trigger="click"
      position="bottomRight"
      onVisibleChange={(visible) => {
        if (!visible) {
          setSearchValue('');
          setReplaceValue('');
        }
      }}
      content={
        <div>
          <div style={{ marginBottom: 12 }}>
            <Text type="tertiary">查找</Text>
            <Input
              autofocus
              value={searchValue}
              onChange={(v) => setSearchValue(v)}
              suffix={results.length ? `${currentIndex + 1}/${results.length}` : ''}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Text type="tertiary">替换为</Text>
            <Input value={replaceValue} onChange={(v) => setReplaceValue(v)} />
          </div>
          <div>
            <Space>
              <Button disabled={!results.length} onClick={() => editor.commands.replaceAll()}>
                全部替换
              </Button>
              <Button disabled={!results.length} onClick={() => editor.commands.replace()}>
                替换
              </Button>
              <Button
                disabled={!results.length}
                onClick={() => editor.commands.goToPrevSearchResult()}
              >
                上一个
              </Button>
              <Button
                disabled={!results.length}
                onClick={() => editor.commands.goToNextSearchResult()}
              >
                下一个
              </Button>
            </Space>
          </div>
        </div>
      }
    >
      <span>
        <Tooltip content="查找替换">
          <Button theme={'borderless'} type="tertiary" icon={<IconSearchReplace />} />
        </Tooltip>
      </span>
    </Popover>
  );
};
