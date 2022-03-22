import { Node } from './Node';
export class CodeBlock extends Node {
  type = 'codeBlock';
  matching() {
    return this.DOMNode.nodeName === 'CODE' && this.DOMNode.parentNode.nodeName === 'PRE';
  }

  //   getLanguage() {
  //     const language = this.DOMNode.getAttribute('class');
  //     return language ? language.replace(/^language-/, '') : language;
  //   }

  //   data() {
  //     const language = this.getLanguage();

  //     if (language) {
  //       return {
  //         type: 'codeBlock',
  //         attrs: {
  //           language,
  //         },
  //       };
  //     }

  //     return {
  //       type: 'codeBlock',
  //     };
  //   }
}
