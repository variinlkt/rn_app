/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import Realm from 'realm';
import React, { PureComponent } from 'react';
import { getDBData, mapping, decodeSearchResult } from './lib/lib'

import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  FlatList
} from 'react-native';
import Head from './components/head';
import Textbox from './components/textbox';
import Dialog from './components/item';
import DialogText from './components/dialogText';
const subjects = [
  "chinese",
  "math",
  "english",
  "biology",
  "history",
  "geo",
  "politics",
  "physics",
  "chemistry",
]
let schema = subjects.map(sub=>{
  return {
    name: sub,
    primaryKey: 'id',
    properties: {
      idx: 'int',
      id: 'string',
      type: 'string',
      text: 'string',
    }
  }
})
let realm = new Realm({
  schema,
  deleteRealmIfMigrationNeeded: true
});
window.realm = realm;
// realm.write(()=>{
//   realm.deleteAll()
// })
export default class IndexPage extends PureComponent {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props)
    this.state = {
      dialogs: [
      ],
      subject: '数学',
      showStatus: false,
      lastChosenSubject: '数学',
      list: [
        "语文",
        "数学",
        "英语",
        "政治",
        "地理",
        "生物",
        "历史",
        "物理",
        "化学"
      ],
      marginBottom: 80,
      realm: null,
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this.pressSearch = this.pressSearch.bind(this)
    this._captureRef = this._captureRef.bind(this)
    this.addMsg = this.addMsg.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
    this._onLayout = this._onLayout.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._keyExtractor = this._keyExtractor.bind(this)
    this._renderFooterCmp = this._renderFooterCmp.bind(this)
  }
  componentDidMount(){
    this.getHistoryMsg()
    //获取屏幕高度
    this.dimensionsHeight = Dimensions.get('window').height
    //监听键盘事件
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }
  clearScreen(){//切换学科时，清空屏幕中的聊天记录
    this.setState({
      dialog: []
    });
  }
  addItemToDB({id, type, text, idx}){//对话写入数据库
    const { subject } = this.state;
    let res = realm.write(()=>{
      realm.create(mapping(subject), {
        id,
        idx,
        type, 
        text,
      })
    });
  }
  addMsg(msg){//添加一个dialog对话框
    /////lock btn
    const { dialogs } = this.state
    let len = dialogs.length
    if(typeof msg == 'string'){//处理用户发的消息
      msg = {
        type: 'user',
        text: msg,
        id: parseInt(Math.random()*1000000)+'',
        idx: len
      }
    }
    this.setState({
      dialogs: dialogs.concat(msg)
    })
    this.addItemToDB(msg);
    let judegeTimer = setTimeout(()=>{
      this.adjustView()
      if(msg.type == 'user'){
        this.getData(msg.text) 
        this.addMsg({
          type: 'teacher',
          loading: true,
          text: '',
          id: parseInt(Math.random()*1000000)+'',
          idx: len+1
        })
      }
    }, 10);//layout获取的高度有延迟
  }
  updateDBMsg({type, id, text, idx}){//改db记录
    const { subject } = this.state
    realm.write(()=>{
      realm.create(mapping(subject), {
        type, 
        id, 
        text,
        idx
      }, true);
    })
  }
  getHistoryMsg(){//获取db中的记录
    let { subject } = this.state
    let datas = getDBData({subject: mapping(subject), realm});
    const dialogs = decodeSearchResult(datas);
    this.setState({
      dialogs
    });
  }
  openPicker(showStatus){//打开或关闭picker
    let { lastChosenSubject, subject } = this.state
    this.setState({
        showStatus
    })
    if(showStatus){//打开picker时，记录上次选择的科目
      this.setState({
        lastChosenSubject: subject
      })
    }else{//关闭picker时，获取历史消息记录
      this.getHistoryMsg()
    }
  }
  changeTitle(subject){//切换学科
    this.setState({
      subject
    })
  }
  cancelLoading(val = '老师也不知道答案哦。'){//获取答案后关闭loading态
    let { dialogs } = this.state,
      len = dialogs.length,
      dialog = dialogs[len-1]

    dialog.loading = false
    dialog.text = val
    this.updateDBMsg(dialog)
    this.setState({
      dialogs
    })
  }
  async getData(msg){//发送请求
    try{
      let subject = mapping(this.state.subject)
      let res = await this._fetchWithTimeout(fetch('http://166.111.68.66:8007/course/inputQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `course=${subject}&inputQuestion=${msg}`
      }))
      res = (await res.json())[0]
      this.cancelLoading(res.value)

    }catch(e){
      console.log(e)
      this.cancelLoading('我不明白你在说什么。请你换一种提问方式或检查网络连接是否正常。')
    }
  }
  pressSearch(){//搜索聊天记录
    this.props.navigation.push('Search', {
      subject: this.state.subject
    });
  }
  adjustView(height){//处理键盘弹出和发送消息时,让list偏移的情况
    (typeof height == 'number') && this.setState({
      marginBottom: height
    })
    setTimeout(()=>this._listRef.scrollToEnd(), 100)
  }
  _fetchWithTimeout(fetch, timeout=10000){//封装fetch，添加timeout
    return Promise.race([
      fetch,
      new Promise((resolve, reject)=>{
        let timer = setTimeout(() => {
          reject('fetch timeout!')
        }, timeout);
      })
    ])
  }
  _onLayout(e){//获取list的高度
    let { height } = e.nativeEvent.layout
    this.listHeight = height
  }
  _keyboardDidShow(e){//键盘显示
    this.keyboardHeight = e && e.endCoordinates.height
    this.adjustView(this.keyboardHeight + 72)
  }
  _keyboardDidHide(){//键盘收起
    this.keyboardHeight = 0
    this.adjustView(72)

  }
  _captureRef(ref){
    this._listRef = ref
  }
  _renderFooterCmp(){
    let {marginBottom} = this.state
    return(
      <View style={{
        height: marginBottom
      }}
      >
      </View>
    )
  }
  _renderItem({item}){
    return(
      <View style={styles.item}>
        <Dialog avatarType={item.type} key={item.id}>
          <DialogText text={item.text} loading={item.loading} type={item.type}></DialogText>
        </Dialog>
      </View>
    )
  }
  _keyExtractor = (item) => item.id;
  render() {
    const { dialogs, list, subject, showStatus } = this.state
    return (
      <View style={styles.container}>
          <Head list={list} 
            subject={subject} 
            showStatus={showStatus} 
            onOpenPicker={this.openPicker.bind(this, !showStatus)} 
            onChangeTitle={this.changeTitle}
            onPressSearch={this.pressSearch}
          >
          </Head>
          <FlatList
            data={dialogs}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            style={{}}
            ref={this._captureRef}
            ListFooterComponent={this._renderFooterCmp}
          ></FlatList>
          <KeyboardAvoidingView behavior='position' style={styles.textbox}>

            <Textbox style={styles.textbox}
              onPress={this.addMsg}
            >
            </Textbox>  
          </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
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
  textbox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  },
  avoidingView: {
    height: '100%',
    borderColor:'#000',
    borderWidth: 1
  }
});

