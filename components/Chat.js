import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, Day, SystemMessage, InputToolbar } from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

//Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//NetInfo
import NetInfo from '@react-native-community/netinfo';

//Firebase DB
const firebase = require('firebase');
require('firebase/firestore');

//initailize the firestore app
const firebaseConfig = {
  apiKey: "AIzaSyDSWo6aZBQc2jBznHCWICzkt0uORnIT6w8",
  authDomain: "chat-app-e32d1.firebaseapp.com",
  projectId: "chat-app-e32d1",
  storageBucket: "chat-app-e32d1.appspot.com",
  messagingSenderId: "240374069255",
  appId: "1:240374069255:web:0c359a63be3619caccd2a2"
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
      },
      image: null,
      isConnected: false,
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //references the messages collection in the forestore app
    this.referenceChatMessages = firebase.firestore().collection('messages');

  }

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // Add messages to database
  addMessages() {
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || null,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });
  }

  //when a user hits send, append the new message to the messages state object
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      // Make sure to call addMessages so they get saved to the server
      () => {
        this.addMessages();
        // Calls function saves to local storage
        this.saveMessages();
      })
  }

  //whenever something in the messages collection changes, retrieve current data and store in state
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text || '',
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image,
        location: data.location
      });
    });
    this.setState({
      messages,
    });
  }

  componentDidMount() {
    //get name from start screen and change title of page to user's name
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    //check if user is online or offline
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');

        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          // Update user state with active user
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
            }
          });

          // Create reference to the active users messages
          this.referenceChatMessages = firebase.firestore().collection('messages');
          // Listen for collection changes
          this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({ isConnected: false })
        // Calls messeages from offline storage
        this.getMessages();
        this.renderInputToolbar();
      }
    });
  }

  componentWillUnmount() {
    if (this.state.isConnected == false) {
    } else {
      // stop online authentication
      this.authUnsubscribe();
      this.unsubscribe();
    }
  }

  //change the color of both chat bubbles
  renderBubble(props) {
    let backgroundColor = this.props.route.params.backgroundColor;
    //black background
    if (backgroundColor === '#090C08') {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: '#66A1CC' },
            left: { backgroundColor: '#C8C8C8' }
          }}
          textProps={{
            left: {
              style: { color: 'black' }
            },
            right: {
              style: { color: 'white' }
            }
          }}
        />
      )
    } else
      //purple background
      if (backgroundColor === '#474056') {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: '#C3A6F7' },
              left: { backgroundColor: '#C8C8C8' }
            }}
            textProps={{
              left: {
                style: { color: 'black' }
              },
              right: {
                style: { color: 'white' }
              }
            }}
          />
        )
      } else
        //blue background
        if (backgroundColor === '#8A95A5') {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: { backgroundColor: '#236487' },
                left: { backgroundColor: '#C8C8C8' }
              }}
              textProps={{
                left: {
                  style: { color: 'black' }
                },
                right: {
                  style: { color: 'white' }
                }
              }}
            />
          )
        } else
          //green background
          if (backgroundColor === '#B9C6AE') {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: { backgroundColor: '#738A60' },
                  left: { backgroundColor: '#e3e3e3' }
                }}
                textProps={{
                  left: {
                    style: { color: 'black' },
                  },
                  right: {
                    style: { color: 'white' }
                  }
                }}
              />
            )
          }
  }

  renderDay(props) {
    return (
      <Day
        {...props}
        textStyle={{ color: 'white' }}
      />
    )
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        textStyle={{ color: 'white' }}
      />
    )
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <View
          style={{
            borderRadius: 13,
            width: 175,
            height: 200,
            margin: 3,
            overflow: 'hidden',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MapView
            style={{
              width: '100%',
              height: '100%'
            }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      );
    }
    return null;
  }


  render() {
    //get name and backgroundColor the user selected on start screen to alter chat view
    let { backgroundColor } = this.props.route.params;

    return (
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <View style={styles.giftedChat}>
          <GiftedChat
            //change the color of the chat bubble
            renderBubble={this.renderBubble.bind(this)}
            //change color of date
            renderDay={this.renderDay.bind(this)}
            //change color of system message
            renderSystemMessage={this.renderSystemMessage.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            isTyping={true}
            isConnected={this.state.isConnected}
            user={this.state.user}
            //custom actions (take photo, select photo, send location)
            renderActions={this.renderCustomActions.bind(this)}
            renderCustomView={this.renderCustomView.bind(this)}
          />
          {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftedChat: {
    flex: 1,
    width: '90%',
    paddingBottom: 20,
    justifyContent: 'center'
  }
});