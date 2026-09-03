import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WisdomUIModel } from '../models/wisdom.model';
import { wisdomRepository } from '../repositories/wisdom.repository';
import { THEME } from '../../../core/constants/theme';

export const WisdomCard: React.FC = () => {
  const [wisdom, setWisdom] = useState<WisdomUIModel | null>(null);

  useEffect(() => {
    wisdomRepository.getTodayWisdom().then(setWisdom);
  }, []);

  if (!wisdom) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.tag}>DAILY REFLECTION</Text>
        <Text style={styles.source}>{wisdom.source}</Text>
      </View>
      
      <Text style={styles.arabic}>{wisdom.arabic}</Text>
      <Text style={styles.meaning}>"{wisdom.meaning}"</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 22,
    marginBottom: 24,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    color: THEME.colors.accentGold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  source: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '400',
  },
  arabic: {
    color: THEME.colors.textHeading,
    fontSize: 22,
    textAlign: 'right',
    lineHeight: 36,
    fontWeight: '400',
    fontFamily: THEME.fonts.serif,
    marginVertical: 4,
  },
  meaning: {
    color: THEME.colors.textBody,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: THEME.fonts.serif,
    fontStyle: 'italic',
  },
});
