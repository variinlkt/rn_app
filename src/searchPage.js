import React, { PureComponent } from 'react';
import { 
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight
} from 'react-native';
import HeadSearch from './components/headSearch';
import ResultText from './components/resultText';
import Item from './components/item';
import { getDBData, mapping, decodeSearchResult } from './lib/lib'


export default class SearchPage extends PureComponent {
  static navigationOptions = {
    header: null
  };
  constructor(props){
    super(props);
    this.state = {
      test:'000000',
      list: [
      ]
    }
    this.goBack = this.goBack.bind(this);
    this.onSubmitEditing = this.onSubmitEditing.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._onPress = this._onPress.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
    this._seperator = this._seperator.bind(this);
  }
  goBack(){
    this.props.navigation.goBack();
  }
  onSubmitEditing({nativeEvent}){
    const { navigation } = this.props
    const subject = navigation.getParam('subject')
    console.log(nativeEvent.text)
    const datas = getDBData({
      filters: nativeEvent.text,
      realm: window.realm,
      subject: mapping(subject)
    });
    const list = decodeSearchResult(datas);
    console.log(list)
    this.setState({
      list
    });
  }
  onBlur(){
    this.setState({
      test:'88888'
    })
  }
  goBack(){
    this.props.navigation.goBack();
  }
  _renderItem({item}){
    return(
      <TouchableHighlight
        onPress={() => this._onPress(item)}
        key={item.id}
      > 
        <View style={styles.item}>
          <Item avatarType={item.type} >
            <ResultText text={item.text} type={item.type}></ResultText>
          </Item>
        </View>
      </TouchableHighlight>
    )
  }
  _onPress(item){
    console.log(item)
  }
  _keyExtractor = (item) => item.id;
  _seperator = () => (
    <View style={styles.separatorContainer}>
      <View style={styles.separator}></View>
    </View>
  );
  render() {
    const { navigation } = this.props
    const { list } = this.state
    const subject = navigation.getParam('subject')
    return (
      <View style={styles.container}>
        <HeadSearch
          subject={subject}
          onSubmitEditing={this.onSubmitEditing}
          onPressCancel={this.goBack}
        >
        </HeadSearch>
        <TouchableWithoutFeedback onPress={this.onBlur} style={styles.content}>
          <FlatList
            data={list}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent = {this._seperator}
          ></FlatList>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.3)',
    flex: 1,
    position: 'relative'
  },
  content: {
    flex: 1
  },
  separatorContainer: {
    backgroundColor: '#fff'
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,.1)',
    marginLeft: 15,
    marginRight: 15
  },
  item: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 16
  }
});