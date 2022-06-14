import { Component, xml } from "@odoo/owl";

class LetterPriority extends Component {

  static props = ['priority'];
  static template = xml`<div class="text-xs w-5 h-5 flex items-center justify-center rounded" t-esc="props.priority" t-att-class="{
    'bg-slate-100 text-slate-600': props.priority === 0,
    'bg-slate-300 text-slate-700': props.priority === 1,
    'bg-orange-600 text-white': props.priority === 2,
    'bg-red-500 text-white': props.priority === 3,
    'bg-red-700 text-white': props.priority === 4
  }" />`;
}

export default LetterPriority;