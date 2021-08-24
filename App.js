import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useReducer, useContext } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import HomeScreen from "./components/HomeComponent";
import NewSpendScreen from "./components/NewSpendComponent";
import GraphicsScreen from "./components/GraphicsComponent";
import ChartScreen from "./components/ChartComponent";
import CustomHeader from "./components/CustomHeaderComponent";
import SignUpScreen from "./components/auth/SignUpComponent";
import LoginScreen from "./components/auth/LoginComponent";
import RecentSpendingsScreen from "./components/RecentSpendingsComponent";

import { AuthContext } from "./stores/authContext";

const Stack = createNativeStackNavigator();

//TODO:Gereksiz importlar ve paketler kaldırılacak
//TODO:Günlük harcama mantığı yapılıcak

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [folderPrefix, setFolderPrefix] = useState(null);
  const d = new Date();

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const setUser = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  };

  const getUser = async () => {
    let result = await SecureStore.getItemAsync("user");

    if (result) {
      setUserToken(JSON.parse(result));
      setFolderPrefix(JSON.parse(result).folderPrefix);
      return;
    }
  };

  useEffect(() => {
    getUser();
    
  }, []);

  const authContext = React.useMemo(() => ({
    signIn: async (email, password) => {
      const formData = new FormData();

      if (!validateEmail(email)) {
        return alert("Geçerli bir Email adresi giriniz.");
      }

      if (password.length < 6) {
        return alert("Şifreniz minimum 6 haneden oluşmalıdır.");
      }

      formData.append("password", password.trim());
      formData.append("email", email.trim());

      await fetch("https://app-budget-tracker-api.herokuapp.com/login", {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          
          if (data.status) {
            setUser("user", JSON.stringify(data.user));
            setUserToken(data.user);
            setFolderPrefix(data.user.folderPrefix);
          }
          else{
            return alert(data.message)
          }

          
        });
    },
    signUp: async (username, email, password) => {
      const formData = new FormData();

      if (!validateEmail(email)) {
        return alert("Geçerli bir Email adresi giriniz.");
      }

      if (password.length < 6) {
        return alert("Şifreniz minimum 6 haneden oluşmalıdır.");
      }

      formData.append("username", username.trim());
      formData.append("password", password.trim());
      formData.append("email", email.trim());

      await fetch("https://app-budget-tracker-api.herokuapp.com/signup", {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            
            setUser("user", JSON.stringify(data.user));
            setUserToken(data.user);
            setFolderPrefix(data.user.folderPrefix);
          } else {
            alert(`${data.message}`);
          }
        });
    },
    signOut: async () => {
      await SecureStore.deleteItemAsync("user");
      setUserToken(null);
    },
    getFolderPrefix: () => {
      return folderPrefix;
    },
  }));

  return (
    <NavigationContainer>
      <StatusBar />
      <AuthContext.Provider value={authContext}>
        <Stack.Navigator>
          {userToken == null ? (
            <>
              <Stack.Screen
                name="Giriş"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Kayıt Ol"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Anasayfa"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Yeni Harcama"
                component={NewSpendScreen}
                options={{
                  headerTitle: (props) => <CustomHeader {...props} />,
                }}
              />
              <Stack.Screen
                name="Geçmiş Harcamalar"
                component={RecentSpendingsScreen}
                options={{
                  headerTitle: (props) => <CustomHeader {...props} />,
                }}
              />

              <Stack.Screen name="Grafikler" component={GraphicsScreen} />
              <Stack.Screen name="Charts" component={ChartScreen} />
            </>
          )}
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
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
