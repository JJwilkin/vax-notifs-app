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
        setExpoPushToken(token);
        setNotificationsEnabled(true);

      }
    }
    setUp();
  }, []);

  useEffect(()=> {
    if (expoPushToken) {
      setNotificationsEnabled(true);
    }
  }, [expoPushToken])

  
  let jsCode = `window.localStorage.setItem('ExpoToken', '${expoPushToken}');`;

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
