import { Component, onWillUpdateProps, useState, xml } from "@odoo/owl";
import Icon from "./Icon";

const backgroundClasses = {
  // [primary classes, secondary classes]
  compassion: ['bg-compassion', 'hover:bg-blue-900', 'hover:bg-compassion'],
  green: ['bg-green-600', 'hover:bg-green-800', 'hover:bg-green-600'],
  red: ['bg-red-600', 'hover:bg-red-800', 'hover:bg-red-600'],
  yellow: ['bg-yellow-500', 'hover:bg-yellow-600', 'hover:bg-yellow-600'],
  slate: ['bg-slate-600', 'hover:bg-slate-800', 'hover:bg-slate-700']
};

const SECONDARY_BG_COLOR = 'bg-slate-300';
const SECONDARY_TEXT_COLOR = 'text-slate-700';

const sizes = {
  sm: {
    default: ['pt-1.5', 'pr-2.5', 'pb-1.5', 'pl-2.5'],
    circle: ['w-7', 'h-7'],
    fontSize: 'text-sm',
  },
  md: {
    default: ['pt-2', 'pr-3', 'pb-2', 'pl-3'],
    circle: ['w-9', 'h-9'],
    fontSize: 'text-base',
  },
  lg: {
    default: ['pt-3', 'pr-4', 'pb-3', 'pl-4'],
    circle: ['w-12', 'h-12'],
    fontSize: 'text-lg',
  },
};

type Props = {
  color?: keyof typeof backgroundClasses;
  level?: 'primary' | 'secondary';
  size?: keyof typeof sizes;
  icon?: [string, string] | string;
  circle?: boolean;
  class?: string;
  onClick: Function;
  disabled?: boolean;
};



class Button extends Component<Props> {

  static template = xml`
    <button t-att-class="props.class + ' ' + state.buttonClass" t-on-click="props.onClick || (() => null)">
      <Icon t-if="props.icon" prefix="state.iconPrefix" icon="state.iconName" class="state.iconClass" />
      <t t-slot="default" />
    </button>
  `;

  static components = {
    Icon,
  };

  static props = {
    color: { type: String, optional: true },
    level: { type: String, optional: true },
    size: { type: String, optional: true },
    icon: { type: String, optional: true },
    class: { type: String, optional: true },
    circle: { type: Boolean, optional: true },
    onClick: { type: Function, optional: true },
    disabled: { type: Boolean, optional: true },
    "*": {},
  };

  static defaultProps = {
    color: 'slate',
    level: 'primary',
    size: 'md',
    icon: undefined,
    circle: false,
    class: '',
  };

  state = useState({
    buttonClass: '',
    iconClass: '',
    iconPrefix: 'fas',
    iconName: '',
  });

  setup(): void {
    this.defineClass(this.props as any);
    onWillUpdateProps((nextProps) => this.defineClass(nextProps));
  }

  defineClass(props: Required<Props>): void {
    const {
      color,
      level,
      size,
      circle,
      icon,
      disabled,
    } = props;

    const classes: string[] & string[][] = [];
    const iconClasses: string[] & string[][] = [];

    // Initial classes
    classes.push('transition-all');

    if (disabled) {
      classes.push('opacity-60 cursor-not-allowed');
    } else {
      classes.push('hover:text-white');
    }

    // Colors
    const bgColorClass = backgroundClasses[color];
    if (level === 'primary') {
      classes.push(bgColorClass[0]);
      if (!disabled) {
        classes.push(bgColorClass[1]);
      }
      classes.push('text-white'); // text is white
    } else {
      classes.push(SECONDARY_BG_COLOR);
      if (!disabled) {
        classes.push(SECONDARY_TEXT_COLOR);
        classes.push(bgColorClass[2]);
      }
    }

    // Icon
    if (icon) {
      if (Array.isArray(icon)) {
        this.state.iconPrefix = icon[0];
        this.state.iconName = icon[1];
      } else {
        this.state.iconName = icon;
      }
    }

    // Paddings
    if (circle) {
      classes.push(sizes[size].circle);
      classes.push('flex justify-center items-center rounded-full');
    } else {
      classes.push('rounded-sm');
      classes.push(sizes[size].default);
      iconClasses.push(sizes[size].default[1]); // Add margin right to icon
    }

    classes.push(sizes[size].fontSize);

    // Build html classes
    this.state.buttonClass = classes.flatMap(it => Array.isArray(it) ? it : [it]).join(' ');
    this.state.iconClass = iconClasses.flatMap(it => Array.isArray(it) ? it : [it]).join(' ');
  }
};

export default Button;