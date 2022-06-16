import { Component, onWillRender, xml } from "@odoo/owl";
import Transition from "./Transition";
import Icon from "./Icon";
import Button from "./Button";
import Loader from "./Loader";

const props = {
  title: { type: String, optional: true },
  subtitle: { type: String, optional: true },
  active: { type: Boolean, optional: true },
  onClose: { type: Function, optional: true },
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
      <div class="absolute top-0 left-0 w-full h-full bg-white-10 flex items-center justify-center backdrop-blur-sm" t-att-class="loaderScope.itemClass">
        <div class="p-8 bg-white rounded-sm shadow-2xl">
          <Loader class="'text-2xl'" />
        </div>
      </div>
    </Transition>
  `;
}

class Modal extends Component {

  static template = xml`
    <Transition active="props.active || false" t-slot-scope="scope">
      <div class="fixed overflow-auto top-0 left-0 z-50 bg-black-60 w-screen h-screen flex justify-center items-start backdrop-blur-sm" t-att-class="scope.itemClass">
        <div class="bg-white rounded-sm overflow-hidden shadow-2xl my-20 relative">
          <t t-slot="loader" />
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
                <Button t-if="props.onClose" onClick="props.onClose" size="'sm'" level="'secondary'">Close</Button>
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
    Transition,
    Icon,
    Button,
  };

  setup() {
    onWillRender(() => console.log('modal render'));
  }
}

export default Modal;