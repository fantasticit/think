import { EditorView } from 'prosemirror-view';

function printHtml(dom: Element) {
  const style: string = Array.from(document.querySelectorAll('style, link')).reduce(
    (str, style) => str + style.outerHTML,
    ''
  );

  const content: string = style + dom.outerHTML;

  const iframe: HTMLIFrameElement = document.createElement('iframe');
  iframe.id = 'el-tiptap-iframe';
  iframe.setAttribute('style', 'position: absolute; width: 0; height: 0; top: -10px; left: -10px;');
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);

  if (doc) {
    doc.open();
    doc.write(content);
    doc.close();
  }

  if (frameWindow) {
    iframe.onload = function () {
      try {
        setTimeout(() => {
          frameWindow.focus();
          try {
            if (!frameWindow.document.execCommand('print', false)) {
              frameWindow.print();
            }
          } catch (e) {
            frameWindow.print();
          }
          frameWindow.close();
        }, 10);
      } catch (err) {
        console.error(err);
      }

      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 100);
    };
  }
}

export function printEditorContent(view: EditorView) {
  const editorContent = view.dom.closest('.ProseMirror');
  if (editorContent) {
    printHtml(editorContent);
    return true;
  }
  return false;
}
