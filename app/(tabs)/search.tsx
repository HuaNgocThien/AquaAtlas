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

type FilterType = "all" | "fish" | "plant";
type SearchResult =
  | { type: "fish"; data: Fish }
  | { type: "plant"; data: Plant };
export default function SearchScreen() {
  const { fish, plants } = useWikiStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const debounceQuery = useDebounce(query, 300);

  //Filter + search logic
  const results: SearchResult[] = [];

  if (filter === "all" || filter === "fish") {
    fish
      .filter(
        (f) =>
          f.name.toLowerCase().includes(debounceQuery.toLowerCase()) ||
          f.scientific.toLowerCase().includes(debounceQuery.toLowerCase()) ||
          f.tags.some((t) =>
            t.toLowerCase().includes(debounceQuery.toLowerCase()),
          ),
      )
      .forEach((f) => results.push({ type: "fish", data: f }));
  }

  if (filter === "all" || filter === "plant") {
    plants
      .filter(
        (p) =>
          p.name.toLowerCase().includes(debounceQuery.toLowerCase()) ||
          p.scientific.toLowerCase().includes(debounceQuery.toLowerCase()) ||
          p.tags.some((t) =>
            t.toLowerCase().includes(debounceQuery.toLowerCase()),
          ),
      )
      .forEach((p) => results.push({ type: "plant", data: p }));
  }
  return (
    <SafeAreaView style={CommonStyles.screen} edges={["top"]}>
      {/* Header */}
      <View style={CommonStyles.header}>
        <Text style={CommonStyles.headerTitle}>Tìm Kiếm</Text>
      </View>

      {/*Search Bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={24} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm cá, cây, thông số...."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.textMuted}
              />
            </Pressable>
          )}
        </View>
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
      {/*Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => `${item.type}-${item.data.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {debounceQuery
                ? "Không tìm thấy kết quả!"
                : "Gõ tên cá hoặc cây để tìm kiếm"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
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
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.deepForest,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.sageLight,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
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
