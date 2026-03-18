import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useWikiStore } from "@/store/useWikiStore";
import { useDebounce } from "@/hooks/useDebounce";
import { Colors, Spacing, Typography, CommonStyles } from "@/constants/theme";
import { Fish, Plant } from "@/types";
import SwipeableRow from "@/components/ui/SwipeableRow";

type FilterType = "all" | "fish" | "plant";
type SearchResult =
  | { type: "fish"; data: Fish }
  | { type: "plant"; data: Plant };

export default function BookmarkScreen() {
  const {
    fish,
    plants,
    bookmarkedFishIDs,
    bookmarkedPlantIDs,
    toggleFishBookmark,
    togglePlantBookmark,
  } = useWikiStore();
  const bookmarkedFish = fish.filter((f) => bookmarkedFishIDs.includes(f.id));
  const bookmarkedPlants = plants.filter((p) =>
    bookmarkedPlantIDs.includes(p.id),
  );
  const [filter, setFilter] = useState<FilterType>("all");

  const data: SearchResult[] = [
    ...(filter != "plant"
      ? bookmarkedFish.map((f) => ({ type: "fish" as const, data: f }))
      : []),
    ...(filter != "fish"
      ? bookmarkedPlants.map((p) => ({ type: "plant" as const, data: p }))
      : []),
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View style={CommonStyles.header}>
        <Text style={CommonStyles.headerTitle}>Bookmark</Text>
      </View>
      {/*Filter chips */}
      <View style={styles.filterRow}>
        {(["all", "fish", "plant"] as FilterType[]).map((f) => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === "all" ? "Tất Cả" : f === "fish" ? "🐠 Cá" : "🌿 Cây"}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => `${item.type}-${item.data.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Không có bookmark</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SwipeableRow
            onDelete={() => {
              item.type === "fish"
                ? toggleFishBookmark(item.data.id)
                : togglePlantBookmark(item.data.id);
            }}
          >
            <Pressable
              style={({ pressed }) => [
                [styles.resultRow, pressed && { opacity: 0.7 }],
              ]}
              onPress={() =>
                router.push(
                  item.type === "fish"
                    ? `/fish/${item.data.id}`
                    : `/plant/${item.data.id}`,
                )
              }
            >
              <View
                style={[
                  styles.typeTag,
                  {
                    backgroundColor:
                      item.type === "fish" ? Colors.sageMid : Colors.sageLight,
                  },
                ]}
              >
                <Text style={styles.typeTagText}>
                  {item.type === "fish" ? "🐠" : "🌿"}
                </Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{item.data.name}</Text>
                <Text style={styles.resultSci}>{item.data.scientific}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.sageDark}
              />
            </Pressable>
          </SwipeableRow>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.sageDark,
    backgroundColor: Colors.white,
  },
  filterChipActive: {
    backgroundColor: Colors.deepForest,
    borderColor: Colors.deepForest,
  },
  filterText: {
    fontSize: Typography.base,
    color: Colors.textSecond,
    fontWeight: Typography.medium,
  },
  filterTextActive: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxxl,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  typeTag: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  typeTagText: {
    fontSize: 20,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  resultSci: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    fontStyle: "italic",
    marginTop: 2,
  },
  empty: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    textAlign: "center",
  },
});
