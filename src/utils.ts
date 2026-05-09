import type { PollOption, PollTheme } from './types';

export function sumVotes(options: ReadonlyArray<PollOption>): number {
  let sum = 0;
  for (const o of options) {
    sum += o.votes ?? 0;
  }
  return sum;
}

export function formatPollPercent(fraction: number): string {
  const pct = Math.round(fraction * 100);
  return ` ${pct}%`;
}

export function getProgressColor(
  opt: PollOption,
  userMarked: boolean,
  theme: PollTheme
): string {
  if (opt.progressColor != null && opt.progressColor !== '') {
    return opt.progressColor;
  }
  if (
    userMarked &&
    opt.progressColorSelected != null &&
    opt.progressColorSelected !== ''
  ) {
    return opt.progressColorSelected;
  }
  if (
    !userMarked &&
    opt.progressColorUnselected != null &&
    opt.progressColorUnselected !== ''
  ) {
    return opt.progressColorUnselected;
  }
  return userMarked
    ? theme.progressTrackSelectedColor
    : theme.progressTrackUnselectedColor;
}
