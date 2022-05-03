import React, { useCallback, useEffect, useState } from 'react';
import { Popover, Button, Typography, Input, Space } from '@douyinfe/semi-ui';
import { Editor } from 'tiptap/editor';
import { Tooltip } from 'components/tooltip';
import { IconSearchReplace } from 'components/icons';
import { SearchNReplace } from 'tiptap/core/extensions/search';

const { Text } = Typography;

export const Search: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');

  const onVisibleChange = useCallback((visible) => {
    if (!visible) {
      setSearchValue('');
      setReplaceValue('');
    }
  }, []);

  useEffect(() => {
    if (editor && editor.commands && editor.commands.setSearchTerm) {
      editor.commands.setSearchTerm(searchValue);
    }
  }, [searchValue, editor]);

  useEffect(() => {
    if (editor && editor.commands && editor.commands.setReplaceTerm) {
      editor.commands.setReplaceTerm(replaceValue);
    }
  }, [replaceValue, editor]);

  useEffect(() => {
    const searchExtension = editor.extensionManager.extensions.find((ext) => ext.name === SearchNReplace.name);

    if (!searchExtension) return;

    const listener = () => {
      const currentIndex = searchExtension ? searchExtension.options.currentIndex : -1;
      const results = searchExtension ? searchExtension.options.results : [];
      setCurrentIndex(currentIndex);
      setResults(results);
    };

    searchExtension.options.onChange = listener;

    return () => {
      if (!searchExtension) return;
      delete searchExtension.options.onChange;
    };
  }, [editor]);

  return (
    <Popover
      showArrow
      zIndex={10000}
      trigger="click"
      position="bottomRight"
      onVisibleChange={onVisibleChange}
      content={
        <div>
          <div style={{ marginBottom: 12 }}>
            <Text type="tertiary">查找</Text>
            <Input
              autofocus
              value={searchValue}
              onChange={setSearchValue}
              suffix={results.length ? `${currentIndex + 1}/${results.length}` : ''}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Text type="tertiary">替换为</Text>
            <Input value={replaceValue} onChange={setReplaceValue} />
          </div>
          <div>
            <Space>
              <Button disabled={!results.length} onClick={editor.commands.replaceAll}>
                全部替换
              </Button>

              <Button disabled={!results.length} onClick={editor.commands.replace}>
                替换
              </Button>

              <Button disabled={!results.length} onClick={editor.commands.goToPrevSearchResult}>
                上一个
              </Button>

              <Button disabled={!results.length} onClick={editor.commands.goToNextSearchResult}>
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
