import React from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Image } from "react-native";
import btLogo from "../assets/bt-logo.png"

export default function CustomHeader({ navigation }) {
  return (
    <View style={styles.header}>
     <Image source={btLogo} style={styles.image}/>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width:"100%",
    height:"100%",
    flexDirection:"row",
    alignItems: "center",
    marginLeft:"47%",
    marginBottom:20

  },
  image:{
      resizeMode:"contain",
      height:30,
      width:30,
  },
});
