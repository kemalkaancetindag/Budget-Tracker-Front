import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../stores/authContext";

export default function RecentSpendingsComponent({ navigation }) {
  const [selectedTime, setSelectedTime] = useState();
  const [folderPrefix, setFolderPrefix] = useState();
  const [returnData, setReturnData] = useState();
  const [indicatorActive, setIndicatorActive] = useState(false);

  const { getFolderPrefix } = useContext(AuthContext);

  const getSpendingsByDate = async (prefix, order) => {
    const formData = new FormData();
    

    formData.append("order", order);
    formData.append("folder", prefix);
    

    await fetch("https://app-budget-tracker-api.herokuapp.com/get-spendings-by-date", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data)
        
        if(data.status){
          setIndicatorActive(false);
          setReturnData(data.data);
        }
        else{
          setIndicatorActive(false);
          alert(data.message)
        }
        
      });
  };

  const ListSingle = ({ tutar, tarih, etiket }) => {
    return (
      <TouchableOpacity style={styles.listSingleContainer}>
        <Text style={styles.tableText}>{tutar} TL</Text>
        <Text style={styles.tableText}>{tarih}</Text>
        <Text style={styles.tableText}>{etiket}</Text>
      </TouchableOpacity>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableHighlight
          style={styles.backIcon}
          activeOpacity={0.85}
          underlayColor="#fff"
          onPress={() => {
            navigation.navigate("Anasayfa");
          }}
        >
          <View>
            <MaterialIcons
              name="arrow-back-ios"
              style={styles.backIcon}
              size={24}
            />
          </View>
        </TouchableHighlight>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let prefix = getFolderPrefix();
    setFolderPrefix(prefix);
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Picker
          selectedValue={selectedTime}
          onValueChange={(itemValue) => {
            setIndicatorActive(true);
            setSelectedTime(itemValue);

            getSpendingsByDate(folderPrefix, itemValue);
          }}
          style={styles.pickerStyle}
        >
          <Picker.Item label="Seçiniz"></Picker.Item>
          <Picker.Item label="Bugün" value="bugun"></Picker.Item>
          <Picker.Item label="Dün" value="dun"></Picker.Item>
          <Picker.Item label="Bu Hafta" value="hafta"></Picker.Item>
        </Picker>
        <View style={styles.tableHeader}>
          <View style={styles.tableHeaderIn}>
            <Text style={styles.headerText}>Tutar </Text>
            <MaterialIcons
              name="payments"
              size={16}
              style={{ color: "#6B52AD" }}
            />
          </View>

          <View style={styles.tableHeaderIn}>
            <Text style={styles.headerText}>Tarih </Text>
            <MaterialIcons
              name="event"
              size={16}
              style={{ color: "#6B52AD" }}
            />
          </View>

          <View style={styles.tableHeaderIn}>
            <Text style={styles.headerText}>Etiket </Text>
            <MaterialIcons
              name="label"
              size={16}
              style={{ color: "#6B52AD" }}
            />
          </View>
        </View>
        <View>
          {indicatorActive ? (
            <ActivityIndicator
              color="#6B52AD"
              style={styles.activityIndicator}
              size="large"
            />
          ) : (
            <FlatList
              data={returnData}
              renderItem={({ item }) => (
                <ListSingle
                  tutar={item.tutar}
                  tarih={item.tarih}
                  etiket={item.etiket}
                />
              )}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  backIcon: {
    color: "#6B52AD",
    width: 40,
    height: 40,
  },
  pickerStyle: {
    width: "75%",
    height: 200,
    marginBottom: 20,
  },
  listSingleContainer: {
    width: "100%",
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#6B52AD",
  },
  tableHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    paddingBottom: 3,
    borderColor: "#6B52AD",
  },
  headerText: {
    color: "#6B52AD",
    fontSize: 25,
    fontWeight: "400",
  },
  tableText: {
    color: "#6B52AD",
    fontSize: 15,
  },
  tableHeaderIn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    marginTop: 50,
  },
});
