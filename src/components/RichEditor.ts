import { Component, onMounted, onWillDestroy, useRef, xml } from "@odoo/owl";
import EditorJS from "@editorjs/editorjs";
// @ts-ignore
import Image from '@editorjs/image';
// @ts-ignore
import Underline from '@editorjs/underline';
// @ts-ignore
import List from '@editorjs/list';

type Props = {
  instanceGetter: (editor: EditorJS) => void;
};

class RichEditor extends Component<Props> {

  static template = xml`
    <div t-ref="editor" class="border border-solid border-slate-300 p-4 text-sm rounded-sm shadow-sm bg-white" />
  `;

  editorArea = useRef('editor');
  editor: EditorJS | undefined = undefined;

  static props = {
    instanceGetter: { type: Function, optional: true },
  };

  setup() {
    onMounted(() => {
      this.initialize();
      if (this.props.instanceGetter) {
        this.props.instanceGetter(this.editor as EditorJS);
      }
    });

    onWillDestroy(() => {
      if (this.editor) {
        this.editor.destroy();
      }
    });
  }

  initialize() {
    const holder = this.editorArea.el;
    if (!holder) {
      return;
    }

    this.editor = new EditorJS({
      holder,
      tools: {
        underline: Underline,
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          }
        },
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile: (file: Blob) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onerror = reject;
                reader.onload = () => resolve({
                  success: 1,
                  file: { url: reader.result },
                });
              }),
            }
          }
        }
      }
    });
  }
}

export default RichEditor;