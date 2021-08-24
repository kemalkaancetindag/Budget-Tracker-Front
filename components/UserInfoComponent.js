import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import btLogo from "../assets/bt-logo.png";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../stores/authContext";
import * as SecureStore from "expo-secure-store";

export default function UserInfo({ navigation }) {
  const [dailySpend, setDailySpend] = useState();
  const [username, setUsername] = useState();
  const {} = useContext(AuthContext);

  const getUser = async () => {
    let result = await SecureStore.getItemAsync("user");
    if (result) {
      setUsername(JSON.parse(result).username);

      return;
    }
  };

  const getDailySpend = async () => {
    const c = await SecureStore.getItemAsync("todaySpending");
    setDailySpend(c);
  };

  useEffect(() => {
    getDailySpend();
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.row}>
      {/* <View style={styles.spending}>
        <Text style={{ color: "#85bb65" }}>Günlük Harcama: {dailySpend} </Text>
        <MaterialIcons name="payments" size={16} style={{ color: "#85bb65" }} />
      </View> */}
      <View style={styles.userDiv}>
        <Text style={{ color: "#6B52AD" }}>{username} </Text>
        <MaterialIcons
          name="account-circle"
          size={16}
          style={{ color: "#6B52AD" }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  spending: {
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    height: "100%",
    width: "50%",
    borderWidth: 1,
    padding: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#85bb65",
    borderRadius: 3,
  },
  row: {
    justifyContent: "center",
    flexDirection: "row",
  },
  userDiv: {
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    height: "100%",
    width: "50%",
    padding: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#6B52AD",
    borderWidth: 1,
    borderRadius: 3,
  },
});
