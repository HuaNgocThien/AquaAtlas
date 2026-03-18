import { useRef } from "react";
import { Animated, View, Text, StyleSheet, Pressable } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Colors, Spacing, Typography } from "@/constants/theme";

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
}

export default function SwipeableRow({
  children,
  onDelete,
}: SwipeableRowProps) {
  const swipeableRef =
    useRef<React.ComponentRef<typeof ReanimatedSwipeable>>(null);

  const renderRightActions = () => (
    <Pressable
      style={styles.deleteBtn}
      onPress={() => {
        swipeableRef.current?.close();
        onDelete();
      }}
    >
      <Text style={styles.deleteText}>Xoá</Text>
    </Pressable>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      {children}
    </ReanimatedSwipeable>
  );
}
const styles = StyleSheet.create({
  deleteBtn: {
    backgroundColor: Colors.dangerRed,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  deleteText: {
    color: Colors.white,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
});
