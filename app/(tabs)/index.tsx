import { Colors, Typography } from "@/constants/theme";
import { useWikiStore } from "@/store/useWikiStore";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const { fish } = useWikiStore();
  console.log('Fish Count', fish.length);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ fontSize: Typography.xl, color: Colors.textPrimary }}>
          Khám Phá
        </Text>
      </View>
    </SafeAreaView>
  );
}
