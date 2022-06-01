import { Component, xml } from "@odoo/owl";

export type Column = {
  header?: string;
  name: string;
  formatter?: (item: any) => string | number;
} | string;

type Props = {
  class?: string;
  data: Record<string, any>;
  columns: Column[];
  onClick?: (data: Record<string, any>) => void;
}

export default class Row extends Component<Props> {

  static template = xml`
    <tr t-on-click="props.onClick" 
      class="hover:bg-slate-300 transition-colors"
      t-att-class="props.class || ''"
    >
      <t t-foreach="props.columns" t-as="col" t-key="col.name">
        <td t-if="props.data.hasOwnProperty(col.name)" class="text-slate-700 py-1 px-2" >
          <span t-if="col.formatter" t-esc="col.formatter(props.data[col.name])" />
          <span t-else="" t-esc="props.data[col.name]" />
        </td>
        <td t-else=""></td>
      </t>
    </tr>
  `;

  static props = {
    data: { type: Object },
    columns: { type: Array },
    class: { type: String, optional: true },
    onClick: { type: Function, optional: true },
  };
}