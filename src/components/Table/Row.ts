import { Component } from "@odoo/owl";
import template from './row.xml';

export type Column = {
  header?: string;
  name: string;
  formatter?: <T>(item: T) => string | number;
};

type Props = {
  class?: string;
  data: Record<string, any>;
  columns: Column[];
  onClick?: (data: Record<string, any>) => void;
}

export default class Row extends Component<Props> {

  static template = template;
  static defaultProps = {
    onClick: () => null,
    class: '',
  };

  static props = ['data', 'columns', 'class', 'onClick'];
}