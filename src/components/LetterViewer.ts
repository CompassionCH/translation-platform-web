import { Component, xml, useRef, onMounted, useState, onWillUnmount, onWillUpdateProps, onPatched, useEffect } from "@odoo/owl";
import Icon from "./Icon";
import Transition from "./Transition";
import Loader from "./Loader";
import RouterLink from "./Router/RouterLink";
import SignalProblem from "./SignalProblem";
import LetterInformationHeader from "./LetterInformationHeader";
import Button from "./Button";

const props = {
  letter: { type: Object, optional: true },
  loading: { type: Boolean, optional: true },
  'slots': { optional: true },
};

class LetterViewer extends Component {

  static template = xml`
    <div class="h-full relative">
      <SignalProblem active="state.signalProblemModal" onClose="() => state.signalProblemModal = false" />
      <div t-if="props.letter" class="flex h-full">
        <div class="h-full relative bg-blue-300 w-2/5" t-ref="letterPanel">
          <div class="shadow-sm overflow-hidden h-full border-gray-400 flex">
            <t t-if="state.active === false">
              <iframe src="/text.pdf" class="w-full h-full" />
            </t>
            <div class="w-2 h-full" />
            <div t-ref="panelDrag" class="absolute right-0 w-2 h-full bg-slate-400 z-30 hover:bg-compassion cursor-ew-resize select-none" />
          </div>
        </div>
        <div class="flex-1 flex flex-col">
          <t t-slot="unsafe" />
          <div class="flex-1 w-full flex flex-col relative">
            <div t-ref="header">
              <LetterInformationHeader letter="props.letter">
                <t t-slot="action-buttons" letter="props.letter" />
              </LetterInformationHeader>        
            </div>
            <div class="flex-1 relative bg-slate-200">
              <div class="absolute top-0 w-full h-4 bg-gradient-to-b from-slate-300 to-transparent z-20" />
              <div class="overflow-auto py-4" t-ref="contentContainer">
                <t t-slot="content" letter="props.letter" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div t-elif="!props.loading" class="w-full h-full flex flex-col items-center justify-center">
        <Icon icon="'triangle-exclamation'" class="'text-slate-400 text-6xl mb-4'" />
        <p class="text-slate-600 font-semibold mb-2">This letter could not be found</p>
        <div class="flex gap-3">
          <Button color="'red'" level="'secondary'" onClick="() => state.signalProblemModal = true" size="'sm'">Signal a Problem</Button>
          <RouterLink to="'/letters'">
            <Button level="'secondary'" size="'sm'">Back to Translations</Button>
          </RouterLink>
        </div>
      </div>
      <Transition t-slot-scope="scope" active="props.loading">
        <div class="absolute z-40 bg-slate-200 flex justify-center items-center flex-col top-0 left-0 w-full h-full" t-att-class="scope.itemClass">
          <Loader class="'text-4xl'" />
        </div>
      </Transition>
    </div>
  `;

  static props = props;

  static components = {
    Icon,
    RouterLink,
    Transition,
    Loader,
    Button,
    LetterInformationHeader,
    SignalProblem,
  };

  letterPanel = useRef('letterPanel');
  panelDrag = useRef('panelDrag');
  infoHeader = useRef('header');
  contentContainer = useRef('contentContainer');

  resizeCallback = null as any;
  onMouseUp = null as any;
  onMouseDown = null as any;
  dragInitialized = false;

  state = useState({
    dx: 0,
    displayHeight: 0,
    active: false,
    signalProblemModal: false,
  });

  setup() {

    // Initialize callbacks
    this.resizeCallback = (event: MouseEvent) => this.resize(event);
    this.onMouseUp = () => {
      document.removeEventListener('mousemove', this.resizeCallback, false);
      this.state.active = false;
    }
    this.onMouseDown = (event: MouseEvent) => {
      this.state.dx = event.x;
      this.state.active = true;
      document.addEventListener('mousemove', this.resizeCallback, false);
    };

    useEffect(() => {
      const resizeCallback = () => this.computeContainerSize();
      window.addEventListener('resize', resizeCallback);
      return () => window.removeEventListener('resize', resizeCallback);
    });

    // On initial mount, try to attach listeners, should not have any effect though
    onMounted(() => {
      if (this.props.letter && !this.dragInitialized) {
        this.attachListeners();
      }
    });

    // When props change, see if we need to unmount something (no more letter)
    onWillUpdateProps((nextProps) => {
      if (this.dragInitialized && !nextProps.letter) {
        this.detachListeners();
      }
    });

    // Once props are correctly updated, see if we need to mount something
    onPatched(() => {
      console.log('patched')
      if (this.props.letter && !this.dragInitialized) {
        this.attachListeners();
      }
    });

    // Before unmount, clear all
    onWillUnmount(() => this.detachListeners());
  }

  computeContainerSize() {
    const header = this.infoHeader.el;
    const container = this.contentContainer.el;
    if (!header || !container) return;
    const contentHeight = window.innerHeight - header.clientHeight;
    container.style.height = `${contentHeight}px`;
  }

  attachListeners() {
    this.computeContainerSize();
    if (this.letterPanel.el) {
      const panelDrag = this.panelDrag.el as HTMLDivElement;
      panelDrag.addEventListener('mousedown', this.onMouseDown, false);
      document.addEventListener('mouseup', this.onMouseUp, false);  
      this.dragInitialized = true;
    }
  }

  detachListeners() {
    if (this.letterPanel.el) {
      const panel = this.letterPanel.el as HTMLDivElement;
      panel.removeEventListener('mousedown', this.onMouseDown);
      panel.removeEventListener('mouseup', this.onMouseUp);
      this.dragInitialized = false;
    }
  }

  resize(event: MouseEvent) {
    const dx = this.state.dx - event.clientX;
    this.state.dx = event.x;
    const panel = this.letterPanel.el as HTMLDivElement;
    const drag = this.panelDrag.el as HTMLDivElement;

    drag.style.left = (drag.offsetLeft - dx) + 'px';
    panel.style.width = `${drag.offsetLeft + drag.clientWidth}px`;
  }
}

export default LetterViewer;