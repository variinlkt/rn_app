import React, { PureComponent } from 'react';
import { 
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableHighlight
} from 'react-native';
import HeadSearch from './components/headSearch';
import ResultText from './components/resultText';
import Item from './components/item';
import { getDBData, mapping, decodeSearchResult } from './lib/lib'
import Toast from './components/toast';

export default class SearchPage extends PureComponent {
  static navigationOptions = {
    header: null
  };
  constructor(props){
    super(props);
    this.state = {
      list: [
      ]
    }
    this.goBack = this.goBack.bind(this);
    this.onSubmitEditing = this.onSubmitEditing.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
    this._seperator = this._seperator.bind(this);
    this.hideToast = this.hideToast.bind(this);
  }
  onSubmitEditing({nativeEvent}){
    this.showToast({
      msg: '搜索中',
      type: 'loading'
    })

    try{
      const { navigation } = this.props
      const subject = navigation.getParam('subject')
      const datas = getDBData({
        filters: nativeEvent.text,
        realm: window.realm,
        subject: mapping(subject)
      });
      this.hideToast()
      const list = decodeSearchResult(datas);
      !list.length && this.showToast({

        msg:'搜索结果为空',
        type:'success',
        duration: 3000
      })
  
      this.setState({
        list
      });
    }catch(e){
      this.showToast({

        msg:'搜索出错',
        type:'error',
        duration: 3000
      })
    }
  }
  showToast({msg, type, duration=null}){
    this.setState({
      toastVisible: true,
      toastMsg: msg,
      toastType: type,
      toastDuration: duration
    })
  }
  hideToast(){
    this.setState({
      toastVisible: false
    })
  }
  goBack(){
    this.props.navigation.goBack();
  }
  _renderItem({item}){
    return(
      <TouchableHighlight
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
  _keyExtractor = (item) => item.id;
  _seperator = () => (
    <View style={styles.separatorContainer}>
      <View style={styles.separator}></View>
    </View>
  );
  render() {
    const { navigation } = this.props
    const { list, toastType, toastDuration, toastMsg, toastVisible } = this.state
    const subject = navigation.getParam('subject')
    return (
      <View style={styles.container}>
        <Toast
          type={toastType}
          duration={toastDuration}
          msg={toastMsg}
          visible={toastVisible}
          handleHideToast={this.hideToast}
        ></Toast>
        <HeadSearch
          subject={subject}
          onSubmitEditing={this.onSubmitEditing}
          onPressCancel={this.goBack}
        >
        </HeadSearch>
        <TouchableWithoutFeedback style={styles.content}>
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