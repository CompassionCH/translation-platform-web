import { Component, onMounted, useRef, useState } from "@odoo/owl";
import template from './textEdit.xml';
import PageEditor from "./PageEditor";
import Button from "../../components/Button";
import TopInformationPiece from "./TopInformationPiece";

export default class TextEdit extends Component {
  static template = template;
  static components = {
    PageEditor,
    Button,
    InfoPiece: TopInformationPiece,
  };

  letterPanel = useRef('letterPanel');
  panelDrag = useRef('panelDrag');

  editor = useState({
    page: 0,
    pages: [],
  });

  resizing = useState({
    dx: 0,
    active: false,
  });

  setup() {

    const resizeCallback = (event: MouseEvent) => this.resize(event);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', resizeCallback, false);
      this.resizing.active = false;
    }
    const onMouseDown = (event: MouseEvent) => {
      this.resizing.dx = event.x;
      this.resizing.active = true;
      document.addEventListener('mousemove', resizeCallback, false);
    };

    onMounted(() => {
      const panelDrag = this.panelDrag.el as HTMLDivElement;
      panelDrag.addEventListener('mousedown', onMouseDown, false);
      document.addEventListener('mouseup', onMouseUp, false);
    });

    /*

    onMounted(() => {
      const panel = this.letterPanel.el as HTMLDivElement;
      panel.addEventListener('mousedown', onMouseDown, false);
      panel.addEventListener('mouseup', onMouseUp, false);
    });

    onWillDestroy(() => {
      const panel = this.letterPanel.el as HTMLDivElement;
      panel.removeEventListener('mousedown', onMouseDown);
      panel.removeEventListener('mouseup', onMouseUp);
    });
    */
  }

  resize(event: MouseEvent) {
    const dx = this.resizing.dx - event.clientX;
    this.resizing.dx = event.x;
    const panel = this.letterPanel.el as HTMLDivElement;
    const drag = this.panelDrag.el as HTMLDivElement;

    drag.style.left = (drag.offsetLeft - dx) + 'px';
    panel.style.width = `${drag.offsetLeft + drag.clientWidth}px`;
  }
}