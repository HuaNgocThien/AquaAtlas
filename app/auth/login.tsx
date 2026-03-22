import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { Colors, Spacing, Typography } from "@/constants/theme";

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    clearError();
    return () => clearError();
  }, []);
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    await login(email.trim(), password);
    if (!useAuthStore.getState().error) {
      router.replace("/(tabs)/profile");
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={Colors.textSecond} />
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Đăng nhập</Text>
            <Text style={styles.sub}>Chào mừng trở lại Aqua Atlas!</Text>
          </View>

          {/* Error */}
          {error && (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={Colors.dangerText}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                clearError();
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Tối thiểu 6 ký tự"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  clearError();
                }}
                secureTextEntry={!showPassword}
              />
              <Pressable
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.textMuted}
                />
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.submitBtn,
                (isLoading || !email.trim() || !password.trim()) &&
                  styles.btnDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.submitText}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Text>
            </Pressable>
          </View>

          {/* Register link */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Chưa có tài khoản? </Text>
            <Pressable onPress={() => router.replace("/auth/register")}>
              <Text style={styles.bottomLink}>Đăng ký ngay</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.sagePale,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenH,
    paddingBottom: Spacing.xxxl,
  },
  backBtn: {
    marginTop: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sub: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.dangerBg,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.dangerText,
    flex: 1,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.xl,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecond,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.sageLight,
    borderRadius: 10,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.sageLight,
    borderRadius: 10,
    marginBottom: Spacing.lg,
  },
  passwordInput: {
    flex: 1,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  eyeBtn: {
    padding: Spacing.md,
  },
  submitBtn: {
    backgroundColor: Colors.deepForest,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: Colors.sageDark,
  },
  submitText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.white,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  bottomText: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },
  bottomLink: {
    fontSize: Typography.base,
    color: Colors.accentGreen,
    fontWeight: Typography.semibold,
  },
});
