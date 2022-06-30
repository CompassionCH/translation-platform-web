import { Component, onMounted, onWillUnmount, useRef, xml } from "@odoo/owl";
import tippy, { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

class Tippy extends Component {
  static template = xml`
    <t t-tag="'div'" t-ref="element">
      <t t-slot="default" />
    </t>
  `;

  element = useRef('element');

  static props = {
    content: { type: String },
    delay: { type: Number, optional: true },
    duration: { type: Number, optional: true },
    placement: { type: String, optional: true },

    slots: {},
  };

  setup() {
    let instance: Instance | null = null;

    onMounted(() => {
      const parent = this.element.el;
      if (!parent) {
        console.error('Tippy component requires an actual container element');
        return;
      }
      
      const child = parent.children[0];
      if (!child) {
        console.error(parent, 'Tippy child not found, aborting');
        return;
      }

      instance = tippy(child, {
        content: this.props.content,
        delay: [this.props.delay || 200, 0],
        duration: this.props.duration,
        placement: this.props.placement,
      });
    });

    onWillUnmount(() => {
      if (instance) {
        instance.destroy();
      }
    });
  }
}

export default Tippy;