import { StyleSheet } from 'react-native';
import type { PollTheme } from './types';

export const defaultPollTheme: PollTheme = {
  cardBackground: '#FFFFFF',
  cardBorderColor: 'rgba(0, 0, 0, 0.08)',
  questionColor: '#111B21',
  optionTextColor: '#111B21',
  metaTextColor: '#667781',
  accentColor: '#00A884',
  progressTrackColor: 'rgba(0, 168, 132, 0.18)',
  progressTrackSelectedColor: 'rgba(0, 168, 132, 0.32)',
  progressTrackUnselectedColor: 'rgba(0, 168, 132, 0.12)',
  voteButtonTextColor: '#00A884',
  separatorColor: 'rgba(0, 0, 0, 0.06)',
  optionResultBorderColor: 'rgba(0, 0, 0, 0.12)',
  optionResultBorderWidth: StyleSheet.hairlineWidth,
  optionResultSelectedBorderWidth: 1,
};

export const whatsappChatTheme: Partial<PollTheme> = {
  accentColor: '#25D366',
  voteButtonTextColor: '#25D366',
  progressTrackColor: 'rgba(37, 211, 102, 0.2)',
  progressTrackSelectedColor: 'rgba(37, 211, 102, 0.38)',
  progressTrackUnselectedColor: 'rgba(37, 211, 102, 0.14)',
  cardBackground: '#FFFFFF',
  cardBorderColor: 'rgba(0, 0, 0, 0.06)',
  questionColor: '#111B21',
  optionTextColor: '#111B21',
  metaTextColor: '#667781',
  separatorColor: 'rgba(0, 0, 0, 0.06)',
  optionResultBorderColor: 'rgba(0, 0, 0, 0.1)',
};

export function mergePollTheme(partial?: Partial<PollTheme>): PollTheme {
  if (!partial) {
    return defaultPollTheme;
  }
  const t = { ...defaultPollTheme, ...partial };
  const p = partial;
  return {
    ...t,
    progressTrackSelectedColor:
      p.progressTrackSelectedColor ??
      (p.progressTrackColor !== undefined
        ? p.progressTrackColor
        : t.progressTrackSelectedColor),
    progressTrackUnselectedColor:
      p.progressTrackUnselectedColor ??
      (p.progressTrackColor !== undefined
        ? p.progressTrackColor
        : t.progressTrackUnselectedColor),
  };
}
