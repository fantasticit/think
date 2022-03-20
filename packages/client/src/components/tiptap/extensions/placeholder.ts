import BuiltInPlaceholder from '@tiptap/extension-placeholder';

export const Placeholder = BuiltInPlaceholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === 'title') {
      return '请输入标题';
    }
    return '请输入内容';
  },
  showOnlyCurrent: false,
  showOnlyWhenEditable: true,
});
