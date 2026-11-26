import { Component, onWillStart, useState, xml } from "@odoo/owl";
import RouterLink from "../../components/Router/RouterLink";
import Icon from "../../components/Icon";
import _ from "../../i18n";
import { models } from "../../models";
import { LeaderboardSummary } from "../../models/LeaderboardDAO";
import { leaderboardName } from "../Leaderboard/utils";

/**
 * Current weekly and campaign positions of the translator, along with
 * their best final campaign rank. Loaded on its own so that it never
 * slows down the home page.
 */
class LeaderboardSummaryCard extends Component {
  static template = xml`
    <div t-if="state.summary" class="leaderboard-summary flex flex-wrap justify-center gap-4 mb-10">
      <div class="bg-white border border-slate-200 rounded-sm shadow-sm px-5 py-3 text-center min-w-[10rem]">
        <p class="text-xs text-slate-500 mb-1">This Week</p>
        <t t-if="state.summary.weekly and state.summary.weekly.rank !== false">
          <p class="text-slate-700"><span class="text-lg text-compassion">#<t t-esc="state.summary.weekly.rank" /></span> · <t t-esc="state.summary.weekly.score" /> pts</p>
        </t>
        <p t-else="" class="text-sm text-slate-400">Not ranked yet</p>
      </div>
      <div t-if="state.summary.campaign" class="bg-white border border-slate-200 rounded-sm shadow-sm px-5 py-3 text-center min-w-[10rem]">
        <p class="text-xs text-slate-500 mb-1" t-esc="leaderboardName(state.summary.campaign.leaderboard)" />
        <t t-if="state.summary.campaign.rank !== false">
          <p class="text-slate-700"><span class="text-lg text-compassion">#<t t-esc="state.summary.campaign.rank" /></span> · <t t-esc="state.summary.campaign.score" /> pts</p>
        </t>
        <p t-else="" class="text-sm text-slate-400">Not ranked yet</p>
      </div>
      <div t-if="state.summary.bestCampaignRank !== false" class="bg-white border border-slate-200 rounded-sm shadow-sm px-5 py-3 text-center min-w-[10rem]">
        <p class="text-xs text-slate-500 mb-1">Best campaign rank</p>
        <p class="text-lg text-compassion">#<t t-esc="state.summary.bestCampaignRank" /></p>
      </div>
      <RouterLink to="'/leaderboard'">
        <div class="h-full flex items-center gap-2 px-4 py-3 text-sm text-compassion hover:underline">
          <Icon icon="'ranking-star'" />
          <t t-esc="_('See the leaderboard')" />
        </div>
      </RouterLink>
    </div>
  `;

  static components = {
    RouterLink,
    Icon,
  };

  _ = _;
  leaderboardName = leaderboardName;

  state = useState({
    summary: undefined as LeaderboardSummary | undefined,
  });

  setup() {
    onWillStart(() => {
      // Not awaited on purpose: the card simply appears once loaded
      models.leaderboards.mySummary()
        .then(summary => this.state.summary = summary)
        .catch(e => console.error('Unable to load leaderboard summary', e));
    });
  }
}

export default LeaderboardSummaryCard;
