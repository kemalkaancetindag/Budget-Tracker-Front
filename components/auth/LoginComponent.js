import React, { useState,useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import btLogo from "../../assets/bt-logo.png";
import { MaterialIcons } from "@expo/vector-icons";

import { AuthContext } from "../../stores/authContext";


export default function Login({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isRunning, setIsRunning] = useState(false);


  
  const { signIn } = useContext(AuthContext);

  

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image source={btLogo} style={styles.logo} />
        <Text style={{ color: "#6B52AD", marginTop: 2 }}>Budget Tracker</Text>
      </View>
      <View style={styles.bottom}>
        <TextInput
          style={styles.textInputStyle}
          placeholderTextColor="#6B52AD"
          placeholder="E-mail"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={styles.textInputStyle}
          placeholderTextColor="#6B52AD"
          placeholder="Şifre"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        {isRunning ? (
          <ActivityIndicator
            color="#6B52AD"
            style={styles.activityIndicator}
            size="large"
          />
        ) : (
          <TouchableOpacity style={styles.pressable} onPress={() => signIn(email,password)}>
            <MaterialIcons name="perm-identity" size={18} color="#fff" />
            <Text style={{ color: "#fff" }}> Oturum Aç</Text>
          </TouchableOpacity>
        )}
        <Pressable
            onPress={() => navigation.navigate("Kayıt Ol")}
        >
            <Text style={{textDecorationLine:"underline", color:"#6B52AD"}}>Hesap oluştur</Text>
        </Pressable>
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
    //justifyContent:"center",
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
  textInputStyle: {
    width: "75%",
    height: 40,
    padding: 5,
    borderWidth: 0.5,
    borderRadius: 3,
    borderColor: "#6B52AD",
    marginBottom: 20,
  },
  activityIndicator: {
    marginBottom: 50,
  },
});
