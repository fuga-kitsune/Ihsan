import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../../core/constants/theme';

export const SleepSunnahRemembranceCard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.titleCol}>
          <Text style={styles.tag}>SUNNAH BEFORE SLEEP</Text>
          <Text style={styles.title}>Sayyid al-Istighfar (Chief of Prayers for Forgiveness)</Text>
        </View>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.contentCol}>
          <View style={styles.arabicBox}>
            <Text style={styles.arabicText}>
              اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ
            </Text>
          </View>

          <Text style={styles.translationText}>
            "O Allah, You are my Lord, none has the right to be worshipped but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessing upon me, and I acknowledge my sin, so forgive me, for none forgives sins but You."
          </Text>

          <Text style={styles.hadithNote}>
            "Whoever says this with conviction in the evening and dies that night will enter Paradise." — (Sahih al-Bukhari 6306)
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FCF9',
    borderRadius: THEME.radius.lg,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D7EFE2',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCol: {
    flex: 1,
    gap: 2,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
    letterSpacing: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#14532D',
  },
  expandIcon: {
    fontSize: 12,
    color: '#166534',
    marginLeft: 8,
  },
  contentCol: {
    marginTop: 14,
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2F0E9',
  },
  arabicBox: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#D7EFE2',
  },
  arabicText: {
    fontSize: 17,
    color: '#14532D',
    textAlign: 'right',
    lineHeight: 28,
    fontFamily: THEME.fonts.serif,
  },
  translationText: {
    fontSize: 12,
    color: '#1E3A2F',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  hadithNote: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
});
