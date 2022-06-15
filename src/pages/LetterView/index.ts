import { Component, onMounted, useState } from "@odoo/owl";
import template from './letterView.xml';
import { Letter, models } from "../../models";
import notyf from "../../notifications";
import LetterViewer from "../../components/LetterViewer";
import LetterInformationHeader from "../../components/LetterInformationHeader";
import Loader from '../../components/Loader';
import Transition from '../../components/Transition';
import Button from '../../components/Button';
import RouterLink from '../../components/Router/RouterLink';

type State = {
  loading: boolean;
  letter?: Letter;
  commentAnswers?: Record<string | number, string>
};

class LetterView extends Component {
  static template = template;

  static props = {
    letterId: { type: String },
  };

  static components = {
    LetterInformationHeader,
    RouterLink,
    LetterViewer,
    Button,
    Transition,
    Loader,
  };

  state = useState<State>({
    loading: false,
    letter: undefined,
    commentAnswers: {},
  });

  setup() {
    this.state.loading = true;
    onMounted(() => {
      models.letters.find(this.props.letterId).then((letter) => {
        if (!letter) {
          notyf.error(`Unable to find letter with identifier ${this.props.letterId}`);
        } else {
          this.state.letter = letter;
        }
        this.state.loading = false;
      });
    });
  }
}

export default LetterView;