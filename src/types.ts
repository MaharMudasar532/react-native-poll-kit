import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { PollStrings } from './strings';

export type PollOption = {
  id: string;
  label: string;
  /** Vote count for this option; used when `showResults` is true. */
  votes?: number;
  /**
   * Overrides progress bar fill for this option (results mode).
   * Use with `progressColorSelected` / `progressColorUnselected` for voter vs other styling.
   */
  progressColor?: string;
  /** Progress bar color when this option is one of `selectedOptionIds`. */
  progressColorSelected?: string;
  /** Progress bar color when this option is not selected by the current viewer. */
  progressColorUnselected?: string;
  /** Label text color; also used for checkmark and % when the more specific colors below are omitted. */
  textColor?: string;
  /** Voting-mode circle (border + inner dot). Overrides `theme.radioColor` and `textColor` for the ring only. */
  radioColor?: string;
  /** Results ✓ color for this option. Overrides `theme.checkmarkColor` and label `textColor`. */
  checkmarkColor?: string;
  /** Results **%** text color. Overrides `theme.percentTextColor`, `textColor`, and meta. */
  percentColor?: string;
  /** Background for this option’s row; omit to use `theme.optionRowBackgroundColor` or transparent. */
  backgroundColor?: string;
};

export type PollTheme = {
  cardBackground: string;
  cardBorderColor: string;
  questionColor: string;
  optionTextColor: string;
  metaTextColor: string;
  accentColor: string;
  /**
   * Voting-mode radio circle (border + fill). Default: falls back to `accentColor` if unset in merge.
   * @see PollOption.radioColor per-row override
   */
  radioColor?: string;
  /**
   * Results checkmark (✓) when the viewer selected this option. Default: each row uses label `textColor` / `optionTextColor`.
   * Set here for one accent checkmark across all options.
   */
  checkmarkColor?: string;
  /**
   * Default **%** color in results when an option omits `percentColor` / `textColor`.
   * Default: `metaTextColor`.
   */
  percentTextColor?: string;
  /** Default results bar tint; used if selected/unselected colors are omitted. */
  progressTrackColor: string;
  /** Results bar fill for options the current user voted for. */
  progressTrackSelectedColor: string;
  /** Results bar fill for options the current user did not vote for. */
  progressTrackUnselectedColor: string;
  voteButtonTextColor: string;
  separatorColor: string;
  /** Border around each option when showing results (react-native-poll style outline). */
  optionResultBorderColor: string;
  optionResultBorderWidth: number;
  /** Thicker border for options the viewer selected (after vote). */
  optionResultSelectedBorderWidth: number;
  /**
   * Row background for options that omit `PollOption.backgroundColor`.
   * Leave unset for a transparent row (card shows through).
   */
  optionRowBackgroundColor?: string;
};

export type PollProps = {
  /** Single- or multi-select poll with optional results view, progress bars, and themes. */
  question: string;
  options: ReadonlyArray<PollOption>;
  /** When true, shows percentages and vote bars (WhatsApp-style results). */
  showResults?: boolean;
  /** Option ids the current user picked (filled radio + emphasis in results). */
  selectedOptionIds?: string[];
  /** Allows several choices before submitting (shows a **Vote** action). */
  allowMultiple?: boolean;
  onVote?: (optionIds: string[]) => void;
  /**
   * When false, blocks further interaction after `onVote` until the parent clears voting state
   * (`showResults` / selection). Reduces duplicate `onVote` before the parent updates.
   */
  allowRevote?: boolean;
  /** Overrides total shown in the footer; default is sum of `votes` on each option. */
  totalVotes?: number;
  theme?: Partial<PollTheme>;
  testID?: string;
  /**
   * Outermost wrapper — use for **width**, `alignSelf`, margins around the whole poll.
   * Merged before `containerStyle` (so `containerStyle` can override).
   */
  mainContainerStyle?: StyleProp<ViewStyle>;
  /** Outer wrapper (e.g. width, margins). @see mainContainerStyle */
  containerStyle?: StyleProp<ViewStyle>;
  /** Main poll surface — merged after defaults (card chrome). Often used for width, borderRadius. */
  style?: StyleProp<ViewStyle>;
  questionStyle?: StyleProp<TextStyle>;
  /** Wrapper around the options list. */
  optionsContainerStyle?: StyleProp<ViewStyle>;
  /** Applied to each option `Pressable`. */
  optionPressableStyle?: StyleProp<ViewStyle>;
  /** Inner row that holds the bar + content (e.g. minHeight). */
  optionRowStyle?: StyleProp<ViewStyle>;
  /** Row content: radio + label + percent. */
  optionContentStyle?: StyleProp<ViewStyle>;
  optionLabelStyle?: StyleProp<TextStyle>;
  percentStyle?: StyleProp<TextStyle>;
  footerStyle?: StyleProp<TextStyle>;
  voteButtonStyle?: StyleProp<ViewStyle>;
  voteButtonTextStyle?: StyleProp<TextStyle>;
  /**
   * When true (default), animates result bar width. Duration: `progressAnimationDuration`.
   */
  animateProgress?: boolean;
  /** Duration in ms for progress reveal when `animateProgress` is true. Default 1250. */
  progressAnimationDuration?: number;
  /** ✓ next to the percent for the viewer’s choice(s) in results (react-native-poll pattern). Default true. */
  showSelectedCheckmark?: boolean;
  checkmarkStyle?: StyleProp<TextStyle>;
  /** Row that wraps checkmark + percent in results mode. */
  resultTrailingStyle?: StyleProp<ViewStyle>;
  /** Hairline between options in voting mode (hidden in results). */
  separatorStyle?: StyleProp<ViewStyle>;
  /**
   * User-visible strings. Defaults to English; override for i18n.
   * @example `{ voteButton: 'Votar', formatVoteCount: (n) => n === 1 ? '1 voto' : \`\${n} votos\` }`
   */
  strings?: Partial<PollStrings>;
  /**
   * When true (default), runs `LayoutAnimation` once when `showResults` becomes true (option list reflow).
   * Set false if it conflicts with your navigator animations.
   */
  resultLayoutAnimation?: boolean;
};
