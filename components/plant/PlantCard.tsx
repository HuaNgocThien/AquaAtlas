import { router } from "expo-router";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Plant } from "@/types";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const lightColor = {
    low: { bg: Colors.compatOkBg, text: Colors.compatOkText },
    medium: { bg: Colors.warnBg, text: Colors.warnAmber },
    high: { bg: Colors.dangerBg, text: Colors.dangerText },
  }[plant.light];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
      onPress={() => router.push(`/plant/${plant.id}`)}
    >
      {/* Plant Image */}
      <View style={styles.imgBox}>
        <Image
          source={{
            uri:
              plant.imageUrl ??
              "https://i.pinimg.com/564x/04/62/f7/0462f73bfc9d24b27f6c9c800bd507af.jpg",
          }}
          style={styles.img}
          resizeMode="cover"
        />
      </View>
      {/* Plant Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {plant.name}
        </Text>
        <Text style={styles.sci} numberOfLines={1}>
          {plant.scientific}
        </Text>
        {/* Light Badge */}
        <View style={styles.plantBadge}>
          <View style={[styles.badge, { backgroundColor: lightColor.bg }]}>
            <Text style={[styles.badgeText, { color: lightColor.text }]}>
              {plant.light === "low"
                ? "Sáng thấp"
                : plant.light === "medium"
                  ? "Sáng trung"
                  : "Sáng cao"}
            </Text>
          </View>
          {!!plant.requiresCO2 && (
            <View style={[styles.badge, { backgroundColor: Colors.sageLight }]}>
              <Text style={[styles.badgeText, { color: Colors.textSecond }]}>
                CO₂
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
    overflow: "hidden",
    marginRight: Spacing.sm,
  },
  imgBox: {
    height: 80,
    backgroundColor: Colors.sageLight,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  info: {
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  sci: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    fontStyle: "italic",
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  badgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
  plantBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
});
