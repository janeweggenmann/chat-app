import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, Day, SystemMessage } from 'react-native-gifted-chat';
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
      loggedInText: "Logging in...",
      user: {
        _id: "",
        name: "",
      },
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //references the messages collection in the forestore app
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.referenceMessageUser = null;
  }

  componentDidMount() {
    //get name from start screen and change title of page to user's name
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        }
      });

      // Reference only the messages of active user
      this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

    //set a system message when user enters the chat
    this.setState({
      messages: [
        {
          _id: 2,
          text: `${name} has entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  // Add messages to database
  addMessages() {
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: message.user,
    });
  }

  //when a user hits send, append the new message to the messages state object
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      // Add messages from addMessages function so they are saved to the server
      () => {
        this.addMessages();
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
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
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

  render() {
    //get name and backgroundColor the user selected on start screen to alter chat view
    let { backgroundColor } = this.props.route.params;

    return (
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <View style={styles.giftedChat}>
          <GiftedChat
            //change the color of the chat bubble
            renderBubble={this.renderBubble.bind(this)}
            renderDay={this.renderDay.bind(this)}
            renderSystemMessage={this.renderSystemMessage.bind(this)}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            isTyping={true}
            user={this.state.user}
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  giftedChat: {
    flex: 1,
    width: '88%',
    paddingBottom: 10,
  }
});