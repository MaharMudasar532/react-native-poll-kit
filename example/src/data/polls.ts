import type { PollOption } from 'react-native-poll-kit';

export type DemoPoll = {
  id: string;
  question: string;
  allowMultiple: boolean;
  options: PollOption[];
};

/** Option id → vote count, per poll id — keep tallies out of static `initialPolls`. */
export type PollVoteTally = Record<string, Record<string, number>>;

export function mergePollsWithVoteTally(
  polls: readonly DemoPoll[],
  tally: PollVoteTally
): DemoPoll[] {
  return polls.map((p) => ({
    ...p,
    options: p.options.map((o) => ({
      ...o,
      votes: tally[p.id]?.[o.id] ?? o.votes ?? 0,
    })),
  }));
}

export const initialPolls: readonly DemoPoll[] = [
  {
    id: 'lunch',
    question: 'Where should we go for lunch?',
    allowMultiple: false,
    options: [
      {
        id: 'a',
        label: 'Italian',
        votes: 0,
        textColor: '#7B241C',
        backgroundColor: '#FDEDEC',
      },
      {
        id: 'b',
        label: 'Sushi',
        votes: 0,
        textColor: '#1B4F72',
        backgroundColor: '#EBF5FB',
      },
      {
        id: 'c',
        label: 'Salad bar',
        votes: 0,
        textColor: '#145A32',
        backgroundColor: '#E9F7EF',
      },
    ],
  },
  {
    id: 'features',
    question: 'Which features should we ship next? (pick all that apply)',
    allowMultiple: true,
    options: [
      { id: '1', label: 'Dark mode', votes: 0 },
      { id: '2', label: 'Polls in channels', votes: 0 },
      { id: '3', label: 'Voice notes', votes: 0 },
    ],
  },
];
