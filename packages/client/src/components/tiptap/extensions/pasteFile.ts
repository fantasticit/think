import { Plugin } from 'prosemirror-state';
import { Extension } from '@tiptap/core';
import { uploadFile } from 'services/file';
import { Attachment } from './attachment';
import { Image } from './image';

export const acceptedMimes = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
};

export const PasteFile = Extension.create({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          // @ts-ignore
          handlePaste: async (view, event: ClipboardEvent) => {
            if (view.props.editable && !view.props.editable(view.state)) {
              return false;
            }
            if (!event.clipboardData) return false;

            const file = event.clipboardData.files[0];

            if (file) {
              event.preventDefault();
              const url = await uploadFile(file);
              let node = null;
              if (acceptedMimes.image.includes(file?.type)) {
                node = view.props.state.schema.nodes[Image.name].create({
                  src: url,
                });
              } else {
                node = view.props.state.schema.nodes[Attachment.name].create({
                  url,
                  name: file.name,
                });
              }
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
              return true;
            }

            return false;
          },
          // @ts-ignore
          handleDrop: async (view, event: any) => {
            if (view.props.editable && !view.props.editable(view.state)) {
              return false;
            }

            const hasFiles = event.dataTransfer.files.length > 0;
            if (!hasFiles) return false;

            event.preventDefault();

            const files = Array.from(event.dataTransfer.files);
            files.forEach(async (file: any) => {
              if (!file) {
                return;
              }
              const url = await uploadFile(file);
              let node = null;
              if (acceptedMimes.image.includes(file?.type)) {
                node = view.props.state.schema.nodes[Image.name].create({
                  src: url,
                });
              } else {
                node = view.props.state.schema.nodes[Attachment.name].create({
                  url,
                  name: file.name,
                });
              }
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
              return true;
            });
          },
        },
      }),
    ];
  },
});
