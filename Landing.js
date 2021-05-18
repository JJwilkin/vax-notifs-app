import Constants from 'expo-constants';
import AppLoading from "expo-app-loading";
import * as Notifications from 'expo-notifications';
import { ActivityIndicator } from 'react-native-paper';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Platform, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { storeData, getData } from './helpers/AsyncHelpers';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';

export default function Landing (props) {
    const {setExpoPushToken} = props;
    const [loading, setLoading] = useState(false);
    let [fontsLoaded] = useFonts({
      DMSans_400Regular,
      DMSans_400Regular_Italic,
      DMSans_500Medium,
      DMSans_500Medium_Italic,
      DMSans_700Bold,
      DMSans_700Bold_Italic,
    });

    const handleEnableNotifications = () => {
        setLoading(true);
        registerForPushNotificationsAsync().then((token) => {
            storeData("ExpoPushToken", token);
            setExpoPushToken(token);
            setLoading(false);
            // setNotificationsEnabled(true);
        })
    }

    if (!fontsLoaded) {
      console.log(fontsLoaded)
      return (<AppLoading />)
    } else {
      console.log(fontsLoaded)
      return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textContainer}>
              <Image style={styles.homeImage} source={require("./assets/home-image.png")}/>
              <Text style={styles.welcome}>Get Notified</Text>
              <Text style={styles.enableText}>To receive vaccine news please enable push notifications. </Text>
              <Text style={styles.enableText}>You can opt-out of notifications or update your preferences at any time.</Text>
            </View>
            {loading ? <ActivityIndicator animating={true} color={"#6c6cbd"} /> : 
            <TouchableOpacity style={styles.button} onPress={handleEnableNotifications}>
              <Text style={styles.buttonText}>Enable Notifications</Text>
            </ TouchableOpacity>
            }
        </SafeAreaView>
      )
    }
}

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Please enable notifications for this app in the settings");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }
  
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  
    return token;
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 80,
    marginHorizontal: 24
  },
  textContainer: {
    width: "100%",
    alignItems: "center"
  },
  welcome: {
    fontFamily: "DMSans_700Bold",
    fontSize: 32,
    margin: 15,
    color: "#343a40"
  },
  button: {
    backgroundColor: "#254FA4",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "DMSans_500Medium"
  },
  homeImage: {
    width: "80%",
    height: "50%"
  },
  enableText: {
    fontSize: 18,
    fontFamily: "DMSans_400Regular",
    paddingVertical: 10,
    color: "#343a40",
  },
});