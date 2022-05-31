import { Component, markup, useState, xml } from "@odoo/owl";
import { icon as makeIcon, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

type Props = {
  prefix: IconPrefix;
  icon: IconName;
};

class Icon extends Component <Props> {

  static template = xml`
    <span t-att-class="props.class || ''"><t t-out="state.icon" /></span>
  `;

  static props = {
    prefix: { type: String, optional: true },
    icon: { type: String },
    '*': {},
  };

  static defaultProps = {
    prefix: 'fas',
  };

  state = useState({
    icon: '',
  });

  setup(): void {

    const { prefix, icon } = this.props;
    const item = makeIcon({
      prefix,
      iconName: icon,
    });

    if (item) {
      this.state.icon = markup(item.html.join('')) as string;
    } else {
      this.state.icon = `Unknown ${prefix} ${icon}`;
    }
  }
};

export default Icon;