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
import TankCard from "@/components/tank/TankCard";

export default function MyTankScreen() {
  const { tanks, addTank, deleteTank } = useTankStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [tankName, setTankName] = useState("");
  const [tankVolume, setTankVolume] = useState("");

  const handleAddTank = () => {
    if (!tankName.trim() || !tankVolume.trim()) return;
    addTank(tankName.trim(), Number(tankVolume));
    setTankName("");
    setTankVolume("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={CommonStyles.screen} edges={["top"]}>
      {/* Header */}
      <View style={CommonStyles.header}>
        <Text style={CommonStyles.headerTitle}>Hồ Của Tôi</Text>
        <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color={Colors.textOnDarkMuted} />
        </Pressable>
      </View>

      {/* Tank List */}
      <FlatList
        data={tanks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="water" size={48} color={Colors.textOnDarkMuted} />
            <Text style={styles.emptyTitle}>Bạn chưa có hồ nào</Text>
            <Text style={styles.emptySub}>
              Bấm + để thêm hồ đầu tiên của bạn
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TankCard tank={item} onDelete={() => deleteTank(item.id)} />
        )}
      />
      {/* Add Tank Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Thêm hồ mới</Text>

            <Text style={styles.inputLabel}>Tên Hồ</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Hồ Iwagumi 60cm"
              placeholderTextColor={Colors.textMuted}
              value={tankName}
              onChangeText={setTankName}
            />

            <Text style={styles.inputLabel}>Thể tích</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: 60"
              placeholderTextColor={Colors.textMuted}
              value={tankVolume}
              onChangeText={setTankVolume}
              keyboardType="numeric"
            />

            <View style={styles.modalBtns}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Huỷ</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmBtn,
                  (!tankName.trim() || !tankVolume.trim()) &&
                    styles.confirmBtnDisabled,
                ]}
                onPress={handleAddTank}
              >
                <Text style={styles.confirmText}>Thêm</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.sagePale,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: Spacing.screenH,
    paddingBottom: Spacing.xxxl,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySub: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  inputLabel: {
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
  modalBtns: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.sageDark,
    alignItems: "center",
  },
  cancelText: {
    fontSize: Typography.base,
    color: Colors.textSecond,
    fontWeight: Typography.medium,
  },
  confirmBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 10,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.sageDark,
  },
  confirmText: {
    fontSize: Typography.base,
    color: Colors.white,
    fontWeight: Typography.medium,
  },
});
