import { Component, useState, onWillStart, onMounted, onWillUnmount } from "@odoo/owl";
import template from './leaderboard.xml';
import { BlurLoader } from '../../components/Loader';
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import RankingRulesModal from "./RankingRulesModal";
import RankingRow from "./RankingRow";
import useCurrentTranslator from "../../hooks/useCurrentTranslator";
import _ from "../../i18n";
import { models } from "../../models";
import { LeaderboardRanking, LeaderboardTab } from "../../models/LeaderboardDAO";
import {
  formatDate, joinRankingText, leaderboardName, myPositionText, periodStatus, tabLabel,
} from "./utils";

/**
 * The ranking is computed by the backend each time it is requested, so it is
 * always up to date when the page or a tab is opened. The clock only refreshes
 * the "time remaining" label.
 */
const CLOCK_INTERVAL = 60 * 1000;

const TAB_ORDER: LeaderboardTab['type'][] = ['campaign', 'weekly', 'monthly'];

type State = {
  leaderboards: LeaderboardTab[];
  selectedId?: number;
  ranking?: LeaderboardRanking;
  loading: boolean;
  rankingLoading: boolean;
  rulesModal: boolean;
  now: number;
};

class Leaderboard extends Component {
  static template = template;
  static components = {
    BlurLoader,
    Button,
    Icon,
    RankingRow,
    RankingRulesModal,
  };

  currentTranslator = useCurrentTranslator();
  _ = _;
  formatDate = formatDate;
  leaderboardName = leaderboardName;
  tabLabel = tabLabel;
  periodStatus = periodStatus;
  myPositionText = myPositionText;
  joinRankingText = joinRankingText;

  state = useState<State>({
    leaderboards: [],
    selectedId: undefined,
    ranking: undefined,
    loading: true,
    rankingLoading: false,
    rulesModal: false,
    now: Date.now(),
  });

  timers: number[] = [];

  setup() {
    onWillStart(async () => {
      await this.currentTranslator.loadIfNotInitialized();
      try {
        const leaderboards = await models.leaderboards.available();
        this.state.leaderboards = TAB_ORDER.flatMap(type => leaderboards.filter(it => it.type === type));

        // The backend flags the default view: the active campaign, otherwise the current week
        const defaultLeaderboard = this.state.leaderboards.find(it => it.isDefault)
          || this.state.leaderboards[0];

        if (defaultLeaderboard) {
          await this.select(defaultLeaderboard.id);
        }
      } catch (e) {
        console.error('Unable to load leaderboards', e);
      } finally {
        this.state.loading = false;
      }
    });

    onMounted(() => {
      this.timers.push(
        window.setInterval(() => this.state.now = Date.now(), CLOCK_INTERVAL),
      );
    });

    onWillUnmount(() => {
      this.timers.forEach(timer => window.clearInterval(timer));
    });
  }

  async select(leaderboardId: number) {
    this.state.selectedId = leaderboardId;
    this.state.rankingLoading = true;
    try {
      await this.reload();
    } finally {
      this.state.rankingLoading = false;
    }
  }

  async reload() {
    const leaderboardId = this.state.selectedId;
    if (leaderboardId === undefined) return;

    try {
      const ranking = await models.leaderboards.standings(leaderboardId);
      // Ignore late responses when the user switched tab in-between
      if (this.state.selectedId === leaderboardId) {
        this.state.ranking = ranking;
        this.state.now = Date.now();
      }
    } catch (e) {
      console.error('Unable to load leaderboard ranking', e);
    }
  }

  get selectedLeaderboard() {
    return this.state.ranking?.leaderboard;
  }

  get isAnonymous(): boolean {
    return this.currentTranslator.data?.leaderboardVisibility === 'anonymous';
  }
}

export default Leaderboard;
