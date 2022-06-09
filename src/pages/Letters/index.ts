import { Component } from "@odoo/owl";
import template from './letters.xml';

type Status = 'done' | 'to do' | 'in process' | 'to review';
type Priority = 0 | 1 | 2 | 3 | 4;

type Letter = {
  id: number;
  status: Status;
  priority: Priority;
  title: string;
  source: string;
  target: string;
  translator: string;
  date: Date;
};

const letters: Letter[] = [...Array(100).keys()].map((i) => ({
  id: i,
  status: 
}));

class Letters extends Component {

  static template = template;
};

export default Letters;