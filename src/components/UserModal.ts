import { Component, onWillUpdateProps, useState, xml } from "@odoo/owl";
import notyf from "../notifications";

import { models, User } from "../models";
import Modal from "./Modal";
import Loader from './Loader';

type State = {
  loading: boolean;
  active: boolean;
  user?: User;
  title?: string;
}

class UserModal extends Component {

  static template = xml`
    <Modal title="state.title" active="state.active" onClose="props.onClose" empty="state.loading">
      <Loader class="'p-10 text-xl'" t-if="state.loading" />
      <div t-if="state.user">
        <t t-esc="state.user.username" />
      </div>
    </Modal>
  `;

  static props = {
    userId: { type: String, optional: true },
    onClose: { type: Function, optional: true },
  };

  static components = {
    Modal,
    Loader,
  };

  state = useState<State>({
    loading: false,
    active: false,
    user: undefined,
    title: undefined,
  });

  setup(): void {
    this.fetchUser(this.props.userId);
    onWillUpdateProps((nextProps) => {
      this.fetchUser(nextProps.userId);
    });
  }

  fetchUser(userId: number) {
    if (userId) {
      this.state.loading = true;
      this.state.active = true;
      models.users.find(userId).then((user) => {
        if (!user) {
          notyf.error('User not found');
          this.state.active = false;
          this.state.loading = false;
        } else {
          this.state.loading = false;
          this.state.user = user;
          this.state.title = user.username;
        }
      });  
    } else {
      this.state.active = false;
      this.state.loading = false;
      this.state.user = undefined;
      this.state.title = undefined;
    }
  }
}

export default UserModal;