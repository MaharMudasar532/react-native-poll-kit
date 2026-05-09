import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import {
  Poll,
  defaultPollTheme,
  getProgressColor,
  mergePollStrings,
  sumVotes,
} from '../index';

describe('react-native-poll-kit', () => {
  it('exports Poll component', () => {
    expect(Poll).toBeTruthy();
  });

  it('mergePollStrings fills defaults', () => {
    expect(mergePollStrings({ voteButton: 'Votar' }).voteButton).toBe('Votar');
    expect(mergePollStrings({ voteButton: 'Votar' }).formatVoteCount(2)).toBe(
      '2 votes'
    );
  });

  it('sumVotes aggregates option votes', () => {
    expect(
      sumVotes([
        { id: '1', label: 'A', votes: 2 },
        { id: '2', label: 'B', votes: 3 },
      ])
    ).toBe(5);
  });

  it('getProgressColor uses theme when no per-option override', () => {
    const opt = { id: '1', label: 'X' };
    expect(getProgressColor(opt, true, defaultPollTheme)).toBe(
      defaultPollTheme.progressTrackSelectedColor
    );
    expect(getProgressColor(opt, false, defaultPollTheme)).toBe(
      defaultPollTheme.progressTrackUnselectedColor
    );
  });

  it('uses strings for Vote button and footer in results', () => {
    const onVote = jest.fn();
    const strings = {
      voteButton: 'Submit',
      formatVoteCount: (n: number) => `Total: ${n}`,
    };

    const { rerender } = render(
      <Poll
        allowMultiple
        options={[
          { id: 'a', label: 'A', votes: 0 },
          { id: 'b', label: 'B', votes: 0 },
        ]}
        question="Q?"
        showResults={false}
        strings={strings}
        onVote={onVote}
      />
    );

    fireEvent.press(screen.getByText('A'));
    fireEvent.press(screen.getByText('Submit'));
    expect(onVote).toHaveBeenCalledWith(['a']);

    rerender(
      <Poll
        allowMultiple
        options={[
          { id: 'a', label: 'A', votes: 1 },
          { id: 'b', label: 'B', votes: 0 },
        ]}
        question="Q?"
        selectedOptionIds={['a']}
        showResults
        strings={strings}
        onVote={onVote}
      />
    );

    expect(screen.getByText('Total: 1')).toBeTruthy();
  });

  it('submits single-select vote on option press', () => {
    const onVote = jest.fn();
    render(
      <Poll
        allowMultiple={false}
        options={[
          { id: 'x', label: 'Pick me', votes: 0 },
          { id: 'y', label: 'Other', votes: 0 },
        ]}
        question="One?"
        showResults={false}
        onVote={onVote}
      />
    );

    fireEvent.press(screen.getByText('Pick me'));
    expect(onVote).toHaveBeenCalledWith(['x']);
  });
});
