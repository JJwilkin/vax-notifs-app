import Constants from 'expo-constants';
import AppLoading from "expo-app-loading";
import { WebView } from "react-native-webview";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo, AntDesign, } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { storeData, getData } from './helpers/AsyncHelpers';
import { Provider as PaperProvider } from "react-native-paper";
import { medGrey, lightGrey, title, mainContainer, padding } from "./styles";

import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

StatusBar.setBarStyle("dark-content");

function InfoScreen({route}) {
    return (
        <WebView
            source={{ uri: "http://192.168.0.81:3000/" }}

        />
    );
  }

function HomeScreen({jsCode, navigation}) {
    const isFocused = useIsFocused();
    const notificationListener = useRef();
    const responseListener = useRef();
    useEffect(()=> {

        // This listener is fired whenever a notification is received while the app is foregrounded
    // notificationListener.current = Notifications.addNotificationReceivedListener(
    //     (response) => {

    //       console.log(response);
    //       navigation.navigate('History', {message: Math.random()});
    //     }
    //   );
  
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log(response.notification.request.content.data.message);
          const message = response.notification.request.content.data.message;
          const body = response.notification.request.content.body;
          navigation.navigate('Alerts', {message: body});
        }
        
      );

      return () => {
        // Notifications.removeNotificationSubscription(
        //   notificationListener.current
        // );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, [])
    return (
        <>
            <WebView
                source={{ uri: "http://192.168.0.81:3000/dashboard" }}
                javaScriptEnabled={true}
                onMessage={() => {}}
                injectedJavaScript={jsCode}
            />
        </>
    );
  }
  
  function SettingsScreen({route}) {
    const isFocused = useIsFocused();
    const message = route?.params?.message;
    const [showView, setShowView] = useState(true);
    const [previousMessage, setPreviousMessage] = useState("");

    useEffect(()=> {
        // console.log(message)
        // console.log(previousMessage);
        if (previousMessage != message) {
            setPreviousMessage(message);
            reset();
        }
    }, [isFocused, route])

    const reset = () => {
        setShowView(false);
        setTimeout(()=> setShowView(true), 250);
    }
    return (
        <>
            {(showView) &&
                <WebView
                    source={{ uri: "http://192.168.0.81:3000/resetpass" }}
                    javaScriptEnabled={true}
                    onMessage={() => {}}
                    injectedJavaScript={`alert("${message}");`}
                />
           }
        </>
        
    );
  }
  
  const Tab = createBottomTabNavigator();
  
  export default function HomePage({ jsCode }) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Dashboard"
          tabBarOptions={{
            activeTintColor: "#6161b5",
            keyboardHidesTabBar: false,
          }}
        >
          <Tab.Screen
            name="Info"
            component={InfoScreen}
            options={{
              tabBarLabel: "Info",
              tabBarIcon: ({ color }) => (
                <Entypo name="info-with-circle" size={27} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Dashboard"
            // component={HomeScreen}
            children={({ navigation }) => (
              <HomeScreen jsCode={jsCode} navigation={navigation} />
            )}
            options={{
              tabBarLabel: "Dashboard",
              tabBarIcon: ({ color }) => (
                <Entypo name="home" size={27} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Alerts"
            component={SettingsScreen}
            // children={() => (
            //     <SettingsScreen
            //     jsCode={jsCode}
            //     />
            //   )}
            options={{
              tabBarLabel: "Alerts",
              tabBarIcon: ({ color }) => (
                <Entypo name="list" size={27} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  const styles = StyleSheet.create({
    mainContainer: {
        ...mainContainer,
        paddingHorizontal: 0,
        flex: 1,
        backgroundColor: 'white',
      },
      title: {
        ...title,
        marginBottom: 10,
        paddingHorizontal: padding
      },
    navContainer: {
      backgroundColor: "blue",
      paddingTop: 10,
      paddingBottom: 10,
      shadowColor: "#000000",
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowOffset: {
          height: 15,
          width: 1
      }
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5FCFF",
      padding: 24,
    },
  });