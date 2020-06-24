import React from 'react';
import {AppState} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {connect} from "react-redux";
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();
import * as actionCreators from '../store/actions';

import RouteNames from "./RouteNames";
import UserListing from "../screens/App/UserListing";
import Profile from "../screens/App/Profile";
import Packages from "../screens/App/Packages";
import Splash from "../screens/Auth/Splash";
import LoginTwo from "../screens/Auth/LoginTwo";
import SignupTwo from "../screens/Auth/SignupTwo";
import Listings from "../screens/Auth/Listings";

import SignInWithRegisteredEmail from "../screens/Auth/SignInWithRegisteredEmail";
import EmailVerification from "../screens/Auth/EmailVerification";
import TrainerSignupDetails from "../screens/Auth/TrainerSignupDetails";
import TrainerHomeScreen from "../screens/Auth/TrainerHomeScreen";
import {updateAxiosToken} from "../API";
import VideoCall from "../screens/App/VideoCall";
import VideoTester from "../screens/App/VideoTester";
import {navigate, navigationRef} from './RootNavigation';
import {videoTestMode} from "../constants/appConstants";
// import RNCallKeep from "react-native-callkeep";
import LaunchApplication from 'react-native-bring-foreground';
// import {callKeepConfig, randomuuid} from "../utils/callKeep";
import ChooseUserType from "../screens/Auth/ChooseUserType";
import {configureFCMNotification, LocalNotification} from "../utils/notification";
import {customDelay} from "../utils/utils";
// import requestCameraAndAudioPermission from "../utils/permission";

// const displayIncomingCall = async (sessionId, agoraAppId, userName = 'user') => {
//   RNCallKeep.displayIncomingCall(randomuuid, 'user', userName);
//   global.sessionId = sessionId;
//   global.agoraAppId = agoraAppId;
// }

import RNExitApp from 'react-native-exit-app';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Remote Message handled in the background!', remoteMessage);
  LocalNotification(remoteMessage.data)
  // await customDelay(000); //wait for the notification to display
  LaunchApplication.open('com.thirdessential.fitnessfirst');
  // const {sessionId, agoraAppId, userEmail} = remoteMessage.data;

  // displayIncomingCall(sessionId, agoraAppId, userEmail);
});

// const onAnswerCallAction = async (data) => {
//   let {callUUID} = data;
//   RNCallKeep.backToForeground();
//   RNCallKeep.rejectCall(callUUID);
//
//   const permissionGranted = await requestCameraAndAudioPermission();
//   if (!permissionGranted) return;
//   navigate(RouteNames.VideoCall, {
//     AppID: global.agoraAppId,
//     ChannelName: global.sessionId
//   });
// };
//
// RNCallKeep.setup(callKeepConfig).then(accepted => {
//   RNCallKeep.addEventListener("answerCall", onAnswerCallAction)
// });

var PushNotification = require("react-native-push-notification");
configureFCMNotification()
const noHeader = {title: '', headerStyle: {height: 0}}

class App extends React.Component {
  state = {
    loading: true,
    videoTestMode // set this to true to enter video testing mode,
  }

