import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView, Button } from 'react-native';
import { storeData, getData} from './helpers/AsyncHelpers';

export default function Home (props) {
    
    const {setExpoPushToken} = props;

    const handleEnableNotifications = () => {
        registerForPushNotificationsAsync().then((token) => {
            console.log('this is token:', token)
            storeData("ExpoPushToken", token);
            setExpoPushToken(token);
            // setNotificationsEnabled(true);
        })
    }
    return (
        <SafeAreaView styles={styles.container}>
            <Text>Welcome</Text>
            <Text>Please enable push notifications to receive vaccine news</Text>
            <Button title="Enable Notifications" onPress={handleEnableNotifications}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

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