import { Component, xml, useRef, onMounted, useState, onWillUnmount, onWillUpdateProps, onPatched, useEffect } from "@odoo/owl";
import Icon from "./Icon";
import Transition from "./Transition";
import Loader from "./Loader";
import RouterLink from "./Router/RouterLink";
import SignalProblem from "./SignalProblem";
import LetterInformationHeader from "./LetterInformationHeader";
import Button from "./Button";
import useCurrentTranslator from "../hooks/useCurrentTranslator";

const props = {
  letter: { type: Object, optional: true },
  letterId: { optional: false }, // Given even if letter is not found, for signal problem modal
  loading: { type: Boolean, optional: true },
  smallLoading: { type: Boolean, optional: true },
  'slots': { optional: true },
};

class LetterViewer extends Component {

  static template = xml`
    <div class="h-full relative">
      <SignalProblem active="state.signalProblemModal" letterId="props.letterId" onClose="() => state.signalProblemModal = false" />
      <t t-slot="unsafe" />
      <div t-if="props.letter and !currentTranslator.loading" class="flex h-full">
        <div class="h-full relative bg-blue-300 w-2/5" t-ref="letterPanel">
          <div class="shadow-sm overflow-hidden h-full border-gray-400 flex group">
            <div class="w-full h-full relative" id="letter-viewer">
              <t t-if="state.active === false and state.mode === 'letter'">
                <iframe t-att-src="props.letter.pdfUrl + '?translatorId=' + currentTranslator.data.translatorId" class="w-full h-full" />
              </t>
              <div t-elif="state.mode === 'source'" class="w-full h-full bg-slate-600 py-4 px-5">
                <h3 class="font-semibold text-slate-100 text-2xl">Source Text to translate</h3>
                <h4 class="text-slate-200 max-w-xl mt-3 mb-5 text-sm">Text might not be available, in this case, and if the letter is unavailable too, please contact Compassion by signaling a problem.</h4>
                <div t-foreach="props.letter.translatedElements" t-as="element" t-key="element.id">
                  <t t-if="element.readonly">
                    <div t-if="element.type === 'paragraph'" class="bg-slate-300 p-4 mb-2 rounded-sm shadow">
                      <p t-esc="element.source" class="text-slate-900 text-sm" />
                    </div>
                    <div t-if="element.type === 'pageBreak'" class="bg-slate-400 mb-2 rounded-sm text-slate-100 text-xs flex justify-center py-3">Page Break</div>
                  </t>
                </div>
              </div>
              <div class="flex justify-center w-full absolute top-0">
                <div class="flex gap-2 p-2 bg-white shadow-xl -mt-12 group-hover:mt-0 transition-all">
                  <Button size="'sm'" level="'secondary'" onClick="() => this.state.mode = 'letter'" disabled="state.mode === 'letter'">Letter</Button>
                  <Button size="'sm'" level="'secondary'" onClick="() => this.state.mode = 'source'" disabled="state.mode === 'source'">Source</Button>
                </div>
              </div> 
            </div>
            <div class="w-2 h-full" />
            <div t-ref="panelDrag" class="absolute right-0 w-2 h-full bg-slate-400 z-30 hover:bg-compassion cursor-ew-resize select-none letter-viewer-dragger" />
          </div>
        </div>
        <div class="flex-1 flex flex-col relative">
          <t t-slot="right-pane" />
          <div class="flex-1 w-full flex flex-col relative">
            <div t-ref="header">
              <LetterInformationHeader letter="props.letter" loading="props.smallLoading">
                <t t-slot="action-buttons" letter="props.letter" />
              </LetterInformationHeader>        
            </div>
            <div class="flex-1 relative bg-slate-200">
              <div class="absolute top-0 w-full h-4 bg-gradient-to-b from-slate-300 to-transparent z-10" />
              <div class="overflow-auto py-4" t-ref="contentContainer" id="letter-viewer-content">
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
      <Transition t-slot-scope="scope" active="props.loading or currentTranslator.loading">
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

  currentTranslator = useCurrentTranslator();

  // Store as class attribute to avoid repatch component
  // whenever it changes
  resizeCallback = null as any;
  onMouseUp = null as any;
  onMouseDown = null as any;
  dragInitialized = false;
  dx = 0;

  state = useState({
    mode: 'letter' as 'letter' | 'source',
    displayHeight: 0,
    active: false,
    signalProblemModal: false,
  });

  setup() {
    this.currentTranslator.loadIfNotInitialized();

    // Initialize callbacks
    this.resizeCallback = (event: MouseEvent) => this.resize(event);
    this.onMouseUp = () => {
      document.removeEventListener('mousemove', this.resizeCallback, false);
      this.state.active = false;
    }
    this.onMouseDown = (event: MouseEvent) => {
      this.dx = event.x;
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
    const dx = this.dx - event.clientX;
    this.dx = event.x;
    const panel = this.letterPanel.el as HTMLDivElement;
    const drag = this.panelDrag.el as HTMLDivElement;

    drag.style.left = (drag.offsetLeft - dx) + 'px';
    panel.style.width = `${drag.offsetLeft + drag.clientWidth}px`;
  }
}

export default LetterViewer;