  async componentDidMount() {
    // this.props.resetUser();this.props.resetAuth()
    const {setAuthenticated} = this.props;
    setAuthenticated(false); // TODO: Remove this line and fix auth blacklisting
    this.authSubscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
    this.syncing = false;
    // AppState.addEventListener("change", this._handleAppStateChange);
    // messaging().onMessage(async remoteMessage => {
    //   console.log("Remote message received", remoteMessage);
    //   const {sessionId, agoraAppId, userEmail} = remoteMessage.data;
    //   displayIncomingCall(sessionId, agoraAppId, userEmail);
    // })

  }
  // _handleAppStateChange = nextAppState => {
    // if(nextAppState==='active')     PushNotification.cancelAllLocalNotifications()
  // };
  onAuthStateChanged = async (user) => {
    const {authToken, setAuthenticated, syncFirebaseAuth} = this.props;
    console.log("Auth state changed", user);
    let fcmToken = await messaging().getToken();
    console.log('fcm', fcmToken)
    if (user) {
      if (!!authToken) {
        console.log('authToken present, going home');
        updateAxiosToken(authToken);
        setAuthenticated(true);
      } else {
        console.log("No auth token, getting one");
        let fcmToken = await messaging().getToken();
        let idToken = await auth().currentUser.getIdToken(true);
        let authSuccess;
        if (this.syncing == false) {
          this.syncing = true; // avoid multiple api calls
          authSuccess = await syncFirebaseAuth(idToken, fcmToken);
        }
        this.syncing = false;

        if (authSuccess)
          setAuthenticated(true);
        else {
          //TODO:Handle this case
        }
      }
    } else {
      setAuthenticated(false);
    }
    if (this.state.loading)
      this.setState({loading: false});
  }

  render() {
    if (this.state.videoTestMode)
      return (
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name={RouteNames.VideoTester} component={VideoTester}/>
            <Stack.Screen name={RouteNames.VideoCall} component={VideoCall} options={noHeader}/>
          </Stack.Navigator>
        </NavigationContainer>
      )

    const {loading} = this.state;
    const {authenticated, initialLogin} = this.props;

    if (loading) {
      return (
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name={RouteNames.Splash} component={Splash}/>
            <Stack.Screen name={RouteNames.VideoCall} component={VideoCall} options={noHeader}/>
          </Stack.Navigator>
        </NavigationContainer>
      )
    } else if (authenticated) {
      if (initialLogin) return (
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen name="TrainerSignupDetails" component={TrainerSignupDetails}
                          options={{title: 'Enter details'}}/>
          </Stack.Navigator>
        </NavigationContainer>
      )
      else
        return (
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
              <Stack.Screen name={RouteNames.UserListing} component={UserListing} options={{title: 'Overview'}}/>
              <Stack.Screen name={RouteNames.Profile} component={Profile}/>
              <Stack.Screen name={RouteNames.Packages} component={Packages}/>
              <Stack.Screen name={RouteNames.VideoCall} component={VideoCall} options={noHeader}/>
            </Stack.Navigator>
          </NavigationContainer>
        );
    } else return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{
          headerStyle: {},
        }}
        >
          <Stack.Screen name={RouteNames.ChooseUserType} component={ChooseUserType} options={noHeader}/>
          <Stack.Screen name={RouteNames.Login} component={LoginTwo} options={{title: ''}} />
          <Stack.Screen name={RouteNames.Signup} component={SignupTwo} options={{title: 'Sign up'}}/>
          <Stack.Screen name="Listings" component={Listings}/>
          <Stack.Screen name="signInWithRegisteredEmail" component={SignInWithRegisteredEmail}
                        options={{title: 'Sign in'}}/>
          <Stack.Screen name="EmailVerification" component={EmailVerification} options={{title: ''}}/>
          <Stack.Screen name="TrainerSignupDetails" component={TrainerSignupDetails}
                        options={{title: 'Enter details'}}/>
          <Stack.Screen name="TrainerHomeScreen" component={TrainerHomeScreen} options={{title: ''}}/>
          <Stack.Screen name={RouteNames.VideoCall} component={VideoCall} options={noHeader}/>

        </Stack.Navigator>

      </NavigationContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  authToken: state.user.authToken,
  authenticated: state.auth.authenticated,
  initialLogin: state.user.initialLogin
});

const mapDispatchToProps = (dispatch) => ({
  resetAuth: () => dispatch(actionCreators.resetAuth()),
  resetUser: () => dispatch(actionCreators.resetUser()),
  setAuthenticated: (value) => dispatch(actionCreators.setAuthenticated(value)),
  syncFirebaseAuth: (idToken, fcmToken) => dispatch(actionCreators.syncFirebaseAuth(idToken, fcmToken))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);