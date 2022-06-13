import { Component, useState } from "@odoo/owl";
import template from './textEdit.xml';
import PageEditor from "./PageEditor";
import Button from "../../components/Button";
import SignalProblem from "./SignalProblem";
import LetterViewer from "../../components/LetterViewer";
import LetterInformationViewer from "../../components/LetterInformationHeader";

export default class TextEdit extends Component {
  static template = template;
  static components = {
    PageEditor,
    Button,
    SignalProblem,
    LetterViewer,
    LetterInformationViewer,
  };

  editor = useState({
    page: 0,
    pages: [],
    showBugModal: false,
  });
}