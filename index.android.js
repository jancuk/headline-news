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

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

var NewsTweet = React.createClass({
  getInitialState: function() {
    return {
      movies: null,
    }
  },
  componentDidMount: function() {
    this.fetchData();
  },
  fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          movies: responseData.movies,
        });
      })
  },
  render: function() {
    if (!this.state.movies) {
      return this.renderLoadingView();
    }
    var movie = this.state.movies[0]
    return this.renderMovie(movie);
  },
  renderMovie: function(movie) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: movie.posters.thumbnail}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.year}>{movie.year}</Text>
        </View>
      </View>
    )
  },
  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading ....
        </Text>
      </View>
    )
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
  year: {
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
