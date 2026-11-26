import _, { selectedLang } from "../../i18n";
import { Leaderboard, LeaderboardType, parseOdooDatetime } from "../../models/LeaderboardDAO";

/**
 * All period boundaries are defined in the Europe/Zurich time zone,
 * regardless of the translator's location
 */
export const LEADERBOARD_TIME_ZONE = 'Europe/Zurich';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Replaces {placeholders} in an already translated string
 */
export function format(str: string, params: Record<string, string | number>): string {
  return Object.keys(params).reduce((acc, key) => acc.split(`{${key}}`).join(`${params[key]}`), str);
}

function locale(): string {
  return selectedLang.replace('_', '-');
}

export function formatDate(value: string): string {
  return parseOdooDatetime(value).toLocaleDateString(locale(), {
    timeZone: LEADERBOARD_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

type NamedLeaderboard = { type: LeaderboardType; name: string; startAt?: string };

/**
 * Period name displayed to translators. The backend name of weekly and monthly
 * leaderboards is not translated, so it is rebuilt from the start date in the
 * user's language. Campaign leaderboards use the campaign name.
 */
export function leaderboardName(leaderboard: NamedLeaderboard): string {
  if (leaderboard.type === 'campaign' || !leaderboard.startAt) return leaderboard.name;

  const start = parseOdooDatetime(leaderboard.startAt);
  if (leaderboard.type === 'monthly') {
    return start.toLocaleDateString(locale(), { timeZone: LEADERBOARD_TIME_ZONE, month: 'long', year: 'numeric' });
  }
  return format(_('Week of {date}'), { date: formatDate(leaderboard.startAt) });
}

export function tabLabel(leaderboard: NamedLeaderboard): string {
  switch (leaderboard.type) {
    case 'weekly': return _('This Week');
    case 'monthly': return _('This Month');
    default: return leaderboard.name;
  }
}

/**
 * "Time remaining" while the period runs, then the closing / final state
 */
export function periodStatus(leaderboard: Leaderboard, now: number): string {
  if (leaderboard.state === 'final') return _('Final results');
  if (leaderboard.state === 'closing') return _('Results being finalized');

  const remaining = parseOdooDatetime(leaderboard.endAt).getTime() - now;
  if (remaining <= 0) return _('Results being finalized');
  if (remaining >= 2 * DAY) return format(_('{n} days left'), { n: Math.floor(remaining / DAY) });
  if (remaining >= 2 * HOUR) return format(_('{n} hours left'), { n: Math.floor(remaining / HOUR) });
  return _('Less than 2 hours left');
}

/**
 * Positive framing of the user's own position, e.g. "You are #34 of 120 this week"
 */
export function myPositionText(leaderboard: Leaderboard, rank: number, total: number): string {
  const params = { rank, total };
  switch (leaderboard.type) {
    case 'weekly': return format(_('You are #{rank} of {total} this week'), params);
    case 'monthly': return format(_('You are #{rank} of {total} this month'), params);
    default: return format(_('You are #{rank} of {total} in this campaign'), params);
  }
}

/**
 * Encouraging message displayed instead of a rank to users without any point
 */
export function joinRankingText(leaderboard: Leaderboard): string {
  switch (leaderboard.type) {
    case 'weekly': return _('Translate your first letter this week to join the ranking');
    case 'monthly': return _('Translate your first letter this month to join the ranking');
    default: return _('Translate your first letter during this campaign to join the ranking');
  }
}
