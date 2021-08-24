import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import btLogo from "../../assets/bt-logo.png";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../stores/authContext";

export default function SignUp({ navigation }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const isRunning = false;

  const { signUp } = useContext(AuthContext);

  const singUp = async () => {
    
  };

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
          placeholder="Kullanıcı Adı"
          onChangeText={(username) => setUserName(username)}
        />
        <TextInput
          style={styles.textInputStyle}
          placeholderTextColor="#6B52AD"
          placeholder="Şifre"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TextInput
          style={styles.textInputStyle}
          placeholderTextColor="#6B52AD"
          placeholder="E-mail"
          onChangeText={(email) => setEmail(email)}
        />
        {isRunning ? (
          <ActivityIndicator
            color="#6B52AD"
            style={styles.activityIndicator}
            size="large"
          />
        ) : (
          <TouchableOpacity
            style={styles.pressable}
            onPress={() => signUp(username,email,password)}
          >
            <MaterialIcons name="perm-identity" size={18} color="#fff" />
            <Text style={{ color: "#fff" }}> Kayıt Ol</Text>
          </TouchableOpacity>
        )}
        <Pressable
            onPress={() => navigation.navigate("Giriş")}
        >
            <Text style={{textDecorationLine:"underline", color:"#6B52AD"}}>Zaten bir hesabın var mı?</Text>
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
