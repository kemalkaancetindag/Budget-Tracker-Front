import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import btLogo from "../assets/bt-logo.png";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../stores/authContext";
import * as SecureStore from "expo-secure-store";
import UserInfo from "./UserInfoComponent";

//TODO:Geçmiş Harcama Buton Eklenicek
export default function Home({ navigation }) {
  const { signOut } = useContext(AuthContext);
  const [userToken, setUserToken] = useState();

  const [sending, setSending] = useState(false);

  const getUser = async () => {
    let result = await SecureStore.getItemAsync("user");
    if (result) {
      setUserToken(JSON.parse(result));
      return;
    }
  };

  useEffect(() => {
    getUser();
  });

  const sendEmail = async () => {
    setSending(true);
    fetch(
      `https://app-budget-tracker-api.herokuapp.com/send-excel?email=${userToken.email}&folderPrefix=${userToken.folderPrefix}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.status)
        if (data.status) {
          setSending(false);
          alert("Mail Kutunuzu Kontrol Ediniz.");
        }
        else{
          setSending(false);
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoStyle}>
        <UserInfo />
      </View>

      <View style={styles.top}>
        <Image source={btLogo} style={styles.logo} />
        <Text style={{ color: "#6B52AD", marginTop: 2 }}>Budget Tracker</Text>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.pressable}
          onPress={() => navigation.navigate("Yeni Harcama")}
        >
          <MaterialIcons name="add" size={18} color="#fff" />
          <Text style={{ color: "#fff" }}> Yeni Harcama Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pressable}
          onPress={() => navigation.navigate("Geçmiş Harcamalar")}
        >
          <MaterialIcons name="history" size={18} color="#fff" />
          <Text style={{ color: "#fff" }}> Geçmiş Harcamalar</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.pressable}
          onPress={() => navigation.navigate("Geçmiş Harcamalar")}
        >
          <MaterialIcons name="festival" size={18} color="#fff"/>
          <Text style={{color:"#fff"}}>  Etkinlik Bütçesi Oluştur</Text>
          
          
        </TouchableOpacity> */}

        {sending ? (
          <ActivityIndicator
            color="#1D6F42"
            style={styles.activityIndicator}
            size="large"
          />
        ) : (
          <TouchableOpacity style={styles.pressableExcel} onPress={sendEmail}>
            <MaterialIcons name="description" size={18} color="#fff" />
            <Text style={{ color: "#fff" }}> Excel Dosyasını Gönder</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <MaterialIcons name="logout" size={18} color="#fff" />
          <Text style={{ color: "#fff" }}> Çıkış</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  bottom: {
    width: "100%",
    height: "50%",
    paddingBottom: 20,
    alignItems: "center",
  },
  top: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    width: "75%",
    height: 45,
    padding: 5,
    backgroundColor: "#6B52AD",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginBottom: 30,
    flexDirection: "row",
  },
  logoutButton: {
    width: "75%",
    height: 45,
    padding: 5,
    backgroundColor: "#b23b3b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginBottom: 30,
    flexDirection: "row",
  },
  userInfoStyle: {
    height: 70,
  },
  pressableExcel: {
    width: "75%",
    height: 45,
    padding: 5,
    backgroundColor: "#1D6F42",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginBottom: 30,
    flexDirection: "row",
  },
  activityIndicator: {
    marginBottom: 30,
  },
});
