import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTankStore } from "@/store/useTankStore";
import { Colors, Spacing, Typography, CommonStyles } from "@/constants/theme";
import { Reminder, ReminderType, ReminderFrequency } from "@/types";

function ParamBadge({
  label,
  value,
  min,
  max,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
}) {
  const isOk = value >= min && value <= max;
  const isWarn = !isOk && value >= min * 0.9 && value <= max * 1.1;

  const bg = isOk
    ? Colors.compatOkBg
    : isWarn
      ? Colors.warnBg
      : Colors.dangerBg;
  const text = isOk
    ? Colors.compatOkText
    : isWarn
      ? Colors.warnAmber
      : Colors.dangerText;

  return (
    <View style={[styles.paramBadge, { backgroundColor: bg }]}>
      <Text style={[styles.paramBadgeVal, { color: text }]}>{value}</Text>
      <Text style={[styles.paramBadgeLbl, { color: text }]}>{label}</Text>
    </View>
  );
}
export default function TankDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getTankById,
    addReminder,
    markReminderDone,
    deleteReminder,
    addReading,
    deleteReading,
  } = useTankStore();
  const tank = getTankById(id);

  const [modalVisible, setModalVisible] = useState(false);
  const [reminderLabel, setReminderLabel] = useState("");
  const [reminderType, setReminderType] =
    useState<ReminderType>("water-change");
  const [reminderFreq, setReminderFreq] = useState<ReminderFrequency>("weekly");
  const [readingModal, setReadingModal] = useState(false);
  const [ph, setPh] = useState("");
  const [temperature, setTemperature] = useState("");
  const [gh, setGh] = useState("");
  const [no3, setNo3] = useState("");

  if (!tank) {
    return (
      <SafeAreaView style={CommonStyles.screen} edges={["top"]}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Không tìm thấy bể 🪸</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddReminder = () => {
    if (!reminderLabel.trim()) return;
    addReminder(tank.id, {
      type: reminderType,
      label: reminderLabel.trim(),
      frequency: reminderFreq,
      enabled: true,
    });
    setReminderLabel("");
    setModalVisible(false);
  };

  const handleAddReading = () => {
    if (!ph && !temperature && !gh && !no3) return;

    addReading(tank.id, {
      ph: ph ? Number(ph) : undefined,
      temperature: temperature ? Number(temperature) : undefined,
      gh: gh ? Number(gh) : undefined,
      no3: no3 ? Number(no3) : undefined,
    });
    setPh("");
    setTemperature("");
    setGh("");
    setNo3("");
    setReadingModal(false);
  };
  function formatDueLabel(nextDue: string): { label: string; color: string } {
    const now = new Date();
    const due = new Date(nextDue);
    const diffDays = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0)
      return {
        label: `Trễ ${Math.abs(diffDays)} ngày`,
        color: Colors.dangerRed,
      };
    if (diffDays === 0) return { label: "Hôm nay", color: Colors.warnAmber };
    if (diffDays === 1) return { label: "Ngày mai", color: Colors.accentGreen };
    return { label: `${diffDays} ngày nữa`, color: Colors.textMuted };
  }

  function reminderTypeLabel(type: ReminderType): string {
    const map: Record<ReminderType, string> = {
      "water-change": "💧 Thay nước",
      fertilize: "🌱 Bón phân",
      "params-check": "🔬 Kiểm tra thông số",
      "filter-clean": "🔧 Vệ sinh lọc",
      custom: "📝 Tuỳ chỉnh",
    };
    return map[type];
  }

  function frequencyLabel(freq: ReminderFrequency): string {
    const map: Record<ReminderFrequency, string> = {
      daily: "Hàng ngày",
      "every-3-days": "Mỗi 3 ngày",
      weekly: "Hàng tuần",
      biweekly: "Mỗi 2 tuần",
      monthly: "Hàng tháng",
    };
    return map[freq];
  }
  return (
    <SafeAreaView style={CommonStyles.screen} edges={["top"]}>
      {/* Header */}
      <View style={CommonStyles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.textOnDark} />
        </Pressable>
        <Text style={CommonStyles.headerTitle}>{tank.name}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tank info */}
        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <Text style={styles.infoVal}>{tank.volumeLiters}L</Text>
            <Text style={styles.infoLbl}>Thể tích</Text>
          </View>
          <View style={styles.infoChip}>
            <Text style={styles.infoVal}>{tank.fishIds.length}</Text>
            <Text style={styles.infoLbl}>Loài cá</Text>
          </View>
          <View style={styles.infoChip}>
            <Text style={styles.infoVal}>{tank.plantIds.length}</Text>
            <Text style={styles.infoLbl}>Loài cây</Text>
          </View>
        </View>

        {/* Reminders section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nhắc nhở</Text>
            <Pressable
              style={styles.addReminderBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={18} color={Colors.white} />
              <Text style={styles.addReminderText}>Thêm</Text>
            </Pressable>
          </View>

          {tank.reminders.length === 0 ? (
            <View style={styles.emptyReminder}>
              <Text style={styles.emptyReminderText}>Chưa có nhắc nhở nào</Text>
            </View>
          ) : (
            tank.reminders.map((reminder) => {
              const { label: dueLabel, color: dueColor } = formatDueLabel(
                reminder.nextDue,
              );
              return (
                <View key={reminder.id} style={styles.reminderCard}>
                  <View style={styles.reminderLeft}>
                    <Text style={styles.reminderType}>
                      {reminderTypeLabel(reminder.type)}
                    </Text>
                    <Text style={styles.reminderLabel}>{reminder.label}</Text>
                    <Text style={styles.reminderFreq}>
                      {frequencyLabel(reminder.frequency)}
                    </Text>
                  </View>
                  <View style={styles.reminderRight}>
                    <Text style={[styles.dueLabel, { color: dueColor }]}>
                      {dueLabel}
                    </Text>
                    <Pressable
                      style={styles.doneBtn}
                      onPress={() => markReminderDone(tank.id, reminder.id)}
                    >
                      <Text style={styles.doneBtnText}>Xong</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteReminder(tank.id, reminder.id)}
                      style={{ marginTop: Spacing.xs }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={Colors.dangerRed}
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </View>
        {/* Water Params Section */}
        <View style={[styles.section, { marginTop: Spacing.lg }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông số nước</Text>
            <Pressable
              style={styles.addReminderBtn}
              onPress={() => setReadingModal(true)}
            >
              <Ionicons name="add" size={18} color={Colors.white} />
              <Text style={styles.addReminderText}>Ghi</Text>
            </Pressable>
          </View>

          {tank.readings.length === 0 ? (
            <View style={styles.emptyReminder}>
              <Text style={styles.emptyReminderText}>
                Chưa có dữ liệu thông số
              </Text>
            </View>
          ) : (
            tank.readings.slice(0, 5).map((reading) => (
              <View key={reading.id} style={styles.readingCard}>
                <View style={styles.readingHeader}>
                  <Text style={styles.readingDate}>
                    {new Date(reading.date).toLocaleDateString("vi-VN")}
                  </Text>
                  <Pressable onPress={() => deleteReading(tank.id, reading.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={Colors.dangerRed}
                    />
                  </Pressable>
                </View>
                <View style={styles.readingParams}>
                  {reading.ph !== undefined && (
                    <ParamBadge label="pH" value={reading.ph} min={6} max={8} />
                  )}
                  {reading.temperature !== undefined && (
                    <ParamBadge
                      label="°C"
                      value={reading.temperature}
                      min={22}
                      max={30}
                    />
                  )}
                  {reading.gh !== undefined && (
                    <ParamBadge
                      label="GH"
                      value={reading.gh}
                      min={4}
                      max={16}
                    />
                  )}
                  {reading.no3 !== undefined && (
                    <ParamBadge
                      label="NO₃"
                      value={reading.no3}
                      min={0}
                      max={20}
                    />
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Reminder Modal */}
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
            <Text style={styles.modalTitle}>Thêm nhắc nhở</Text>

            {/* Reminder Type */}
            <Text style={styles.inputLabel}>Loại</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typeScroll}
            >
              {(
                [
                  "water-change",
                  "fertilize",
                  "params-check",
                  "filter-clean",
                  "custom",
                ] as ReminderType[]
              ).map((t) => (
                <Pressable
                  key={t}
                  style={[
                    styles.typeChip,
                    reminderType === t && styles.typeChipActive,
                  ]}
                  onPress={() => setReminderType(t)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      reminderType === t && styles.typeChipTextActive,
                    ]}
                  >
                    {reminderTypeLabel(t)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Label */}
            <Text style={styles.inputLabel}>Tên nhắc nhở</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Thay 30% nước"
              placeholderTextColor={Colors.textMuted}
              value={reminderLabel}
              onChangeText={setReminderLabel}
            />

            {/* Frequency */}
            <Text style={styles.inputLabel}>Tần suất</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typeScroll}
            >
              {(
                [
                  "daily",
                  "every-3-days",
                  "weekly",
                  "biweekly",
                  "monthly",
                ] as ReminderFrequency[]
              ).map((f) => (
                <Pressable
                  key={f}
                  style={[
                    styles.typeChip,
                    reminderFreq === f && styles.typeChipActive,
                  ]}
                  onPress={() => setReminderFreq(f)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      reminderFreq === f && styles.typeChipTextActive,
                    ]}
                  >
                    {frequencyLabel(f)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

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
                  !reminderLabel.trim() && styles.confirmBtnDisabled,
                ]}
                onPress={handleAddReminder}
              >
                <Text style={styles.confirmText}>Thêm</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        visible={readingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setReadingModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Ghi thông số nước</Text>

            <View style={styles.paramInputRow}>
              <View style={styles.paramInputWrap}>
                <Text style={styles.inputLabel}>pH</Text>
                <TextInput
                  style={styles.paramInput}
                  placeholder="6.8"
                  placeholderTextColor={Colors.textMuted}
                  value={ph}
                  onChangeText={setPh}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.paramInputWrap}>
                <Text style={styles.inputLabel}>Nhiệt độ (°C)</Text>
                <TextInput
                  style={styles.paramInput}
                  placeholder="26"
                  placeholderTextColor={Colors.textMuted}
                  value={temperature}
                  onChangeText={setTemperature}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.paramInputRow}>
              <View style={styles.paramInputWrap}>
                <Text style={styles.inputLabel}>GH (dGH)</Text>
                <TextInput
                  style={styles.paramInput}
                  placeholder="8"
                  placeholderTextColor={Colors.textMuted}
                  value={gh}
                  onChangeText={setGh}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.paramInputWrap}>
                <Text style={styles.inputLabel}>NO₃ (ppm)</Text>
                <TextInput
                  style={styles.paramInput}
                  placeholder="10"
                  placeholderTextColor={Colors.textMuted}
                  value={no3}
                  onChangeText={setNo3}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.modalBtns}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setReadingModal(false)}
              >
                <Text style={styles.cancelText}>Huỷ</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmBtn,
                  !ph &&
                    !temperature &&
                    !gh &&
                    !no3 &&
                    styles.confirmBtnDisabled,
                ]}
                onPress={handleAddReading}
              >
                <Text style={styles.confirmText}>Lưu</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: Typography.lg, color: Colors.textMuted },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  // Info chips
  infoRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    padding: Spacing.screenH,
  },
  infoChip: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  infoVal: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  infoLbl: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Section
  section: { paddingHorizontal: Spacing.screenH },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  addReminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.accentGreen,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  addReminderText: {
    fontSize: Typography.base,
    color: Colors.white,
    fontWeight: Typography.medium,
  },

  // Reminder card
  reminderCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  reminderLeft: { flex: 1 },
  reminderType: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  reminderLabel: {
    fontSize: Typography.base,
    color: Colors.textSecond,
    marginTop: 2,
  },
  reminderFreq: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  reminderRight: {
    alignItems: "flex-end",
    gap: Spacing.xs,
  },
  dueLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  doneBtn: {
    backgroundColor: Colors.sageMid,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  doneBtnText: {
    fontSize: Typography.base,
    color: Colors.successGreen,
    fontWeight: Typography.medium,
  },

  // Empty
  emptyReminder: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  emptyReminderText: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },

  // Modal
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
  typeScroll: { marginBottom: Spacing.md },
  typeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.sageDark,
    backgroundColor: Colors.white,
    marginRight: Spacing.xs,
  },
  typeChipActive: {
    backgroundColor: Colors.deepForest,
    borderColor: Colors.deepForest,
  },
  typeChipText: {
    fontSize: Typography.base,
    color: Colors.textSecond,
  },
  typeChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.medium,
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
  confirmBtnDisabled: { backgroundColor: Colors.sageDark },
  confirmText: {
    fontSize: Typography.base,
    color: Colors.white,
    fontWeight: Typography.medium,
  },
  readingCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.sageDark,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  readingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  readingDate: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textSecond,
  },
  readingParams: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  paramBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 52,
  },
  paramBadgeVal: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  paramBadgeLbl: {
    fontSize: 9,
    marginTop: 1,
  },
  paramInputRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  paramInputWrap: {
    flex: 1,
  },
  paramInput: {
    backgroundColor: Colors.sageLight,
    borderRadius: 10,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
});
