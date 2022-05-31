import { Component } from "@odoo/owl";
import template from './row.xml';

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

  static template = template;

  static props = {
    data: { type: Object },
    columns: { type: Array },
    class: { type: String, optional: true },
    onClick: { type: Function, optional: true },
  };

  setup(): void {
    console.log(JSON.stringify(this.props));
  }
}