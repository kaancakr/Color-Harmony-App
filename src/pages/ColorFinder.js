import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Uploading } from "../components/Uploading";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../firebaseConfig";
import MultiColorText from "../components/MultiColorText";
import {
  useFonts,
  AnonymousPro_400Regular,
  AnonymousPro_700Bold,
} from "@expo-google-fonts/anonymous-pro";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ColorFinder = () => {
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [lastUploadedImageUrl, setLastUploadedImageUrl] = useState(null);

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
    if (status !== 'granted') {
      alert('Sorry, we need gallery permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Upload the image
      await uploadImage(result.assets[0].uri, "image");
    }
  }

  async function uploadImage(uri, fileType) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
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
    <View style={{ flex: 1, justifyContent: "center", marginTop: -hp(10), backgroundColor: "#fff" }}>
      {/*<StatusBar barStyle={"light-content"} /> */}
      {lastUploadedImageUrl && (
        <View style={styles.headingContainer}>
          <MultiColorText
            text="Wow! Look at your beautiful image"
            style={styles.heading}
          />
          <Image
            source={{ uri: lastUploadedImageUrl }}
            style={{ width: "100%", height: "50%" }}
          />
        </View>
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
          <View>
            <MultiColorText
              text="Find The Most Powerful colors in your Picture"
              style={styles.openingHeader}
            />
          </View>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: 300,
              height: 100,
              backgroundColor: "#12372A",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              marginTop: hp(20),
            }}
          >
            <View style={styles.buttonContainer}>
              <Text style={{ color: "white", fontSize: 16, fontFamily: "AnonymousPro_400Regular", marginRight: 20 }}>
                Upload your photo
              </Text>
              <Ionicons name="image" size={25} color={"white"} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headingContainer: {
    justifyContent: "center",
    alignContent: "center",
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
});

export default ColorFinder;
