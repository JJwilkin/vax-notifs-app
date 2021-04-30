import Constants from "expo-constants";
import { AppLoading } from "expo";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, StatusBar, Platform, LogBox } from "react-native";
import { WebView } from "react-native-webview";
import Landing from "./Landing";
import HomePage from './HomePage';
import { getData, clear} from './helpers/AsyncHelpers';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
LogBox.ignoreAllLogs(); // Ignore log notification by message

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [handleNotification, setHandleNotification] = useState();
  

  StatusBar.setBarStyle("dark-content");

  useEffect(() => {
    async function setUp () {
      // await clear();
      const token = await getData("ExpoPushToken");

      if (token) {
        console.log('this is token: ', token);
        setExpoPushToken(token);
        setNotificationsEnabled(true);

      }

    //   // This listener is fired whenever a notification is received while the app is foregrounded
    // notificationListener.current = Notifications.addNotificationReceivedListener(
    //   (notification) => {
    //     setNotification(notification);
    //     // console.log(response);
    //     handleNotification.navigate('History');
    //   }
    // );

    // // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // responseListener.current = Notifications.addNotificationResponseReceivedListener(
    //   (response) => {
    //     // console.log(response);
    //     handleNotification.navigate('History');
    //   }
    // );
    }

    setUp();

    // return () => {
    //   Notifications.removeNotificationSubscription(
    //     notificationListener.current
    //   );
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };
  }, []);

  useEffect(()=> {
    if (expoPushToken) {
      setNotificationsEnabled(true);
    }
  }, [expoPushToken])

  
  let jsCode = `localStorage.setItem('ExpoToken', '${expoPushToken}');`;

  return (
    <>
      {notificationsEnabled ? (
        <HomePage jsCode={jsCode} setHandleNotification={setHandleNotification}/>
      ) : (
        <Landing setExpoPushToken={setExpoPushToken}/>
      )}
    </>
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
