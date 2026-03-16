import { Colors, CommonStyles, Spacing, Typography } from "@/constants/theme";
import { useWikiStore } from "@/store/useWikiStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getFishByID, isFishBookmarked, toggleFishBookmark } = useWikiStore();

  const fish = getFishByID(id);

  if (!fish) {
    return (
      <SafeAreaView style={CommonStyles.screen} edges={["top"]}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Fish not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const bookmarked = isFishBookmarked(id);

  return (
    <SafeAreaView style={CommonStyles.screen} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroBox}>
          <Image
            source={{
              uri:
                fish.imageUrl ??
                "https://i.pinimg.com/564x/04/62/f7/0462f73bfc9d24b27f6c9c800bd507af.jpg",
            }}
            style={styles.heroImg}
            resizeMode="cover"
          />
          {/* Back Button */}
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color={Colors.white} />
          </Pressable>
          {/* Bookmark Button */}
          <Pressable
            style={styles.bookmarkBtn}
            onPress={() => toggleFishBookmark(fish.id)}
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={30}
              color={Colors.yellow}
            />
          </Pressable>
        </View>
        {/* Fish Info */}
        <View style={styles.infoSection}>
          <Text style={styles.fishName}>{fish.name}</Text>
          <Text style={styles.fishSci}>{fish.scientific}</Text>
          {/* Tags */}
          <View style={styles.tagsRow}>
            {fish.tags.map((tag) => (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Params Row */}
        <View style={styles.paramsRow}>
          <View style={styles.paramChip}>
            <Text style={styles.paramValue}>
              {fish.params.phMin} - {fish.params.phMax}
            </Text>
            <Text style={styles.paramLabel}>pH</Text>
          </View>
          <View style={styles.paramChip}>
            <Text style={styles.paramValue}>
              {fish.params.tempMin} - {fish.params.tempMax}°C
            </Text>
            <Text style={styles.paramLabel}>Nhiệt Độ</Text>
          </View>
          <View style={styles.paramChip}>
            <Text style={styles.paramValue}>{fish.minTankLiters}L</Text>
            <Text style={styles.paramLabel}>Thể Tích Hồ</Text>
          </View>
          <View style={styles.paramChip}>
            <Text style={styles.paramValue}>{fish.maxSizeCm}cm</Text>
            <Text style={styles.paramLabel}>Kích thước</Text>
          </View>
        </View>
        {/* Description  */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô Tả</Text>
          <Text style={styles.description}>{fish.description}</Text>
        </View>
        {/* Care Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chăm sóc</Text>
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Thức ăn</Text>
              <Text style={styles.infoVal}>{fish.diet.join(", ")}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Tuổi thọ</Text>
              <Text style={styles.infoVal}>
                {fish.lifespanYears[0]}-{fish.lifespanYears[1]} năm
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Tính cách</Text>
              <Text style={styles.infoVal}>
                {fish.behavior === "peaceful"
                  ? "Hiền lành"
                  : fish.behavior === "aggressive"
                    ? "Bán hung hăng"
                    : "Hung hăng"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Nuôi chung</Text>
              <Text style={styles.infoVal}>
                {fish.grouping === "solo"
                  ? "Đơn độc"
                  : fish.grouping === "pairs"
                    ? "Theo cặp"
                    : fish.grouping === "school"
                      ? `Đàn tối thiểu ${fish.minSchoolSize} con`
                      : "Nhóm nhỏ"}
              </Text>
            </View>
          </View>
        </View>
        {/* Compatibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hợp sống chung</Text>
          <View style={styles.compatRow}>
            {fish.compatibleWith.map((fishId) => {
              const compatFish = getFishByID(fishId);
              return (
                <View key={fishId} style={styles.compatOk}>
                  <Text style={styles.compatOkText}>
                    ✓ {compatFish?.name ?? fishId}{" "}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.compatRow}>
            {fish.incompatibleWith.map((fishId) => {
              const incompatFish = getFishByID(fishId);
              return (
                <View key={fishId} style={styles.compatNo}>
                  <Text style={styles.compatNoText}>
                    ✗ {incompatFish?.name ?? fishId}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroBox: {
    height: 240,
    backgroundColor: Colors.midForest,
    position: "relative",
  },
  heroImg: {
    width: "100%",
    height: "100%",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: Typography.lg, color: Colors.textMuted },
  backBtn: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkBtn: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  fishName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  fishSci: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    fontStyle: "italic",
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: Colors.sageMid,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: Typography.sm,
    color: Colors.successGreen,
    fontWeight: Typography.medium,
  },
  paramsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  paramChip: {
    flex: 1,
    backgroundColor: Colors.sageLight,
    borderRadius: 10,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  paramValue: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  paramLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: Typography.base,
    color: Colors.textSecond,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.accentGreen,
  },
  infoTable: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.accentGreen,
    overflow: "hidden",
  },
  infoKey: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },
  infoVal: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: "right",
  },
  compatRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  compatOk: {
    backgroundColor: Colors.compatOkBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  compatOkText: {
    fontSize: Typography.md,
    color: Colors.compatOkText,
    fontWeight: Typography.medium,
  },
  compatNo: {
    backgroundColor: Colors.compatNoBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 4,
  },
  compatNoText: {
    fontSize: Typography.md,
    color: Colors.compatNoText,
    fontWeight: Typography.medium,
  },
});
