import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTankStore } from "@/store/useTankStore";
import { Colors, Spacing, Typography, CommonStyles } from "@/constants/theme";
import { Tank } from "@/types";

interface TankCardProps {
  tank: Tank;
  onDelete: () => void;
}

export default function TankCard({
  tank,
  onDelete,
}: {
  tank: Tank;
  onDelete: () => void;
}) {
  //Calculate setup days
  const setupDays = Math.floor(
    (Date.now() - new Date(tank.setupDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <View style={styles.tankCard}>
      <View style={styles.tankHeaderRow}>
        <Pressable
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}
          onPress={() => router.push(`/tank/${tank.id}`)}
        >
          <View style={styles.tankHeader}>
            <View>
              <Text style={styles.tankName}>{tank.name}</Text>
              <Text style={styles.tankAge}>
                {tank.volumeLiters}L · Setup{" "}
                {setupDays === 0 ? "Hôm Nay" : `${setupDays} ngày trước`}
              </Text>
            </View>
          </View>

          {/* Tank Visual */}
          <View style={styles.tankViz}>
            <View style={styles.waterBody}></View>
            <View style={styles.gravel}></View>
          </View>

          {/*Stats*/}
          <View style={styles.tankStats}>
            <View style={styles.tankStat}>
              <Text style={styles.tankStatVal}>{tank.fishIds.length}</Text>
              <Text style={styles.tankStatLbl}>Loại Cá</Text>
            </View>
            <View style={styles.tankStat}>
              <Text style={styles.tankStatVal}>{tank.plantIds.length}</Text>
              <Text style={styles.tankStatLbl}>Loại Cây</Text>
            </View>
            <View style={styles.tankStat}>
              <Text style={styles.tankStatVal}>{tank.reminders.length}</Text>
              <Text style={styles.tankStatLbl}>Nhắc Nhở</Text>
            </View>
          </View>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color={Colors.dangerRed} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tankCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  tankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  tankHeaderRow: {
    position: "relative",
  },
  tankName: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  tankAge: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    padding: Spacing.xs,
    zIndex: 1,
  },
  tankViz: {
    height: 80,
    backgroundColor: Colors.sageLight,
    position: "relative",
    overflow: "hidden",
  },
  waterBody: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "65%",
    backgroundColor: Colors.sageMid,
  },
  gravel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: Colors.sageDark,
  },
  tankStats: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: Colors.sageLight,
  },
  tankStat: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRightWidth: 0.5,
    borderRightColor: Colors.sageLight,
  },
  tankStatVal: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  tankStatLbl: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
