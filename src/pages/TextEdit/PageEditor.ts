import { Component, useState } from "@odoo/owl";
import template from './pageEditor.xml';

interface Element {
  type: 'block' | 'pageBreak';
};

interface Block extends Element {
  content?: string;
  comments?: string;
};

interface PageBreak extends Element {};

type State = {
  elements: Element[];
  comments?: string;
};

export default class PageEditor extends Component {

  static template = template;
  
  editor = useState<State>({
    elements: [],
    comments: '',
  });

  setup() {
    this.addPage();
  }

  addPage() {
    const id = `${Date.now()}`;
    this.editor.pages.push({
      id,
      name: 'Nouvelle Page',
      blocks: [{
        content: '',
      }]
    });
    this.editor.currentPage = id;
  }
}