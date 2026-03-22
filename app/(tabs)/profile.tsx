import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { Colors, Spacing, Typography, CommonStyles } from "@/constants/theme";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={CommonStyles.screen} edges={["top"]}>
      <View style={CommonStyles.header}>
        <Text style={CommonStyles.headerTitle}>Cá nhân</Text>
      </View>

      {user ? <LoggedInView user={user} onLogout={logout} /> : <GuestView />}
    </SafeAreaView>
  );
}

// ─── Not logged in ───────────────────────────────────────────────────────────
function GuestView() {
  return (
    <View style={styles.guestWrap}>
      <Image style={styles.guestEmoji} source={require("@/assets/icon.png")} />
      <Text style={styles.guestTitle}>Chào mừng đến Aqua Atlas!</Text>
      <Text style={styles.guestSub}>
        Nơi nâng tầm thú vui thuỷ sinh của bạn lên tầm cao
      </Text>

      <Pressable
        style={styles.loginBtn}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.loginBtnText}>Đăng nhập</Text>
      </Pressable>

      <Pressable
        style={styles.registerBtn}
        onPress={() => router.push("/auth/register")}
      >
        <Text style={styles.registerBtnText}>Tạo tài khoản mới</Text>
      </Pressable>
    </View>
  );
}

// ─── Logged in ─────────────────────────────────────────────────────────────
function LoggedInView({
  user,
  onLogout,
}: {
  user: { email: string; displayName?: string };
  onLogout: () => void;
}) {
  const initials = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <View style={styles.loggedWrap}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <Text style={styles.displayName}>{user.displayName ?? "Người dùng"}</Text>
      <Text style={styles.email}>{user.email}</Text>

      {/* Info cards */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="fish-outline" size={18} color={Colors.accentGreen} />
          <Text style={styles.infoText}>Bookmark & bể cá đang lưu local</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cloud-outline" size={18} color={Colors.textMuted} />
          <Text style={[styles.infoText, { color: Colors.textMuted }]}>
            Sync cloud — sắp ra mắt
          </Text>
        </View>
      </View>

      {/* Logout */}
      <Pressable style={styles.logoutBtn} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={18} color={Colors.dangerRed} />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Guest
  guestWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  guestEmoji: { 
    width: 200,
    height: 200
   },
  guestTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  guestSub: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  loginBtn: {
    width: "100%",
    backgroundColor: Colors.deepForest,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: "center",
  },
  loginBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.white,
  },
  registerBtn: {
    width: "100%",
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.sageDark,
  },
  registerBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textSecond,
  },

  // Logged in
  loggedWrap: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    gap: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.midForest,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textOnDark,
  },
  displayName: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  email: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.base,
    color: Colors.textSecond,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dangerBg,
    paddingHorizontal: Spacing.xl,
  },
  logoutText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.dangerRed,
  },
});
