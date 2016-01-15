/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;

var getImageSource = require('./getImageSource');

var DetailNews = React.createClass({
  render: function() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
            * omit a property or set it to undefined if it's inside a shape,
            * even if it isn't required */}
           <Image
            source={getImageSource(this.props.news, 'det')}
            style={styles.detailImage}
          />
          <View style={styles.rightPane}>
            <Text style={styles.newsTitle}>{this.props.news.title}</Text>
            <Retweets news={this.props.news} />
          </View>
        </View>
        <View style={styles.separator} />
        <Text>
          {this.props.news.description}
        </Text>
        <View style={styles.separator} />
      </ScrollView>
    );
  },
});

var Retweets = React.createClass({
  render: function() {
    var retweetTotal = this.props.news.retweet;
    var favoriteTotal = this.props.news.favorite;

    return (
      <View>
        <View>
          <Text>Retweet :  {this.props.news.retweet}</Text>
          <Text>Favorite : {this.props.news.favorite}</Text>
        </View>
      </View>
    );
  },
});


var styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
  },
  rightPane: {
    justifyContent: 'space-between',
    flex: 1,
  },
  newsTitle: {
    flex: 1,
    fontSize: 14,
  },
  retweet: {
    fontSize: 13,
    paddingTop: 10,
  },
  Favorite: {
    fontSize: 20,
  },
  mpaaWrapper: {
    alignSelf: 'flex-start',
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 3,
    marginVertical: 5,
  },
  mpaaText: {
    fontFamily: 'Palatino',
    fontSize: 13,
  },
  mainSection: {
    flexDirection: 'row',
  },
  detailImage: {
    width: 134,
    height: 200,
    backgroundColor: '#eaeaea',
    marginRight: 10,
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },
  castTitle: {
    fontWeight: '500',
    marginBottom: 3,
  },
  castActor: {
    marginLeft: 2,
  },
});

module.exports = DetailNews;
