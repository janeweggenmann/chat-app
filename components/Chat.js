import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default class Chat extends React.Component {
  render() {
    let { name, backgroundColor } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <Text style={styles.text}>Hello, {name}!</Text>
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
  text: {
    color: 'white'
  }
});