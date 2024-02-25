import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Uploading } from "../components/Uploading";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../firebaseConfig";
import MultiColorText from "../components/MultiColorText";
import * as Animatable from "react-native-animatable";
import {
  useFonts,
  AnonymousPro_400Regular,
  AnonymousPro_700Bold,
} from "@expo-google-fonts/anonymous-pro";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ColorFinder = ({ backgroundColor }) => {
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [lastUploadedImageUrl, setLastUploadedImageUrl] = useState(null);
  const [hexCodes, setHexCodes] = useState([]);

  const fileName = new Date().getTime();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "files"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New file", change.doc.data());
          setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  async function pickImage() {
    // Request permission to access the gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need gallery permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      // Upload the image
      await uploadImage(result.assets[0].uri, "image");
      // Send POST request
      await sendPostRequest(result.assets[0].uri); // Add this line
    }
  }

  async function sendPostRequest(uri) {
    try {
      const formData = new FormData();
      // formData.append("image", {
      //   uri: uri,
      //   type: "image/jpeg",
      //   name: "image.jpg",
      // });
      formData.append("name", fileName);
      console.log(formData);

      const response = await fetch(
        "https://function-1-jl3rzwhdxa-oe.a.run.app",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.hexCodes && Array.isArray(responseData.hexCodes)) {
        setHexCodes(responseData.hexCodes);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function uploadImage(uri, fileType) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, "Stuff/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    //listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("progress", progress);
        setProgress(progress.toFixed());
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // save record
          setLastUploadedImageUrl(downloadURL);
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
          console.log(fileName);
        });
      }
    );
  }

  async function saveRecord(fileType, url, createdAt) {
    try {
      const docRef = await addDoc(collection(db, "files"), {
        fileType,
        url,
        createdAt,
      });
      console.log("document saved correctly", docRef.id);
    } catch (e) {
      console.log(e);
    }
  }

  useFonts({
    AnonymousPro_400Regular,
    AnonymousPro_700Bold,
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/*<StatusBar barStyle={"light-content"} /> */}
      {lastUploadedImageUrl && (
        <Animatable.View animation={"fadeInUp"} style={styles.headingContainer}>
          <MultiColorText
            text="Wow! Look at your beautiful image"
            style={styles.heading}
          />
          <Image
            source={{ uri: lastUploadedImageUrl }}
            style={{
              width: "100%",
              height: "70%",
              justifyContent: "center",
              alignItems: "center",
              resizeMode: "cover",
            }}
          />
          <View style={styles.hexCodeList}>
            <FlatList
              data={hexCodes}
              renderItem={({ item }) => (
                <View style={styles.hexCodeItem}>
                  <Text style={styles.hexCodeText}>{item}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Animatable.View>
      )}
      {image && <Uploading image={image} progress={progress} />}
      {!lastUploadedImageUrl && (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animatable.View animation={"fadeInUp"} style={{ marginTop: hp(15) }}>
            <MultiColorText
              text="Find The Most Powerful colors in your Picture"
              style={styles.openingHeader}
            />
          </Animatable.View>
          <Animatable.View animation={"fadeInUp"}>
            <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
              <View style={styles.buttonContainer}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "AnonymousPro_400Regular",
                    marginRight: 20,
                  }}
                >
                  Upload your photo
                </Text>
                <Ionicons name="image" size={25} color={"white"} />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headingContainer: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: hp(8),
    margin: 20
  },
  openingHeader: {
    textAlign: "center",
    fontSize: 32,
    fontFamily: "AnonymousPro_700Bold",
    margin: 20,
  },
  heading: {
    textAlign: "center",
    fontSize: 32,
    fontFamily: "AnonymousPro_700Bold",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    width: 300,
    height: 100,
    backgroundColor: "#12372A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: hp(15),
    shadowColor: "#12372A",
    shadowOffset: {
      width: 10,
      height: hp(2),
    },
    shadowOpacity: 0.6,
    shadowRadius: wp(1),
    elevation: 5,
  },
  hexCodeList: {
    marginTop: 20,
  },
  hexCodeItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 5,
    borderRadius: 5,
  },
  hexCodeText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ColorFinder;
