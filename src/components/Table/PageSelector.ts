import { Component, onWillUpdateProps, useState, xml } from "@odoo/owl";
import { PropsType } from "../../UtilityTypes";

const props = {
  page: { type: Number },
  total: { type: Number },
  pageSize: { type: Number },
  onPageChange: { type: Function },
};

type Props = PropsType<typeof props>;

type PaginationButton = {
  type: 'page';
  id: number;
} | {
  type: 'fill';
  id: number;
};

type State = {
  paginationButtons: PaginationButton[];
  pages: number;
};

/**
 * Dummy Page Selector, displays buttons to select the page
 * we want to go to. The algorithm to define what page numbers
 * are displayed is really dumb, I'm almost ashamed, but I was
 * tired when writing it and believes it is a good testimony of my
 * motivation to finish it before going to bed. Please do not
 * try to rewrite it as I poured my soul and mind into it.
 */
class PageSelector extends Component<Props> {

  static template = xml`
    <div class="flex">
      <t t-foreach="state.paginationButtons" t-as="btn" t-key="btn.id">
        <div class="mr-1">
          <button t-if="btn.type === 'page'"
            t-esc="btn.id + 1"
            t-on-click="() => props.page === btn.id ? null : props.onPageChange(btn.id)"
            class="w-7 h-7 flex justify-center items-center transition-colors rounded-sm text-sm"
            t-att-class="{
              'bg-compassion shadow-inner text-white': btn.id === props.page,
              'text-slate-700 hover:bg-black-20': btn.id !== props.page,
            }" />
          <span t-else=""
            t-esc="'...'"
            class="w-7 h-7 flex text-xs justify-center items-center text-slate-500" />
        </div>
      </t>
    </div>
  `;

  static props = props;
  state = useState<State>({
    paginationButtons: [],
    pages: 0,
  });

  setup(): void {
    this.update(this.props);
    onWillUpdateProps((nextProps: Props) => {
      this.update(nextProps);
    });
  }

  /**
   * Look at this master piece of code
   */
  update({ page, total, pageSize }: Props) {
    const pages = Math.ceil(total / pageSize);
    const res: PaginationButton[] = [];

    // Small number of pages
    if (pages < 5) {
      for (let i = 0; i < pages; i++) {
        res.push({
          type: 'page',
          id: i,
        });
      }
    }
    // At the start of the list
    else if (page === 0 || page === 1 || page === 2) {
      for (let i = 0; i < 4; i++) {
        res.push({
          type: 'page',
          id: i,
        });
      }

      res.push({ type: 'fill', id: Math.random() });
      res.push({ type: 'page', id: pages - 1});
    } 
    // At the end of the list
    else if (page === pages - 1 || page === pages - 2 || page === pages - 3) {
      res.push({ type: 'page', id: 0});
      res.push({ type: 'fill', id: Math.random() });  
      for (let i = pages - 3; i < pages; i++) {
        res.push({
          type: 'page',
          id: i,
        });
      }
    }
    // Generic case
    else {
      res.push({ type: 'page', id: 0});
      res.push({ type: 'fill', id: Math.random()});
      res.push({ type: 'page', id: page - 1});
      res.push({ type: 'page', id: page });
      res.push({ type: 'page', id: page + 1});
      res.push({ type: 'fill', id: Math.random()});
      res.push({ type: 'page', id: pages - 1});
    }

    this.state.paginationButtons = res;
  }
};

export default PageSelector;