import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { PollResultProgressBar } from './ProgressBar';
import type { PollOption, PollTheme } from './types';
import { formatPollPercent, getProgressColor } from './utils';

export type PollOptionRowProps = {
  opt: PollOption;
  index: number;
  showResults: boolean;
  computedTotal: number;
  selected: ReadonlySet<string>;
  allowMultiple: boolean;
  pendingIds: string[];
  rowWidth: number;
  theme: PollTheme;
  voteDisabled: boolean;
  showSelectedCheckmark: boolean;
  animateProgress: boolean;
  progressAnimationDuration: number;
  onToggleMulti: (id: string) => void;
  onVoteSingle: (id: string) => void;
  optionPressableStyle?: StyleProp<ViewStyle>;
  optionRowStyle?: StyleProp<ViewStyle>;
  optionContentStyle?: StyleProp<ViewStyle>;
  optionLabelStyle?: StyleProp<TextStyle>;
  percentStyle?: StyleProp<TextStyle>;
  checkmarkStyle?: StyleProp<TextStyle>;
  resultTrailingStyle?: StyleProp<ViewStyle>;
  separatorStyle?: StyleProp<ViewStyle>;
};

function PollOptionRowInner({
  opt,
  index,
  showResults,
  computedTotal,
  selected,
  allowMultiple,
  pendingIds,
  rowWidth,
  theme,
  voteDisabled,
  showSelectedCheckmark,
  animateProgress,
  progressAnimationDuration,
  onToggleMulti,
  onVoteSingle,
  optionPressableStyle,
  optionRowStyle,
  optionContentStyle,
  optionLabelStyle,
  percentStyle,
  checkmarkStyle,
  resultTrailingStyle,
  separatorStyle,
}: PollOptionRowProps) {
  const votes = opt.votes ?? 0;
  const fraction = computedTotal > 0 ? votes / computedTotal : 0;

  const userMarked =
    (showResults && selected.has(opt.id)) ||
    (!showResults && allowMultiple && pendingIds.includes(opt.id));

  const progressFill = getProgressColor(opt, userMarked, theme);

  const accessibilityHint = showResults
    ? undefined
    : allowMultiple
      ? 'Double tap to toggle this choice'
      : 'Double tap to vote';

  const resultSelected =
    showResults && showSelectedCheckmark && selected.has(opt.id);

  const resultBorderW = showResults
    ? userMarked
      ? theme.optionResultSelectedBorderWidth
      : theme.optionResultBorderWidth
    : 0;

  const optionTextColor = opt.textColor ?? theme.optionTextColor;
  const percentColor =
    opt.percentColor ??
    opt.textColor ??
    theme.percentTextColor ??
    theme.metaTextColor;
  const radioAccent =
    opt.radioColor ?? theme.radioColor ?? opt.textColor ?? theme.accentColor;
  const checkmarkColor =
    opt.checkmarkColor ?? theme.checkmarkColor ?? optionTextColor;

  const resolvedRowBackground =
    opt.backgroundColor != null && opt.backgroundColor !== ''
      ? opt.backgroundColor
      : theme.optionRowBackgroundColor;

  return (
    <View style={showResults && index > 0 ? styles.resultOptionSpacer : null}>
      {index > 0 && !showResults ? (
        <View
          style={[
            styles.separator,
            { backgroundColor: theme.separatorColor },
            separatorStyle,
          ]}
        />
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Option ${opt.label}`}
        accessibilityState={{
          selected: userMarked,
          disabled: voteDisabled,
        }}
        accessibilityHint={accessibilityHint}
        disabled={voteDisabled}
        onPress={() => {
          if (voteDisabled) {
            return;
          }
          if (allowMultiple) {
            onToggleMulti(opt.id);
          } else {
            onVoteSingle(opt.id);
          }
        }}
        style={({ pressed }) => [
          styles.optionPressable,
          showResults && styles.optionPressableResults,
          resolvedRowBackground != null &&
            resolvedRowBackground !== '' && {
              backgroundColor: resolvedRowBackground,
            },
          showResults && {
            borderWidth: resultBorderW,
            borderColor: theme.optionResultBorderColor,
          },
          optionPressableStyle,
          !voteDisabled && pressed && styles.optionPressed,
        ]}
      >
        <View
          style={[
            styles.optionRow,
            showResults && styles.optionRowResults,
            optionRowStyle,
          ]}
        >
          {showResults ? (
            <PollResultProgressBar
              active={showResults}
              fraction={fraction}
              rowWidth={rowWidth}
              backgroundColor={progressFill}
              duration={progressAnimationDuration}
              animate={animateProgress}
            />
          ) : null}
          <View style={[styles.optionContent, optionContentStyle]}>
            {!showResults ? (
              <View
                style={[
                  styles.radioOuter,
                  {
                    borderColor: radioAccent,
                  },
                ]}
              >
                {userMarked ? (
                  <View
                    style={[
                      styles.radioInner,
                      { backgroundColor: radioAccent },
                    ]}
                  />
                ) : null}
              </View>
            ) : null}
            <Text
              style={[
                styles.optionLabel,
                !showResults && userMarked && styles.optionLabelEmphasis,
                showResults && styles.optionLabelResults,
                { color: optionTextColor },
                optionLabelStyle,
              ]}
            >
              {opt.label}
            </Text>
            {showResults ? (
              <View style={[styles.resultTrailing, resultTrailingStyle]}>
                {resultSelected ? (
                  <Text
                    accessibilityLabel="Selected"
                    style={[
                      styles.checkmark,
                      { color: checkmarkColor },
                      checkmarkStyle,
                    ]}
                  >
                    ✓
                  </Text>
                ) : null}
                <Text
                  style={[
                    styles.percentText,
                    styles.percentTextResults,
                    { color: percentColor },
                    percentStyle,
                  ]}
                >
                  {formatPollPercent(fraction)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export const PollOptionRow = memo(PollOptionRowInner);

const styles = StyleSheet.create({
  resultOptionSpacer: {
    marginTop: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 14,
    marginRight: 14,
  },
  optionPressable: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  optionPressableResults: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionRow: {
    position: 'relative',
    minHeight: 48,
    justifyContent: 'center',
  },
  optionRowResults: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
  },
  optionLabelResults: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  optionLabelEmphasis: {
    fontWeight: '600',
  },
  resultTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
    lineHeight: 20,
  },
  percentText: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
  },
  percentTextResults: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '700',
  },
});
