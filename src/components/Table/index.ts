import { Component } from "@odoo/owl";
import Row, { Column } from './Row';
import template from './table.xml';

type Props = {
  data: Record<string, any>[];
  columns: Column[];
};

export default class Table extends Component<Props> {

  static template = template;
  static props = ['data', 'columns'];
  static components = {
    Row,
  }
}