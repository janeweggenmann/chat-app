# Achievement 5 Project: Chat App
Last Updated: October 12, 2021

## Objective
The objective of this project is to build a chat app for mobile devices using React Native. The app will provide users with a chat interface and options to share images and their location.
 
## Key Features
* A page where users can enter their name and choose a background color for the chat screen before joining the chat.
* A page displaying the conversation, as well as an input field and submit button.
* The chat must provide users with two additional communication features: sending images
and location data.
* Data gets stored online and offline.

## Getting Started
Clone this repository

`git clone https://github.com/janeweggenmann/chat-app.git`

Go to project's root directory

`cd chat-app`

Install dependencies

`npm install`

Set up a <a href='https://firebase.google.com/docs'>Firestore Database<a> and an <a href='https://docs.expo.dev'>Expo account<a>. You will need to replace the firebaseConfig variable in Chat.js with your own database configuration.

Run the project using expo

`expo start`

Scan the QR code with Expo Go (Android) or the Camera app (iOS)
Run on iOS Emulator or Android Studio to test the chat features

## Screenshots
Home Screen
<br>
<img src= 'https://user-images.githubusercontent.com/81497203/136968721-e4afe6b0-9a6f-4f5d-bc51-dc8184428eb2.png' width="400">

There are four color backgrounds to choose from:
<br>
<img src= 'https://user-images.githubusercontent.com/81497203/136968752-e0ef9e4c-d17c-4223-a7c9-583e9469d740.png' width="200">
<img src= 'https://user-images.githubusercontent.com/81497203/136968754-4069a7d0-727d-42a6-8121-435d1896d37c.png' width="200">
<img src= 'https://user-images.githubusercontent.com/81497203/136968759-19daff57-9548-4a89-93ba-4f12c6b68d0e.png' width="200">
<img src= 'https://user-images.githubusercontent.com/81497203/136968762-8a9fda15-fe7c-4989-884f-0636028feafa.png' width="200">

## Dependencies
* expo
* firebase
* netinfo
* prop-types
* react
* react-native
* react-native-async-storage
* react-native-gifted-chat
* react-native-maps

