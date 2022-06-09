import { Component } from "@odoo/owl";
import template from './home.xml';

import Button from "../../components/Button";
import TranslationCard from './TranslationCard';

export default class Home extends Component {
  static template = template;
  static components = {
    Button,
    TranslationCard,
  };

  texts = [
    { id: 1, title: 'Arya Stark, Westeros' },
    { id: 2, title: 'Bart Simpson, America' },
    { id: 3, title: 'Basilic Mascarpone, Italy' },
    { id: 4, title: 'Capheus Onyango, Kenya' },
  ];
}