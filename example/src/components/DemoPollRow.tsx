import { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Poll, whatsappChatTheme } from 'react-native-poll-kit';

import type { DemoPoll } from '../data/polls';

export type PollDemoSessionState = {
  voted: boolean;
  picked: string[];
};

export type DemoPollRowProps = {
  index: number;
  poll: DemoPoll;
  pollState: PollDemoSessionState | undefined;
  containerWidth: number;
  onCommitVote: (pollId: string, optionIds: string[]) => void;
};

export const DemoPollRow = memo(function DemoPollRow({
  index,
  poll,
  pollState,
  containerWidth,
  onCommitVote,
}: DemoPollRowProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay: index * 90,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 380,
        delay: index * 90,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => {
      anim.stop();
      opacity.stopAnimation();
      translateY.stopAnimation();
    };
    // Intentionally once per mount; `index` is fixed for this list item key.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- entrance runs once
  }, []);

  const handleVote = useCallback(
    (ids: string[]) => {
      onCommitVote(poll.id, ids);
    },
    [onCommitVote, poll.id]
  );

  return (
    <Animated.View
      style={[styles.block, { opacity, transform: [{ translateY }] }]}
    >
      <Poll
        allowMultiple={poll.allowMultiple}
        allowRevote={false}
        mainContainerStyle={[styles.pollMain, { width: containerWidth }]}
        onVote={handleVote}
        options={poll.options}
        question={poll.question}
        selectedOptionIds={pollState?.picked ?? []}
        showResults={pollState?.voted ?? false}
        style={styles.pollCard}
        theme={whatsappChatTheme}
        testID={`poll-${poll.id}`}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  pollMain: {
    alignSelf: 'center',
  },
  pollCard: {
    maxWidth: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 8,
  },
  block: {
    alignItems: 'stretch',
    paddingHorizontal: 8,
  },
});
