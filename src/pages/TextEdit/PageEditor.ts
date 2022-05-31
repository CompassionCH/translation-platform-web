import { Component, useState, xml } from "@odoo/owl";
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import PageBreakComponent from './PageBreak';
import ParagraphComponent from './Paragraph';

interface BaseElement {
  type: 'paragraph' | 'pageBreak';
  id: number;
};

interface Paragraph extends BaseElement {
  type: 'paragraph';
  content: string;
  comments?: string;
};

interface PageBreak extends BaseElement {
  type: 'pageBreak';
};

type Element = Paragraph | PageBreak;

type State = {
  elements: Element[];
  comments?: string;
};

export default class PageEditor extends Component {

  static template = xml`
    <div class="mt-6">
      <div class="px-5">
        <div t-foreach="editor.elements" t-as="element" t-key="element.id" class="mb-8">
          <PageBreak t-if="element.type === 'pageBreak'" onRemove="() => this.remove(element.id)" />
          <Paragraph t-if="element.type === 'paragraph'"
            onMoveUp="() => this.moveElement(element.id, -1)"
            onMoveDown="() => this.moveElement(element.id, 1)"
            onRemove="() => this.remove(element.id)"
            onChange="(values) => this.update(element.id, values)"
            first="element_first"
            last="element_last"
            element="element" />
        </div>
        <div class="flex justify-center pr-12 mt-2">
          <Button size="'sm'" icon="'plus'" level="'secondary'" color="'compassion'" onClick="() => this.addParagraph()" class="'mr-1'">Paragraph</Button>
          <Button size="'sm'" icon="'plus'" level="'secondary'" color="'compassion'" onClick="() => this.addPageBreak()" class="'ml-1'">Page Break</Button>
        </div>
      </div>
    </div>
  `;
  
  static components = {
    Icon,
    Button,
    PageBreak: PageBreakComponent,
    Paragraph: ParagraphComponent,
  };
  
  editor = useState<State>({
    elements: [
      {
        type: 'paragraph',
        content: '',
        id: 1,
      },
    ],
    comments: '',
  });

  addParagraph() {
    this.addElement({
      id: Date.now(),
      type: 'paragraph',
      content: '',
    });
  }

  addPageBreak() {
    this.addElement({
      id: Date.now(),
      type: 'pageBreak',
    });
  }

  update(elemId: number, values: { text: string, comment: string }) {
    const items = [...this.editor.elements];
    const i = items.findIndex(it => it.id === elemId);
    const paragraph = this.editor.elements[i] as Paragraph;
    paragraph.comments = values.comment;
    paragraph.content = values.text;
  }

  remove(elemId: number) {
    const items = [...this.editor.elements];
    const i = items.findIndex(it => it.id === elemId);
    this.editor.elements.splice(i, 1);
  }

  moveElement(elemId: number, delta: number) {
    const items = [...this.editor.elements];
    const i = items.findIndex(it => it.id === elemId);
    const elem = items[i];

    // Remove elem from array before adding it back
    items.splice(i, 1);
    items.splice(i + delta, 0, elem);
    this.editor.elements = items;
  }

  private addElement(item: Element, afterIndex = -1) {
    const index = afterIndex === -1 ? this.editor.elements.length - 1 : afterIndex;
    this.editor.elements.splice(index + 1, 0, item);
  }
}