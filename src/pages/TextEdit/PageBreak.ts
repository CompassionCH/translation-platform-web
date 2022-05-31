import { Component, xml } from "@odoo/owl";
import Button from "../../components/Button";


class PageBreak extends Component {

  static template = xml`
    <div class="flex items-center">
      <div class="w-full flex justify-center relative">
        <div class="absolute w-full border-b-2 border-dashed border-slate-400 top-1/2" />
        <div class="bg-slate-200 px-2 py-1 border-2 border-dashed border-slate-400 rounded text-xs font-semibold text-slate-700 relative">Page Break</div>
      </div>
      <div class="flex flex-col justify-center pl-3">
        <Button circle="true" class="'mb-2'" level="'secondary'" color="'red'" icon="'trash'" onClick="this.props.onRemove" />
      </div>
    </div>
  `;

  static components = {
    Button,
  };

  static props = ['onRemove'];
}

export default PageBreak;