import { Component, xml } from "@odoo/owl";
import _ from "../../i18n";

/**
 * One line of the leaderboard. Ranks and names come from the API as-is
 */
class RankingRow extends Component {
  static template = xml`
    <div t-attf-class="ranking-row flex items-center gap-4 px-5 py-3 border-b border-slate-100 last:border-b-0 {{ props.entry.isCurrentUser ? 'bg-blue-50 border-l-4 border-l-compassion font-medium' : 'bg-white' }}">
      <div class="w-14 shrink-0">
        <t t-if="props.entry.rank !== false">
          <span t-attf-class="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-full text-sm {{ medalClass }}">
            #<t t-esc="props.entry.rank" />
          </span>
        </t>
        <span t-else="" class="text-[11px] text-slate-400 leading-tight">Not ranked yet</span>
      </div>
      <div class="flex-1 text-slate-700 truncate">
        <t t-esc="props.entry.displayName" />
        <span t-if="props.entry.isCurrentUser" class="ml-2 text-xs text-compassion">(<t t-esc="_('you')" />)</span>
        <span t-if="props.entry.isCurrentUser and props.anonymous" class="ml-2 text-xs text-slate-400">· <t t-esc="_('visible as Anonymous translator')" /></span>
      </div>
      <div t-if="props.entry.rank !== false" class="text-right text-slate-700">
        <span class="text-lg" t-esc="props.entry.score" />
        <span class="text-xs text-slate-400 ml-1">pts</span>
      </div>
    </div>
  `;

  static props = {
    // LeaderboardEntry: the display name is already formatted by the backend
    entry: { type: Object },
    // Whether the current user chose to appear as "Anonymous translator"
    anonymous: { type: Boolean, optional: true },
  };

  _ = _;

  get medalClass() {
    switch (this.props.entry.rank) {
      case 1: return 'bg-amber-100 text-amber-700 font-semibold';
      case 2: return 'bg-slate-200 text-slate-700 font-semibold';
      case 3: return 'bg-orange-100 text-orange-700 font-semibold';
      default: return 'text-slate-600';
    }
  }
}

export default RankingRow;
