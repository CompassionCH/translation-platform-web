import OdooAPI from "./OdooAPI";

export type LeaderboardType = 'campaign' | 'weekly' | 'monthly';

export type LeaderboardState = 'scheduled' | 'live' | 'closing' | 'final';

export type LeaderboardVisibility = 'public' | 'anonymous';

/**
 * A leaderboard as listed in the tabs (translation.leaderboard.get_available_leaderboards)
 */
export type LeaderboardTab = {
  id: number;
  type: LeaderboardType;
  nameKey: string;
  name: string;
  isDefault: boolean;
};

/**
 * Period information of a leaderboard (translation.leaderboard.get_standings)
 */
export type Leaderboard = {
  id: number;
  type: LeaderboardType;
  nameKey: string;
  name: string;
  state: LeaderboardState;
  // Naive UTC datetimes as returned by Odoo
  startAt: string;
  endAt: string;
};

export type LeaderboardEntry = {
  // false for users listed without rank ("Not ranked yet")
  rank: number | false;
  score: number;
  // Already formatted by the backend ("Anna M." or "Anonymous translator")
  displayName: string;
  isCurrentUser: boolean;
};

export type LeaderboardRanking = {
  leaderboard: Leaderboard;
  participantCount: number;
  top: LeaderboardEntry[];
  // Rows below the top 10 down to the current user (+2)
  around: LeaderboardEntry[];
  // True when there is a gap between the top 10 and the "around" block
  showSeparator: boolean;
  myRank: number | false;
  myScore: number;
  // Users with 0 points, only filled when the leaderboard shows inactive users
  notRanked: LeaderboardEntry[];
};

export type LeaderboardPosition = {
  leaderboard: Pick<Leaderboard, 'id' | 'type' | 'nameKey' | 'name' | 'state'>;
  rank: number | false;
  score: number;
  participantCount: number;
};

export type LeaderboardSummary = {
  weekly: LeaderboardPosition | false;
  campaign: LeaderboardPosition | false;
  bestCampaignRank: number | false;
  visibility: LeaderboardVisibility;
};

type RawEntry = {
  rank?: number;
  score?: number;
  displayName: string;
  isCurrentUser: boolean;
};

type RawStandings = {
  id: number;
  type: LeaderboardType;
  nameKey: string;
  name: string;
  state: LeaderboardState;
  startAt: string;
  endAt: string;
  participantCount: number;
  top: RawEntry[];
  around: RawEntry[];
  showSeparator?: boolean;
  myRank: number | false;
  myScore: number;
  notRanked?: RawEntry[];
};

type RawPosition = {
  id: number;
  type: LeaderboardType;
  nameKey: string;
  name: string;
  state: LeaderboardState;
  rank: number | false;
  score: number;
  participantCount: number;
};

type RawSummary = {
  weekly: RawPosition | false;
  campaign: RawPosition | false;
  bestCampaignRank: number | false;
  visibility: LeaderboardVisibility;
};

function cleanEntry(entry: RawEntry): LeaderboardEntry {
  return {
    rank: entry.rank ?? false,
    score: entry.score ?? 0,
    displayName: entry.displayName,
    isCurrentUser: entry.isCurrentUser,
  };
}

function cleanPosition(position: RawPosition | false): LeaderboardPosition | false {
  if (!position) return false;
  const { rank, score, participantCount, ...leaderboard } = position;
  return { leaderboard, rank, score, participantCount };
}

/**
 * Leaderboards are computed and cached by the backend. The frontend only
 * displays what it receives: it never sorts entries nor computes ranks.
 */
const LeaderboardDAO = {

  /**
   * Returns the leaderboards translators can currently browse
   * (active campaign, current week and current month)
   */
  async available(): Promise<LeaderboardTab[]> {
    const leaderboards = await OdooAPI.execute_kw<LeaderboardTab[]>('translation.leaderboard', 'get_available_leaderboards', []);
    return leaderboards || [];
  },

  /**
   * Returns the latest computed ranking of a leaderboard, seen from the current user
   */
  async standings(leaderboardId: number): Promise<LeaderboardRanking | undefined> {
    const raw = await OdooAPI.execute_kw<RawStandings>('translation.leaderboard', 'get_standings', [[leaderboardId]]);
    if (!raw || !raw.id) return undefined;
    return {
      leaderboard: {
        id: raw.id,
        type: raw.type,
        nameKey: raw.nameKey,
        name: raw.name,
        state: raw.state,
        startAt: raw.startAt,
        endAt: raw.endAt,
      },
      participantCount: raw.participantCount,
      top: (raw.top || []).map(cleanEntry),
      around: (raw.around || []).map(cleanEntry),
      showSeparator: !!raw.showSeparator,
      myRank: raw.myRank,
      myScore: raw.myScore,
      notRanked: (raw.notRanked || []).map(cleanEntry),
    };
  },

  /**
   * Returns the current user's positions, displayed on the home page
   */
  async mySummary(): Promise<LeaderboardSummary | undefined> {
    const raw = await OdooAPI.execute_kw<RawSummary>('translation.leaderboard', 'get_my_profile_standings', []);
    if (!raw) return undefined;
    return {
      weekly: cleanPosition(raw.weekly),
      campaign: cleanPosition(raw.campaign),
      bestCampaignRank: raw.bestCampaignRank,
      visibility: raw.visibility,
    };
  },

  /**
   * Anonymous users keep their rank and score, but other translators
   * see "Anonymous translator" instead of their name
   */
  async setVisibility(translatorId: number, visibility: LeaderboardVisibility): Promise<boolean> {
    const result = await OdooAPI.execute_kw<boolean>('translation.user', 'write', [[translatorId], { leaderboard_visibility: visibility }]);
    return !!result;
  },
};

/**
 * Odoo returns datetimes as naive UTC strings ("2026-10-05 22:00:00")
 */
export function parseOdooDatetime(value: string): Date {
  const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(value);
  return new Date(hasTimezone ? value : `${value.replace(' ', 'T')}Z`);
}

export default LeaderboardDAO;
