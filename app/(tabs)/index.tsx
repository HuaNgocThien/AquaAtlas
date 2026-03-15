import { Colors, CommonStyles, Spacing, Typography } from "@/constants/theme";
import { useWikiStore } from "@/store/useWikiStore";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { use, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import FishCard from "@/components/fish/FishCard";

export default function ExploreScreen() {
  const { fish, plants } = useWikiStore();

  const heroFish = useMemo(() => {
    const index = Math.floor(Math.random() * fish.length);
    return fish[index];
  }, [fish]);

  return (
    <SafeAreaView style={CommonStyles.screen} edges={["top"]}>
      {/* Header */}
      <View style={CommonStyles.header}>
        <View>
          <Text style={CommonStyles.headerSub}>Xin chào, Genji</Text>
          <Text style={CommonStyles.headerTitle}>AquaAtlas</Text>
        </View>
        <View style={styles.searchIcon}>
          <Ionicons name="search" size={24} color={Colors.textOnDarkMuted} />
        </View>
      </View>
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroEyebrow}>Gợi ý hôm nay !!!</Text>
          <Text style={styles.heroName}>{heroFish?.name}</Text>
          <Text style={styles.heroSci}>{heroFish?.scientific}</Text>
          <View style={styles.heroTagRow}>
            {heroFish?.tags.slice(0, 2).map((tag) => (
              <View style={styles.heroTag} key={tag}>
                <Text style={styles.heroTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Temp Fish Placeholder */}
        <View style={styles.heroImgBox}>
          {/* <Image
            style={styles.heroImg}
            source={{
              uri: "https://bizweb.dktcdn.net/100/344/954/files/ca-chuot-panda-1.jpg?v=1681273103458",
            }}
          /> */}
          <Text style={{ fontSize: 40 }}>🐠</Text>
        </View>
      </View>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statValue}>{fish.length}</Text>
          <Text style={styles.statLabel}>Loài cá</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statValue}>{plants.length}</Text>
          <Text style={styles.statLabel}>Loài cây</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statValue}>Mới</Text>
          <Text style={styles.statLabel}>Cập nhật</Text>
        </View>
      </View>
      {/* Highlighted Section */}
      <Text style={styles.sectionTitle}>Cá Nổi Bật</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}
        style={{ marginBottom: Spacing.sm }}
      >
        {fish.map((f) => (
          <FishCard key={f.id} fish={f} />
        ))}
      </ScrollView>
      {/* Content */}
      {/* <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: Colors.textMuted }}>
          Chúng tôi đang có {fish.length} loài cá và {plants.length} loài cây
        </Text>
      </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  searchIcon: {
    backgroundColor: Colors.sagePale,
    padding: Spacing.sm,
    borderRadius: 99,
  },
  heroCard: {
    backgroundColor: Colors.midForest,
    borderRadius: 16,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    margin: Spacing.sm,
  },
  heroLeft: { flex: 1 },
  heroEyebrow: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  heroName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textOnDark,
  },
  heroSci: {
    fontSize: Typography.base,
    color: Colors.textOnDarkMuted,
    fontStyle: "italic",
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  heroTagRow: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  heroTag: {
    backgroundColor: Colors.accentGreen,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  heroTagText: {
    fontSize: Typography.base,
    color: Colors.textOnDark,
    fontWeight: Typography.medium,
  },
  heroImgBox: {
    width: 72,
    height: 72,
    backgroundColor: Colors.deepForest,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.md,
  },
  heroImg: {
    width: 64,
    height: 64,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    margin: Spacing.sm,
  },
  statChip: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecond,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.lg,
  },
  hScroll: {
    alignItems: "flex-start",
    paddingRight: Spacing.screenH,
    paddingLeft: Spacing.sm,
  },
});
