import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
  type LayoutChangeEvent,
} from 'react-native';

import { PollOptionRow } from './PollOptionRow';
import { mergePollStrings } from './strings';
import { mergePollTheme } from './theme';
import type { PollProps } from './types';
import { sumVotes } from './utils';

function PollComponent({
  question,
  options,
  showResults = false,
  selectedOptionIds = [],
  allowMultiple = false,
  onVote,
  totalVotes: totalVotesProp,
  theme: themePartial,
  testID,
  mainContainerStyle,
  containerStyle,
  style: cardStyle,
  questionStyle,
  optionsContainerStyle,
  optionPressableStyle,
  optionRowStyle,
  optionContentStyle,
  optionLabelStyle,
  percentStyle,
  footerStyle,
  voteButtonStyle,
  voteButtonTextStyle,
  separatorStyle,
  animateProgress = true,
  progressAnimationDuration = 1250,
  showSelectedCheckmark = true,
  checkmarkStyle,
  resultTrailingStyle,
  allowRevote = true,
  strings: stringsPartial,
  resultLayoutAnimation = true,
}: PollProps) {
  const theme = useMemo(() => mergePollTheme(themePartial), [themePartial]);
  const strings = useMemo(
    () => mergePollStrings(stringsPartial),
    [stringsPartial]
  );

  const membershipKey = [...selectedOptionIds].sort().join(',');
  const selected = useMemo(
    () => new Set(selectedOptionIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `membershipKey` reflects selection membership; order-insensitive.
    [membershipKey]
  );

  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [rowWidth, setRowWidth] = useState(0);
  const [voteCommitted, setVoteCommitted] = useState(false);
  const prevShowResults = useRef(showResults);
  const prevShowResultsForLayout = useRef(showResults);

  useLayoutEffect(() => {
    if (!resultLayoutAnimation) {
      prevShowResultsForLayout.current = showResults;
      return;
    }
    if (!prevShowResultsForLayout.current && showResults) {
      if (
        Platform.OS === 'android' &&
        typeof UIManager.setLayoutAnimationEnabledExperimental === 'function'
      ) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    prevShowResultsForLayout.current = showResults;
  }, [resultLayoutAnimation, showResults]);

  useEffect(() => {
    if (allowRevote) {
      prevShowResults.current = showResults;
      return;
    }
    if (prevShowResults.current && !showResults) {
      setVoteCommitted(false);
    }
    if (!showResults && selectedOptionIds.length === 0) {
      setVoteCommitted(false);
    }
    prevShowResults.current = showResults;
  }, [allowRevote, showResults, selectedOptionIds.length]);

  useEffect(() => {
    if (showResults) {
      setPendingIds([]);
    }
  }, [showResults]);

  const computedTotal = totalVotesProp ?? (showResults ? sumVotes(options) : 0);

  const onOptionsLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      const inset = showResults ? 20 : 0;
      setRowWidth(Math.max(0, w - inset));
    },
    [showResults]
  );

  const togglePending = useCallback(
    (id: string) => {
      if (showResults || !allowMultiple || (!allowRevote && voteCommitted)) {
        return;
      }
      setPendingIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    [allowMultiple, allowRevote, showResults, voteCommitted]
  );

  const submitSingle = useCallback(
    (id: string) => {
      if (showResults || allowMultiple || (!allowRevote && voteCommitted)) {
        return;
      }
      if (!allowRevote) {
        setVoteCommitted(true);
      }
      onVote?.([id]);
    },
    [allowMultiple, allowRevote, onVote, showResults, voteCommitted]
  );

  const submitMultiple = useCallback(() => {
    if (
      showResults ||
      !allowMultiple ||
      pendingIds.length === 0 ||
      (!allowRevote && voteCommitted)
    ) {
      return;
    }
    if (!allowRevote) {
      setVoteCommitted(true);
    }
    onVote?.(pendingIds);
  }, [
    allowMultiple,
    allowRevote,
    onVote,
    pendingIds,
    showResults,
    voteCommitted,
  ]);

  const voteDisabled =
    showResults ||
    options.length === 0 ||
    (!allowRevote && voteCommitted && !showResults);

  return (
    <View style={[mainContainerStyle, containerStyle]} testID={testID}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.cardBorderColor,
          },
          cardStyle,
        ]}
      >
        <Text
          style={[
            styles.question,
            { color: theme.questionColor },
            questionStyle,
          ]}
        >
          {question}
        </Text>

        <View
          onLayout={onOptionsLayout}
          style={[styles.options, optionsContainerStyle]}
        >
          {options.map((opt, index) => (
            <PollOptionRow
              key={opt.id}
              allowMultiple={allowMultiple}
              animateProgress={animateProgress}
              checkmarkStyle={checkmarkStyle}
              computedTotal={computedTotal}
              index={index}
              onToggleMulti={togglePending}
              onVoteSingle={submitSingle}
              opt={opt}
              optionContentStyle={optionContentStyle}
              optionLabelStyle={optionLabelStyle}
              optionPressableStyle={optionPressableStyle}
              optionRowStyle={optionRowStyle}
              percentStyle={percentStyle}
              pendingIds={pendingIds}
              progressAnimationDuration={progressAnimationDuration}
              resultTrailingStyle={resultTrailingStyle}
              rowWidth={rowWidth}
              selected={selected}
              separatorStyle={separatorStyle}
              showResults={showResults}
              showSelectedCheckmark={showSelectedCheckmark}
              theme={theme}
              voteDisabled={voteDisabled}
            />
          ))}
        </View>

        {allowMultiple && !showResults && !voteDisabled ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              disabled: pendingIds.length === 0,
            }}
            disabled={pendingIds.length === 0}
            onPress={submitMultiple}
            style={({ pressed }) => [
              styles.voteButton,
              { borderTopColor: theme.separatorColor },
              voteButtonStyle,
              pendingIds.length === 0 && styles.voteButtonDisabled,
              pressed && pendingIds.length > 0 && styles.voteButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.voteButtonText,
                {
                  color:
                    pendingIds.length === 0
                      ? theme.metaTextColor
                      : theme.voteButtonTextColor,
                },
                voteButtonTextStyle,
              ]}
            >
              {strings.voteButton}
            </Text>
          </Pressable>
        ) : null}

        {showResults && computedTotal > 0 ? (
          <Text
            style={[styles.footer, { color: theme.metaTextColor }, footerStyle]}
          >
            {strings.formatVoteCount(computedTotal)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    overflow: 'hidden',
    maxWidth: 340,
    alignSelf: 'stretch',
  },
  question: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },
  options: {
    paddingBottom: 4,
  },
  voteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  voteButtonDisabled: {
    opacity: 0.6,
  },
  voteButtonPressed: {
    opacity: 0.75,
  },
  voteButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    fontSize: 13,
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 12,
  },
});

PollComponent.displayName = 'Poll';

export const Poll = memo(PollComponent);
