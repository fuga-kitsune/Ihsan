import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useReflectionStore } from '../store/useReflectionStore';
import { THEME } from '../../../core/constants/theme';

export const ReflectionSheet: React.FC = () => {
  const content = useReflectionStore((state) => state.content);
  const isSavedVisible = useReflectionStore((state) => state.isSavedVisible);
  const loadReflection = useReflectionStore((state) => state.loadReflection);
  const updateReflection = useReflectionStore((state) => state.updateReflection);

  useEffect(() => {
    loadReflection();
  }, []);

  const QUICK_PROMPTS = [
    'Grateful for...',
    'Du\'a for...',
    'Lesson from today...',
  ];

  const handleChipPress = (chip: string) => {
    const updated = content ? `${content}\n${chip} ` : `${chip} `;
    updateReflection(updated);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Muhasabah</Text>
        {isSavedVisible && <Text style={styles.savedBadge}>Saved</Text>}
      </View>

      <Text style={styles.description}>
        Take a silent moment before your rest to note a blessing or reflection.
      </Text>

      <View style={styles.chipRow}>
        {QUICK_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt}
            style={styles.chip}
            onPress={() => handleChipPress(prompt)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your reflection here..."
        placeholderTextColor={THEME.colors.textLight}
        value={content}
        onChangeText={updateReflection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 22,
    marginTop: 16,
    marginBottom: 48,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: THEME.colors.textHeading,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 18,
  },
  savedBadge: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: THEME.colors.bgCardSubtle,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
  },
  chipText: {
    color: THEME.colors.textBody,
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.md,
    padding: 16,
    color: THEME.colors.textHeading,
    fontSize: 14,
    minHeight: 90,
    lineHeight: 22,
    textAlignVertical: 'top',
    marginTop: 4,
  },
});
