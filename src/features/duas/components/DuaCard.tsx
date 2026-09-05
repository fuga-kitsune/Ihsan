import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DuaItem } from '../models/dua.model';
import { useDuaStore } from '../store/useDuaStore';
import { THEME } from '../../../core/constants/theme';

interface DuaCardProps {
  dua: DuaItem;
}

export const DuaCard: React.FC<DuaCardProps> = ({ dua }) => {
  const toggleBookmark = useDuaStore((state) => state.toggleBookmark);
  const addDuaToHabits = useDuaStore((state) => state.addDuaToHabits);
  const [added, setAdded] = useState(false);

  const handleAddToRoutine = async () => {
    await addDuaToHabits(dua);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <View style={styles.card}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.tag}>{dua.category.toUpperCase()}</Text>
          <Text style={styles.title}>{dua.title}</Text>
        </View>

        <TouchableOpacity
          onPress={() => toggleBookmark(dua.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.bookmarkIcon, dua.isBookmarked && styles.bookmarkIconActive]}>
            {dua.isBookmarked ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Arabic Scripture */}
      <Text style={styles.arabic}>{dua.arabic}</Text>

      {/* Transliteration */}
      <Text style={styles.transliteration}>{dua.transliteration}</Text>

      {/* English Meaning */}
      <Text style={styles.meaning}>"{dua.meaning}"</Text>

      {/* Benefit & Source */}
      <View style={styles.metaBox}>
        <Text style={styles.benefitText}>💡 {dua.benefit}</Text>
        <Text style={styles.sourceText}>📖 {dua.source}</Text>
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={[styles.addBtn, added && styles.addBtnSuccess]}
        onPress={handleAddToRoutine}
        disabled={added}
        activeOpacity={0.7}
      >
        <Text style={[styles.addBtnText, added && styles.addBtnTextSuccess]}>
          {added ? '✓ Added to Daily Deeds!' : '+ Add to Daily Deeds'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 22,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    paddingRight: 12,
    gap: 4,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  bookmarkIcon: {
    fontSize: 22,
    color: THEME.colors.textLight,
  },
  bookmarkIconActive: {
    color: THEME.colors.accentGold,
  },
  arabic: {
    fontSize: 22,
    lineHeight: 38,
    color: THEME.colors.textHeading,
    textAlign: 'right',
    fontFamily: THEME.fonts.serif,
    marginVertical: 4,
  },
  transliteration: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  meaning: {
    fontSize: 14,
    color: THEME.colors.textBody,
    lineHeight: 22,
    fontFamily: THEME.fonts.serif,
  },
  metaBox: {
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.md,
    padding: 12,
    gap: 6,
  },
  benefitText: {
    fontSize: 12,
    color: THEME.colors.textBody,
    lineHeight: 17,
  },
  sourceText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  addBtn: {
    backgroundColor: THEME.colors.bgCardSubtle,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addBtnSuccess: {
    backgroundColor: THEME.colors.bgCardActive,
  },
  addBtnText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  addBtnTextSuccess: {
    color: THEME.colors.primary,
  },
});
