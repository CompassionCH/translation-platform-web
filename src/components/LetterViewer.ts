import { Component, xml, useRef, onMounted, useState, onWillDestroy } from "@odoo/owl";

class LetterViewer extends Component {

  static template = xml`
    <div class="h-full">
      <div class="flex h-full">
        <div class="h-full relative bg-blue-300 w-2/5" t-ref="letterPanel">
          <div class="shadow-sm overflow-hidden h-full border-gray-400 flex">
            <t t-if="resizing.active === false">
              <iframe src="/text.pdf" class="w-full h-full" />
            </t>
            <div class="w-2 h-full" />
            <div t-ref="panelDrag" class="absolute right-0 w-2 h-full bg-slate-400 z-30 hover:bg-compassion cursor-ew-resize select-none" />
          </div>
        </div>
        <div class="flex-1">
          <t t-slot="default" />
        </div>
      </div>
    </div>
  `;

  letterPanel = useRef('letterPanel');
  panelDrag = useRef('panelDrag');

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

export default LetterViewer;