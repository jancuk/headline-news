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
  StyleSheet,
  View,
  Text
} = React;

var FrontScreen = require('./app/FrontScreen');
var DetailNews  = require('./app/DetailNews');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigateOperations, onComponentRef) {
  _navigator = navigateOperations;
  if (route.name === 'home') {
    return (
      <FrontScreen navigator={navigateOperations} />
    )
  } else if (route.name === 'news') {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!android_back_white')}
          onIconClicked={navigateOperations.pop}
          style={styles.toolbar}
          titleColor="blue"
          title={route.news.title} />
        <DetailNews
          style={{flex: 1}}
          navigator={navigateOperations}
          news={route.news}
        />
      </View>
    );
  }
};

var NewsTweet = React.createClass({
  render: function() {
    var initialRoute = {name: 'home'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
});

AppRegistry.registerComponent('NewsTweet', () => NewsTweet);

module.exports = NewsTweet;
