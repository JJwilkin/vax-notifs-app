import Constants from 'expo-constants';
import AppLoading from "expo-app-loading";
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView, Button, Image } from 'react-native';
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

export default function Home (props) {
    const {setExpoPushToken} = props;
    let [fontsLoaded] = useFonts({
      DMSans_400Regular,
      DMSans_400Regular_Italic,
      DMSans_500Medium,
      DMSans_500Medium_Italic,
      DMSans_700Bold,
      DMSans_700Bold_Italic,
    });

    const handleEnableNotifications = () => {
        registerForPushNotificationsAsync().then((token) => {
            console.log('this is token:', token)
            storeData("ExpoPushToken", token);
            setExpoPushToken(token);
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
              <Text style={styles.steps}>1. Please enable push notifications to receive vaccine news</Text>
              <Text style={styles.steps}>2. Please enable push notifications to receive vaccine news</Text>
              <Text style={styles.steps}>3. Please enable push notifications to receive vaccine news</Text>
            </View>
            <Button title="Enable Notifications" onPress={handleEnableNotifications}/>
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
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
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
    fontSize: 40,
    margin: 15
  },
  homeImage: {
    width: "80%",
    height: "50%"
  },
  steps: {
    fontSize: 18,
    fontFamily: "DMSans_500Medium",
    paddingVertical: 10
  }
});