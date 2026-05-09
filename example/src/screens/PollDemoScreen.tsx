import { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';

import {
  DemoPollRow,
  type PollDemoSessionState,
} from '../components/DemoPollRow';
import type { PollVoteTally } from '../data/polls';
import { initialPolls, mergePollsWithVoteTally } from '../data/polls';

const MIN_WIDTH = 280;
const MAX_WIDTH = 400;
const PADDING = 32;

export type { PollDemoSessionState };

export function PollDemoScreen() {
  const { width } = useWindowDimensions();
  const [pollStateById, setPollStateById] = useState<
    Record<string, PollDemoSessionState>
  >({});
  const [voteTally, setVoteTally] = useState<PollVoteTally>({});

  const containerWidth = useMemo(
    () => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width - PADDING)),
    [width]
  );

  const horizontalPadding = useMemo(
    () => Math.max(16, (width - containerWidth) / 2),
    [width, containerWidth]
  );

  const pollsForUi = useMemo(
    () => mergePollsWithVoteTally(initialPolls, voteTally),
    [voteTally]
  );

  const handleCommitVote = useCallback(
    (pollId: string, optionIds: string[]) => {
      setPollStateById((prev) => ({
        ...prev,
        [pollId]: { voted: true, picked: optionIds },
      }));
      setVoteTally((prev) => {
        const next: PollVoteTally = { ...prev };
        const row = { ...(next[pollId] ?? {}) };
        for (const optId of optionIds) {
          row[optId] = (row[optId] ?? 0) + 1;
        }
        next[pollId] = row;
        return next;
      });
    },
    []
  );

  return (
    <ScrollView
      removeClippedSubviews
      style={[styles.screen, styles.chatBackdrop]}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: horizontalPadding },
      ]}
    >
      <Text style={styles.title}>react-native-poll-kit</Text>
      <Text style={styles.subtitle}>
        WhatsApp-inspired polls — vote, then see bars and percentages.
      </Text>

      {pollsForUi.map((p, index) => (
        <DemoPollRow
          key={p.id}
          containerWidth={containerWidth}
          index={index}
          onCommitVote={handleCommitVote}
          poll={p}
          pollState={pollStateById[p.id]}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  chatBackdrop: {
    backgroundColor: '#ECE5DD',
  },
  content: {
    paddingVertical: 24,
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111B21',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#54656F',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
});
