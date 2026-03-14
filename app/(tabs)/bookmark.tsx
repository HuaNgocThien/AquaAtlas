import { Colors, Typography } from "@/constants/theme";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookmarkScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: Typography.xl, color: Colors.textPrimary }}>
          Bookmark
        </Text>
      </View>
    </SafeAreaView>
  );
}
