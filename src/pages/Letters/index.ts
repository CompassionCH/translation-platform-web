import { Component, useState } from "@odoo/owl";
import template from './letters.xml';
import LetterDAO from "../../models/LetterDAO";


class Letters extends Component {

  static template = template;

  queryState = useState({
    searchColumns: [],
    sortBy: ''
  });
};

export default Letters;