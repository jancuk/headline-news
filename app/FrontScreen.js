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
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  ToolbarAndroid,
  Text,
  TextInput,
  View,
} = React;

var TimerMixin = require('react-timer-mixin');
var NewsCell   = require('./NewsCell');
var SearchBar  = require('SearchBar');

var API_URL = "http://api-newstweet.gedrix.net/v1/news/detiksport";
var API_KEYS = [
  'api',
]

var invariant  = require('invariant');
var dismissKeyboard = require('dismissKeyboard');

// Result should be cached keyed by the query
// with value of null = "being fetched"
var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};

var LOADING = {};

var FrontScreen = React.createClass({
  mixins: [TimerMixin],

  timeoutID: (null: any),

  getInitialState: function() {
    return {
      isLoading: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: '',
      queryNumber: 0,
    };
  },

  componentDidMount: function() {
    this.searchNews('');
  },

  _urlForQueryAndPage: function(query: string, pageNumber: number): string {
    var apiKey = API_KEYS[this.state.queryNumber % API_KEYS.length];
    if (query) {
      // soon implemented search by query
      return (
        API_URL
      );
    } else {
      // With no query, load latest news tweet
      return (
        API_URL
      );
    }
  },

  searchNews: function(query: string) {
    this.timeoutID = null;

    this.setState({filter: query});

    var cachedResultsForQuery = resultsCache.dataForQuery[query];
    if (cachedResultsForQuery) {
      if (!LOADING[query]) {
        this.setState({
          dataSource: this.getDataSource(cachedResultsForQuery),
          isLoading: false,
        });
      } else {
        this.setState({isLoading: true});
      }
      return;
    }

    LOADING[query] = true;
    resultsCache.dataForQuery[query] = null;
    this.setState({
      isLoading: true,
      queryNumber: this.setState.queryNumber + 1,
      isLoadingTail: false,
    });

    fetch(this._urlForQueryAndPage(query, 1))
      .then((response) => response.json())
      .catch((error) => {
        LOADING[query] = false;
        resultsCache.dataForQuery[query] = undefined;

        this.setState({
          dataSource: this.getDataSource([]),
          isLoading: false,
        });
      })
      .then((responseData) => {
        LOADING[query] = false,
          resultsCache.totalForQuery[query] = responseData.count;
          resultsCache.dataForQuery[query]  = responseData.data;
          resultsCache.nextPageNumberForQuery[query] = 2;

          if (this.state.filter !== query) {
            // do not update state if the query is stale
            return;
          }

          this.setState({
            isLoading: false,
            dataSource: this.getDataSource(responseData.data),
          });
      })
      .done();
  },

  hasMore: function(): boolean {
    var query = this.state.filter;
    if (!resultsCache.dataForQuery[query]) {
      return true;
    }
    return (
      resultsCache.totalForQuery[query] !==
        resultsCache.dataForQuery[query].length
    );
  },

  onEndReached: function() {
    var query = this.state.filter;
    if(!this.hasMore() || this.state.isLoadingTail) {
      // We're already fetching or have all the elements so noop
      return;
    }

    if (LOADING[query]) {
      return;
    }

    LOADING[query] = true;
    this.setState({
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: true,
    });

    var page = resultsCache.nextPageNumberForQuery[query];
    invariant(page != null, 'Next page number for "%s" is missing', query);
    fetch(this._urlForQueryAndPage(query, page))
      .then((response) => response.json())
      .catch((error) => { 
        console.log(error);
        LOADING[query] = false;
        this.setState({
          isLoadingTail: false,
        });
      })
      .then((responseData) => {
        var newsForQuery = resultsCache.dataForQuery[query].slice();

        LOADING[query] = false;
        // We reached the end of the list before the expected number of results
        if (!responseData.data) {
          resultsCache.totalForQuery[query] = newsForQuery.length;
        } else {
          for (var i in responseData.data) {
            newsForQuery.push(responseData.data[i]);
          }
          resultsCache.dataForQuery[query] = newsForQuery;
          resultsCache.nextPageNumberForQuery[query] += 1;
        }

        if (this.state.filter !== query) {
          return;
        }

        this.setState({
          isLoadingTail: false,
          dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
        });
      })
      .done();
  },

  getDataSource: function(news: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(news);
  },

  selectNews: function(news: Object) {
    dismissKeyboard();
    this.props.navigator.push({
      title: news.title,
      name: 'news',
      news: news
    })
  },

  onSearchChange: function(event: Object) {
    var filter = event.nativeEvent.text.toLowerCase();

    this.clearTimeout(this.timeoutID);
    this.timeoutID = this.setTimeout(() => this.searchNews(filter), 100);
  },

  renderFooter: function() {
    if (!this.hasMore() || !this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }
    if (Platform.OS === 'ios') {
      return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
    } else {
      return (
        <View  style={{alignItems: 'center'}}>
          <ProgressBarAndroid styleAttr="Large"/>
        </View>
      );
    }
  },

  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={style}/>
    );
  },

  renderRow: function(
    news: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ){
    return (
      <NewsCell
        key={news.id}
        onSelect={() => this.selectNews(news)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        news={news}
      />
    );
  },

  render: function() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoNews
        filter={this.state.filter}
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderFooter={this.state.renderFooter}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;

      return (
        <View style={styles.container}>
          <ToolbarAndroid
            actions={[]}
            titleColor='white'
            title='news-tweet' />
          <SearchBar
            onSearchChange={this.onSearchChange}
            isLoading={this.state.isLoading}
            onFocus={() =>
              this.refs.listview && this.refs.listview.getScrollResponder().scrollTo(0,0)}
          />
          <View style={styles.separator} />
            {content}
          </View>
      );
  },

});

var NoNews = React.createClass({
  render: function() {
    var text = '';
    if (this.props.filter) {
      text = `No result for "${this.props.filter}"`;
    } else {
      text = "No News Found";
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noNewsText}>{text}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noNewsText: {
    marginTop: 80,
    color: '#888888',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  toolbar: {
    backgroundColor: 'blue',
    height: 56,
  },
});

module.exports = FrontScreen;
