export type PollStrings = {
  /** Multi-select submit action label. */
  voteButton: string;
  /** Footer under results, e.g. `(42) => "42 votes"`. */
  formatVoteCount: (totalVotes: number) => string;
};

export const defaultPollStrings: PollStrings = {
  voteButton: 'Vote',
  formatVoteCount: (n) => (n === 1 ? '1 vote' : `${n} votes`),
};

export function mergePollStrings(partial?: Partial<PollStrings>): PollStrings {
  return { ...defaultPollStrings, ...partial };
}
