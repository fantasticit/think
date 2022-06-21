import { Editor } from '@tiptap/core';
import { uploadFile } from 'services/file';
import { Attachment } from 'tiptap/core/extensions/attachment';
import { Image } from 'tiptap/core/extensions/image';
import { Loading } from 'tiptap/core/extensions/loading';

import { extractFileExtension, extractFilename } from './file';

export const acceptedMimes = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/svg+xml'],
};

type FileInfo = {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileExt: string;
};

interface FnProps {
  file: File;
  editor: Editor;
}

/**
 * 上传图片
 * @param param0
 */
const uploadImage = async ({ file, fileInfo, editor }: FnProps & { fileInfo: FileInfo }) => {
  const { view } = editor;
  const { state } = view;
  const { from } = state.selection;
  const loadingNode = view.props.state.schema.nodes[Loading.name].create({
    text: fileInfo.fileName,
  });
  view.dispatch(view.state.tr.replaceSelectionWith(loadingNode));

  try {
    const url = await uploadFile(file);
    const node = view.props.state.schema.nodes[Image.name].create({
      src: url,
    });
    const transaction = view.state.tr.replaceRangeWith(from, from + loadingNode.nodeSize, node);
    view.dispatch(transaction);
  } catch (e) {
    editor.commands.deleteRange({ from: from, to: from + loadingNode.nodeSize });
    console.log('上传文件失败！');
    throw e;
  }
};

/**
 * 上传附件
 * @param param0
 */
const uploadAttachment = async ({ file, fileInfo, editor }: FnProps & { fileInfo: FileInfo }) => {
  const { view } = editor;
  const { state } = view;
  const { from } = state.selection;
  const loadingNode = view.props.state.schema.nodes[Loading.name].create({
    text: fileInfo.fileName,
  });
  view.dispatch(view.state.tr.replaceSelectionWith(loadingNode));

  try {
    const url = await uploadFile(file);
    const node = view.props.state.schema.nodes[Attachment.name].create({
      url,
      ...fileInfo,
    });
    const transaction = view.state.tr.replaceRangeWith(from, from + loadingNode.nodeSize, node);
    view.dispatch(transaction);
  } catch (e) {
    editor.commands.deleteRange({ from: from, to: from + loadingNode.nodeSize });
    console.log('上传文件失败！');
  }
};

export const handleFileEvent = ({ file, editor }: FnProps) => {
  if (!file) return false;

  const fileInfo = {
    fileName: extractFilename(file.name),
    fileSize: file.size,
    fileType: file.type,
    fileExt: extractFileExtension(file.name),
  };

  if (acceptedMimes.image.includes(file?.type)) {
    uploadImage({ file, editor, fileInfo });
    return true;
  }

  uploadAttachment({ file, editor, fileInfo });
  return true;
};
