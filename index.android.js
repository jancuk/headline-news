/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  ToolbarAndroid,
  Image,
  StyleSheet,
  Text,
  View,
} = React;

var MOCKED_MOVIES_DATA = [
  {title: 'Title', summary: 'summary of contents', image_url: 'http://i.imgur.com/banner/logo-telkomsel-kcl.png'}
];

var NewsTweet = React.createClass({
  render: function() {
    var movie = MOCKED_MOVIES_DATA[0];
    return (
      <View style={styles.container}>
        <Image
          source={{uri: movie.image_url}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.summary}>{movie.summary}</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  rightContainer: {
    flex: 1
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8
  }, 
  summary: {
    textAlign: 'center'
  },
  thumbnail:{
    width: 55,
    height: 100
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('NewsTweet', () => NewsTweet);
