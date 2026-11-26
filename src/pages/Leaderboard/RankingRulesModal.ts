import { Component, xml } from "@odoo/owl";
import Modal from "../../components/Modal";
import _ from "../../i18n";
import { formatDate, leaderboardName } from "./utils";

/**
 * Plain language explanation of how the ranking is computed
 */
class RankingRulesModal extends Component {
  static template = xml`
    <Modal active="props.active" title="'How ranking works'" onClose="props.onClose">
      <div class="p-5 max-w-lg text-sm text-slate-700 leading-relaxed">
        <h4 class="font-semibold mb-1">One validated translation = one point</h4>
        <p class="mb-4">A translation counts once it has been validated, on the day of its validation. Pending or rejected translations do not count.</p>

        <h4 class="font-semibold mb-1">Current period</h4>
        <p class="mb-4" t-if="props.leaderboard">
          <t t-esc="leaderboardName(props.leaderboard)" />:
          <t t-esc="formatDate(props.leaderboard.startAt)" /> – <t t-esc="formatDate(props.leaderboard.endAt)" />
          (<t t-esc="_('Swiss time')" />).
          <t t-esc="_('Each leaderboard only compares translators within the same period, every week and every month is a fresh start.')" />
        </p>

        <h4 class="font-semibold mb-1">In case of a tie</h4>
        <ol class="list-decimal ml-5 mb-4">
          <li>The translator who reached the score first ranks higher.</li>
          <li>Then the translator with the most validated translations overall.</li>
          <li>Then a fixed technical order, so that every rank is unique.</li>
        </ol>

        <h4 class="font-semibold mb-1">Your visibility</h4>
        <p>Other translators see your first name and the initial of your last name. You can choose to appear as "Anonymous translator" in the settings (gear icon in the menu): you keep your rank and your score.</p>
      </div>
    </Modal>
  `;

  static props = {
    active: { type: Boolean },
    onClose: { type: Function },
    // Undefined until the leaderboards are loaded, or when none is available
    leaderboard: { type: Object, optional: true },
  };

  static components = {
    Modal,
  };

  _ = _;
  formatDate = formatDate;
  leaderboardName = leaderboardName;
}

export default RankingRulesModal;
