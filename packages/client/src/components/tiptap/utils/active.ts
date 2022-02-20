export const isListActive = (editor) => {
  return (
    editor.isActive("bulletList") ||
    editor.isActive("orderedList") ||
    editor.isActive("taskList")
  );
};

export const isTitleActive = (editor) => editor.isActive("title");
