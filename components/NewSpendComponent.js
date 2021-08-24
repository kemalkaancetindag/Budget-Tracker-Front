import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Camera } from "expo-camera";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "../stores/authContext";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

//TODO:alertler configure edilebiliyormu bak

export default function NewSpend({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState();
  const [spendingTag, setSpendingTag] = useState();
  const [ownCategory, setOwnCategory] = useState();
  const [spendingCost, setSpendingCost] = useState();
  const [showCameraComponent, setShowCameraComponent] = useState(false);
  const [imageData, setImageData] = useState();
  const [billImageButtonDisable, setBillImageButtonDisable] = useState(false);
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);
  const [folderPrefix, setFolderPrefix] = useState();
  const [todaysSpending, setTodaysSpending] = useState();

  const { getFolderPrefix } = useContext(AuthContext);

  const getTodaySpending = async () => {
    const spending = await SecureStore.getItemAsync("todaySpending");
    setTodaysSpending(spending);
  };

  useEffect(() => {
    
    setFolderPrefix(getFolderPrefix());
    getTodaySpending();
  }, []);

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

  const sendSpending = async () => {
    if (
      selectedCategory === "" ||
      selectedCategory === undefined ||
      selectedCategory === null
    ) {
      return alert("Boş Alanlar Var.");
    }
    if (
      spendingTag === "" ||
      spendingTag === undefined ||
      spendingTag === null
    ) {
      return alert("Boş Alanlar Var.");
    }
    if (
      spendingCost === "" ||
      spendingCost === undefined ||
      spendingCost === null
    ) {
      return alert("Boş Alanlar Var.");
    }

    setShowActivityIndicator(true);
    setBillImageButtonDisable(!billImageButtonDisable);

    let formData = new FormData();
    

    formData.append("SpendingTag", spendingTag);
    formData.append("SpendingCost", spendingCost);
    ownCategory
      ? formData.append("SpendingCategory", ownCategory)
      : formData.append("SpendingCategory", selectedCategory);
  
    if(imageData === undefined){
      formData.append("BillImage", "bos");  
    }
    else{
      formData.append("BillImage", imageData.file);
    }
    
    formData.append("FolderPrefix", folderPrefix);

    await fetch("https://app-budget-tracker-api.herokuapp.com/add-new-spending", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        

        const d = new Date();

        if (todaysSpending !== undefined) {
          SecureStore.setItemAsync(
            "todaySpending",
            String(parseFloat(spendingCost) + parseFloat(todaysSpending))
          );
        } else {
          SecureStore.setItemAsync(
            "todaySpending",
            String(parseFloat(spendingCost))
          );
        }

        alert(`
        Harcama Başarı İle Eklendi

        HARCAMA DETAYLARI

        Harcama Miktarı: ${data.addedSpending["Harcama Miktarı"]}

        Harcama Etiketi: ${data.addedSpending["Harcama Etiketi"]}

        Harcama Tarihi: ${data.addedSpending["Harcama Tarihi"]}

        Harcama Kategorisi: ${data.addedSpending["Kategori"]}

        `);

        navigation.navigate("Anasayfa");
      });
  };

  function CameraComponent() {
    const cameraRef = useRef();
    const [hasPermission, setHasPermission] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
      onHandlePermission();
    }, []);

    const onHandlePermission = async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    const onCameraReady = () => {
      setIsCameraReady(true);
    };

    const cancelPreview = async () => {
      await cameraRef.current.resumePreview();
      setIsPreview(false);
    };

    const onSnap = async () => {
      if (cameraRef.current) {
        const options = { quality: 0.7, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        const source = data.base64;

        if (source) {
          await cameraRef.current.pausePreview();
          setIsPreview(true);

          let base64Img = `data:image/jpg;base64,${source}`;

          let data = {
            file: base64Img,
          };

          await setImageData(data);
        }

        setShowCameraComponent(false);
      }
    };

    const switchCamera = () => {
      if (isPreview) {
        return;
      }
      setCameraType((prevCameraType) =>
        prevCameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    };

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text style={styles.text}>No access to camera</Text>;
    }

    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.cameraContainer}
          onCameraReady={onCameraReady}
        />

        <View style={styles.cameraContainer}>
          {isPreview && (
            <TouchableOpacity
              onPress={cancelPreview}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={32} color="#fff" />
              <TouchableOpacity>
                <MaterialIcons name="done" size={32} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          {!isPreview && (
            <View style={styles.bottomButtonsContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!isCameraReady}
                onPress={onSnap}
                style={styles.capture}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewStyle}>
      <View style={styles.container}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.pickerStyle}
        >
          <Picker.Item label="Seçiniz"></Picker.Item>
          <Picker.Item label="Eğlence" value="eglence"></Picker.Item>
          <Picker.Item label="Market" value="market"></Picker.Item>
          <Picker.Item label="Alışkanlık" value="aliskanlık"></Picker.Item>
          <Picker.Item label="Yemek" value="yemek"></Picker.Item>
          <Picker.Item label="Diğer" value="diger"></Picker.Item>
        </Picker>

        {/* <Text style={styles.dividerTextStyle}>
          Harcama Kategorisi Seçebilir veya Bir Harcama Kategorisi
          Girebilirsiniz
        </Text>
        <TextInput
          placeholder="Harcama Kategorisi"
          style={styles.textInputStyle}
          placeholderTextColor="#6B52AD"
          onChangeText={(category) => setOwnCategory(category)}
        /> */}
        <TextInput
          placeholder="Harcama Miktarı (TL)"
          style={styles.textInputStyle}
          placeholderTextColor="#6B52AD"
          onChangeText={(cost) => setSpendingCost(cost)}
        />

        <TextInput
          placeholder="Harcama Etiketi (örn: Kafe, Bar...)"
          style={styles.textInputStyle}
          placeholderTextColor="#6B52AD"
          onChangeText={(tag) => setSpendingTag(tag)}
        />
        {imageData ? (
          <Image
            style={styles.imageContainer}
            source={{ uri: imageData.file }}
          />
        ) : null}

        <TouchableOpacity
          onPress={() => setShowCameraComponent(!showCameraComponent)}
          style={styles.pressableStyle}
          disabled={billImageButtonDisable}
        >
          <Text style={{ color: "#fff" }}>Fiş Fotoğrafı Çek</Text>
        </TouchableOpacity>

        <Text style={styles.dividerTextStyle}>
          Fiş fotoğrafı çekerek fiş içerisindeki harcamaları excel tablosuna ekleyebilirsiniz.
        </Text>

        {showActivityIndicator ? (
          <ActivityIndicator
            color="#6B52AD"
            style={styles.activityIndicator}
            size="large"
          />
        ) : (
          <TouchableOpacity
            onPress={sendSpending}
            style={styles.sendPressableStyle}
          >
            <Text style={{ color: "#fff" }}>Harcama Ekle</Text>
          </TouchableOpacity>
        )}

        {showCameraComponent ? <CameraComponent /> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "center",
  },
  cameraContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  dividerTextStyle: {
    fontSize: 10,
    marginBottom: 20,
    color: "#6B52AD",
  },
  bottomButtonsContainer: {
    position: "absolute",
    flexDirection: "row",
    bottom: 28,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  capture: {
    backgroundColor: "#fff",
    borderRadius: 5,
    height: CAPTURE_SIZE,
    width: CAPTURE_SIZE,
    borderRadius: Math.floor(CAPTURE_SIZE / 2),
    marginBottom: 28,
    marginHorizontal: 30,
  },
  closeButton: {
    position: "absolute",
    top: 35,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    opacity: 0.7,
  },
  imageContainer: {
    width: "75%",
    height: 450,
    resizeMode: "cover",
    marginBottom: 40,
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
  pickerStyle: {
    width: "75%",
    height: 200,
    marginBottom: 20,
  },
  pressableStyle: {
    width: "75%",
    height: 45,
    padding: 5,
    backgroundColor: "#6B52AD",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginBottom: 30,
  },
  sendPressableStyle: {
    width: "75%",
    height: 45,
    padding: 5,
    backgroundColor: "#4BB543",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginBottom: 50,
  },
  activityIndicator: {
    marginBottom: 50,
  },
  backIcon: {
    color: "#6B52AD",
    width: 40,
    height: 40,
  },
});

//FIXME: Kamera ekranı ilk açılışta full ekran olmuyor
