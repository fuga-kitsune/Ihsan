import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDuaStore } from '../store/useDuaStore';
import { DuaCategory } from '../models/dua.model';
import { DuaCard } from '../components/DuaCard';
import { THEME } from '../../../core/constants/theme';

interface DuaLibraryScreenProps {
  onBack: () => void;
}

export const DuaLibraryScreen: React.FC<DuaLibraryScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const duas = useDuaStore((state) => state.duas);
  const activeCategory = useDuaStore((state) => state.activeCategory);
  const searchQuery = useDuaStore((state) => state.searchQuery);
  const loadDuas = useDuaStore((state) => state.loadDuas);
  const setActiveCategory = useDuaStore((state) => state.setActiveCategory);
  const setSearchQuery = useDuaStore((state) => state.setSearchQuery);

  useEffect(() => {
    loadDuas();
  }, []);

  const categories: { id: DuaCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'anxiety', label: 'Anxiety & Distress' },
    { id: 'forgiveness', label: 'Forgiveness' },
    { id: 'protection', label: 'Protection' },
    { id: 'gratitude', label: 'Gratitude & Guidance' },
    { id: 'adhkar', label: 'Daily Adhkar' },
  ];

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: Math.max(insets.bottom + 40, 60) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Du'a Library</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>
          Supplications & <Text style={styles.italicAccent}>Adhkar.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Authentic supplications from the Quran and Sunnah with translations and benefits.
        </Text>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by topic, emotion, or keyword (e.g. anxiety, sleep)..."
        placeholderTextColor={THEME.colors.textLight}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catScroll}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catPill, isActive && styles.catPillActive]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.catText, isActive && styles.catTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Dua Cards List */}
      <View style={styles.list}>
        {duas.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No supplications found matching your search.</Text>
          </View>
        ) : (
          duas.map((dua) => <DuaCard key={dua.id} dua={dua} />)
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.bgPill,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textHeading,
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontFamily: THEME.fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: THEME.colors.textHeading,
    fontWeight: '400',
    marginBottom: 8,
  },
  italicAccent: {
    fontFamily: THEME.fonts.serif,
    fontStyle: 'italic',
    color: THEME.colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textMuted,
    lineHeight: 20,
  },
  searchInput: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: THEME.colors.textHeading,
    marginBottom: 16,
  },
  catScroll: {
    gap: 8,
    paddingBottom: 20,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.bgPill,
  },
  catPillActive: {
    backgroundColor: THEME.colors.bgPillActive,
  },
  catText: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.colors.textMuted,
  },
  catTextActive: {
    color: THEME.colors.textInverse,
    fontWeight: '600',
  },
  list: {
    gap: 4,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: THEME.colors.textMuted,
  },
});
