import BuiltInPlaceholder from '@tiptap/extension-placeholder';

export const Placeholder = BuiltInPlaceholder.configure({
  placeholder: ({ node, editor }) => {
    if (!editor.isEditable) return;

    if (node.type.name === 'title') {
      return '请输入标题';
    }
    return '输入 / 唤起更多';
  },
  showOnlyCurrent: false,
  showOnlyWhenEditable: true,
});
