import { router } from "expo-router";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Fish } from "@/types";
import { Colors, Spacing, Typography } from "@/constants/theme";

interface FishCardProps {
  fish: Fish;
}

export default function FishCard({ fish }: FishCardProps) {
  const difficultyColor = {
    easy: { bg: Colors.compatOkBg, text: Colors.compatOkText },
    medium: { bg: Colors.warnBg, text: Colors.warnAmber },
    hard: { bg: Colors.dangerBg, text: Colors.dangerText },
  }[fish.difficulty];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
      onPress={() => router.push(`/fish/${fish.id}`)}
    >
      {/* Fish Image */}
      <View style={styles.imgBox}>
        <Image
          source={{
            uri: fish.imageUrl ?? "https://i.pinimg.com/564x/04/62/f7/0462f73bfc9d24b27f6c9c800bd507af.jpg",
          }}
          style={styles.img}
          resizeMode="cover"
        />
      </View>
      {/* Fish Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {fish.name}
        </Text>
        <Text style={styles.sci} numberOfLines={1}>
          {fish.scientific}
        </Text>
        {/* Difficulty Badge */}
        <View style={[styles.badge, { backgroundColor: difficultyColor.bg }]}>
          <Text style={[styles.badgeText, { color: difficultyColor.text }]}>
            {fish.difficulty === "easy"
              ? "Dễ nuôi"
              : fish.difficulty === "medium"
                ? "Trung bình"
                : "Nâng Cao"}
          </Text>
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
});
