import { Colors, CommonStyles, Typography } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView style={CommonStyles.screen} edges={["top"]}>
      <View
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <Text style={{ fontSize: Typography.xl, color: Colors.textPrimary }}>
          Plant: {id}
        </Text>
      </View>
    </SafeAreaView>
  );
}
