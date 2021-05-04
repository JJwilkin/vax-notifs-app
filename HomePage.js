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

import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const signUpImage = require("./assets/mobile-login-pana.png");
const Tab = createMaterialBottomTabNavigator();

StatusBar.setBarStyle("dark-content");

function InfoScreen({route}) {
    return (
        <WebView
            source={{ uri: "http://192.168.0.81:3000/" }}

        />
    );
  }

function HomeScreen({jsCode, navigation, setSignedIn}) {
    const isFocused = useIsFocused();
    const notificationListener = useRef();
    const responseListener = useRef();
    useEffect(()=> {
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data = response.notification.request.content.data
          navigation.navigate('Alerts', {message: data});
        }
        
      );

      return () => {
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, [])
    function onMessage(event) {
      //Prints out data that was passed.
      const data = JSON.parse(event.nativeEvent.data)
      setSignedIn(data.isSignedIn)
    }

    return (
        <>
            <WebView
                source={{ uri: "https://vaccinenotifications.org/dashboard" }}
                javaScriptEnabled={true}
                onMessage={onMessage}
                injectedJavaScript={jsCode}
            />
        </>
    );
  }
  
  function SettingsScreen({route, signedIn, navigation}) {
    const isFocused = useIsFocused();
    const message = route?.params?.message;
    const [showView, setShowView] = useState(true);
    const [previousMessage, setPreviousMessage] = useState("");
    function onMessage(event) {
      // Prints out data that was passed.
      // console.log(event.nativeEvent.data);
    }
    useEffect(()=> {

        if (previousMessage != message) {
            setPreviousMessage(message);
            reset();
        }
    }, [isFocused, route])

    const reset = () => {
        setShowView(false);
        setTimeout(()=> setShowView(true), 250);
    }

    let jsCode = message ? `window.localStorage.setItem("newMessage", '${JSON.stringify(message)}')` : ``

    return (
        <>
            {signedIn ? showView &&
                <WebView
                    source={{ uri: "https://vaccinenotifications.org/alerts" }}
                    javaScriptEnabled={true}
                    onMessage={onMessage}
                    injectedJavaScript={jsCode}
                />
                : 
                <SafeAreaView style={styles.fullScreenContainer}>
                  <View style={styles.textContainer}>
                    <Image style={styles.homeImage} source={signUpImage}/>
                    <Text style={styles.welcome}>Sign Up</Text>
                    <Text style={styles.enableText}>To view alerts, sign up through the Dashboard!</Text>
                  </View>
                  <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('Dashboard')}>
                    <Text style={styles.buttonText}>View Dashboard</Text>
                  </ TouchableOpacity>
              </SafeAreaView>
           }
        </>
        
    );
  }

  
  export default function HomePage({ jsCode }) {
    const [signedIn, setSignedIn] = useState(false);
    return (
      <NavigationContainer>
        <Tab.Navigator
          
          initialRouteName="Dashboard"
          barStyle={{ backgroundColor: "rgb(59, 60, 212)" }}
          shifting={true}
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
                <Entypo name="info-with-circle" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Dashboard"
            // component={HomeScreen}
            children={({ navigation }) => (
              <HomeScreen jsCode={jsCode} navigation={navigation}  setSignedIn={setSignedIn} />
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
            // component={SettingsScreen}
            children={({route, navigation}) => (
                <SettingsScreen
                jsCode={jsCode} route={route} signedIn={signedIn} navigation={navigation}
                />
              )}
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
    fullScreenContainer: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      
    },
    textContainer: {

      width: "93%",
      alignItems: "center",
    },
    welcome: {
      fontFamily: "DMSans_700Bold",
      fontSize: 40,
      margin: 15,
    },
    button: {
      backgroundColor: "rgb(59, 60, 212)",
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
      width: "70%",
      height: "55%"
    },
    enableText: {
      fontSize: 18,
      fontFamily: "DMSans_500Medium",
      paddingVertical: 10,
    },
  });

  const styles2 = StyleSheet.create({
    
  });