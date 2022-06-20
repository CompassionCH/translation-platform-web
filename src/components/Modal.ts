import { Component, onMounted, onPatched, onWillUpdateProps, useState, xml } from "@odoo/owl";
import Transition from "./Transition";
import Icon from "./Icon";
import Button from "./Button";
import Loader from "./Loader";
import { PropsType } from "../UtilityTypes";

const props = {
  title: { type: String, optional: true },
  loading: { type: Boolean, optional: true },
  subtitle: { type: String, optional: true },
  active: { type: Boolean, optional: true },
  onClose: { type: Function, optional: true },
  showCloseButton: { type: Boolean, optional: true },
  closeButtonText: { type: String, optional: true },
  empty: { type: Boolean, optional: true },
  '*': {},
};

export class ModalLoader extends Component {

  static props = ['loading'];
  static components = {
    Loader,
    Transition,
  };

  static template = xml`
    <Transition active="props.loading || false" t-slot-scope="loaderScope">
      <div class="absolute top-0 left-0 w-full h-full bg-white-30 flex items-center justify-center backdrop-blur-sm" t-att-class="loaderScope.itemClass">
        <div class="p-8 bg-white rounded-sm shadow-2xl">
          <Loader class="'text-2xl'" />
        </div>
      </div>
    </Transition>
  `;
}

class Modal extends Component<PropsType<typeof props>> {

  static template = xml`
    <Transition t-if="state.mounted" active="state.display" t-slot-scope="scope" duration="state.duration">
      <div class="fixed overflow-auto top-0 left-0 z-50 bg-black-60 w-screen h-screen flex justify-center items-start backdrop-blur-sm" t-att-class="scope.itemClass">
        <div class="bg-white rounded-sm overflow-hidden shadow-2xl my-20 relative">
          <ModalLoader loading="props.loading || false" />
          <div class="border-b border-solid border-slate-200 px-5 py-4 flex justify-between items-start" t-if="!props.empty">
            <div>
              <h1 t-if="props.title" class="text-slate-700 text-xl font-light" t-esc="props.title" />
              <h3 t-if="props.subtitle" class="text-slate-600 font-light" t-esc="props.subtitle" />
            </div>
            <div>
              <button t-if="props.onClose" class="ml-4 rounded-full hover:text-slate-800 transition-colors text-slate-600 text-xl" t-on-click="props.onClose">
                <Icon icon="'xmark'" />
              </button>
            </div>
          </div>
          <div>
            <t t-slot="default" />
          </div>
          <div>
            <t t-slot="footer">
              <div class="flex gap-2 justify-end p-4 border-t border-solid border-slate-200" t-if="!props.empty">
                <Button t-if="props.onClose and props.showCloseButton !== false" onClick="props.onClose" size="'sm'" level="'secondary'" t-esc="props.closeButtonText || 'Close'" />
                <t t-slot="footer-buttons" />
              </div>
            </t>
          </div>
        </div>
      </div>
    </Transition>
  `;

  static props = props;
  static components = {
    ModalLoader,
    Transition,
    Icon,
    Button,
  };

  state = useState({
    mounted: false,
    display: false,
    duration: 300,
  });

  setup() {
    onMounted(() => this.handleMount(this.props));
    onWillUpdateProps((nextProps) => this.handleMount(nextProps));
    onPatched(() => this.postRendered());
  }

  handleMount(nextProps: PropsType<typeof props>) {
    if (nextProps.active && !this.state.mounted) {
      // Mount modal
      this.state.mounted = true;
      // Displaying will happen after patched so that the internal
      // transition component has effectively been mounted in the
      // DOM. it will then be displayed
      // See setup() -> onPatched

    } else if (this.state.mounted && !nextProps.active) {
      // Hide modal and when done unmount it correctly
      this.state.display = false;
      setTimeout(() => {
        this.state.mounted = false;
      }, this.state.duration);
    }
  }

  postRendered() {
    if (this.props.active && this.state.mounted && !this.state.display) {
      this.state.display = true;
    }
  }
}

export default Modal;