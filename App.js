import React,{Component} from 'react';
import { StyleSheet, Text, View ,Button,TouchableOpacity} from 'react-native';
import { Audio } from 'expo-av';
import URL from './defaultApiUrl'
import { INTERRUPTION_MODE_ANDROID_DO_NOT_MIX } from 'expo-av/build/Audio';
const signalR = require("@aspnet/signalr");


export default class App extends Component {
  constructor() {
    super();
    this.state = { isPlaying: false };

    this.loadAudio = this.loadAudio.bind(this);
    this.toggleAudioPlayback = this.toggleAudioPlayback.bind(this);
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
     playsInSilentModeIOS:true,
     staysActiveInBackground:true,
     allowsRecordingIOS:false,
     
     interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
     interruptionModeIOS:Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
     shouldDuckAndroid:true,
     playThroughEarpieceAndroid:false

    });
   
    this.loadAudio();
  }

  componentWillUnmount() {
    this.soundObject.stopAsync();
  }

  async loadAudio() {
    this.soundObject = new Audio.Sound();
    try {
      await this.soundObject.loadAsync({ uri: URL+'Audio/waiting.mp3' },
      {shouldPlay:true});
    } catch (e) {
      console.log('ERROR Loading Audio', e);
    }
  }

  toggleAudioPlayback() {
    this.setState({
      isPlaying: !this.state.isPlaying,
    }, () => (this.state.isPlaying
      ? this.soundObject.playAsync()
      : this.soundObject.pauseAsync()));
  }

  render() {
    return (
      <TouchableOpacity Text="asd" onPress={() => {this.toggleAudioPlayback()}} style={styles.container}>
       <Text> Touch Here </Text>
    </TouchableOpacity>
    );
  }


  connectToHub() {

    'use strict';
    const hubUrl = `${URL}StreamHub`
    console.log(hubUrl);
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .build();
    connection.serverTimeoutInMilliseconds = 100000;
    connection.on("ReceiveMessage", function (message, time) {
      //console.log(message);
      //Alert.alert(message);
      handleMessage(message, time);
    });

    connection.start().catch(function (err) {
      //Alert(err);
      return console.error(err.toString());
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
