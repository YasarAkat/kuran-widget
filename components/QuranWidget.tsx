import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';

interface Ayet {
  arabic: string;
  meal: string;
  sure: string;
  ayet: string;
  kisa: string;
}

const TRANSLATION_ID = 77;

async function rastgeleAyetCek(): Promise<Ayet> {
  const verseUrl =
    `/api/quran/verses/random` +
    `?translations=${TRANSLATION_ID}` +
    `&fields=text_uthmani,chapter_id,verse_number` +
    `&language=tr`;

  const response = await fetch(verseUrl);
  if (!response.ok) throw new Error('API hatası: ' + response.status);
  const data = await response.json();
  const verse = data.verse;

  const sureRes = await fetch(
    `https://api.quran.com/api/v4/chapters/${verse.chapter_id}?language=tr`
  );
  const sureData = await sureRes.json();
  const sureNameAr = sureData.chapter?.name_arabic || '';
  const sureNameTr = sureData.chapter?.translated_name?.name || `Sure ${verse.chapter_id}`;

  const mealMetin =
    verse.translations?.[0]?.text
      ?.replace(/<[^>]+>/g, '')
      ?.replace(/\d+$/, '')
      ?.trim() || '';

  return {
    arabic: verse.text_uthmani || '',
    meal: mealMetin,
    sure: sureNameTr,
    ayet: String(verse.verse_number),
    kisa: `${verse.chapter_id}:${verse.verse_number} • ${sureNameAr}`,
  };
}

export const QuranWidget: React.FC<{ onPress?: () => void }> = ({ onPress }) => {
  const [ayet, setAyet] = useState<Ayet | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const fadeAnim = useState(new Animated.Value(1))[0];
  const { width } = Dimensions.get('window');
  const widgetWidth = width - 32;

  const ayetYukle = async (animasyon = false) => {
    if (animasyon) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
    setYukleniyor(true);
    setHata('');
    try {
      const yeni = await rastgeleAyetCek();
      setAyet(yeni);
    } catch {
      setHata('İnternet bağlantısını kontrol et');
    } finally {
      setYukleniyor(false);
      if (animasyon) {
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      } else {
        fadeAnim.setValue(1);
      }
    }
  };

  useEffect(() => { ayetYukle(); }, []);

  const GOLD = '#D4AF37';
  const GOLD_FAINT = 'rgba(212,175,55,0.2)';
  const GOLD_MID = 'rgba(212,175,55,0.45)';
  const CREAM = '#F5E6C8';
  const CREAM_MUTED = 'rgba(245,230,200,0.8)';
  const BG_DARKER = '#16213E';

  return (
    <View style={styles.pageContainer}>
      <TouchableOpacity
        onPress={onPress ?? (() => ayetYukle(true))}
        activeOpacity={0.92}
        style={[styles.container, { width: widgetWidth }]}
      >
        <View style={styles.topBar}>
          <Text style={[styles.appLabel, { color: GOLD }]}>✦  GÜNÜN AYETİ</Text>
          {ayet && (
            <View style={[styles.badge, { backgroundColor: GOLD_FAINT, borderColor: GOLD_MID }]}>
              <Text style={[styles.badgeText, { color: GOLD }]}>{ayet.kisa}</Text>
            </View>
          )}
        </View>

        {yukleniyor ? (
          <View style={styles.merkez}>
            <ActivityIndicator color={GOLD} size="small" />
            <Text style={[styles.yuklemeText, { color: GOLD_MID }]}>Ayet yükleniyor...</Text>
          </View>
        ) : hata ? (
          <View style={styles.merkez}>
            <Text style={[styles.hataText, { color: '#F09595' }]}>{hata}</Text>
            <Text style={[styles.yenidenText, { color: GOLD_MID }]}>Tekrar denemek için dokun</Text>
          </View>
        ) : ayet ? (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={[styles.arabicText, { color: CREAM }]}>{ayet.arabic}</Text>
            <View style={[styles.divider, { backgroundColor: GOLD_MID }]} />
            <Text style={[styles.mealText, { color: CREAM_MUTED }]}>{ayet.meal}</Text>
          </Animated.View>
        ) : null}

        {ayet && !yukleniyor && (
          <View style={styles.bottomBar}>
            <Text style={[styles.refText, { color: GOLD }]}>{ayet.sure} • {ayet.ayet}. Ayet</Text>
            <Text style={[styles.dokunText, { color: GOLD_MID }]}>↻ yeni ayet için dokun</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch',
  },
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#16213E',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.45)',
    overflow: 'visible',
    minHeight: 195,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  appLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    opacity: 0.85,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, fontWeight: '500' },
  arabicText: {
    fontFamily: 'System',
    fontSize: 22,
    textAlign: 'right',
    lineHeight: 42,
    writingDirection: 'rtl',
    marginBottom: 10,
  },
  divider: { height: 1, marginVertical: 8, opacity: 0.6 },
  mealText: {
    fontFamily: 'System',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  refText: { fontSize: 10, opacity: 0.7 },
  dokunText: { fontSize: 10 },
  merkez: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  yuklemeText: { fontSize: 12 },
  hataText: { fontSize: 13 },
  yenidenText: { fontSize: 11 },
});

export default QuranWidget;