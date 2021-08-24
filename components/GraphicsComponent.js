import React from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";

export default function Graphics({ navigation }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate("Charts",{
            chartType: 'barChart',
          })}>
        <Text>Bar Grafik</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Charts", {
            chartType: 'pieChart',
          })}>
        <Text>Pasta Grafik</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
