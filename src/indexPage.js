/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import Realm from 'realm';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  ScrollView
} from 'react-native';
import Head from './components/head';
import Textbox from './components/textbox';
import Dialog from './components/dialog';

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
      id: 'int',
      type: 'string',
      text: 'string',
    }
  }
})
let realm = new Realm({
  schema,
  deleteRealmIfMigrationNeeded: true
});
// realm.write(()=>{
//   realm.deleteAll()
// })
export default class IndexPage extends Component {
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
      realm: null
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this.pressSearch = this.pressSearch.bind(this)
    this._captureRef = this._captureRef.bind(this)
    this.addMsg = this.addMsg.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
    this._onLayout = this._onLayout.bind(this)
    this.scrollToEnd = this.scrollToEnd.bind(this)
  }
  componentDidMount(){
    // let timer = setTimeout(()=>{
    //   this.addMsg({
    //     type: 'teacher',
    //     text: `你好，我是${subject}老师，请问有什么可以帮到你？`,
    //     subject: this.mapping(subject)
    //   })
    // },1000)
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
  getDBData({subject, filters}){//获取db中的聊天记录
    let data = realm.objects(subject);
    if(filters){
      data = data.filtered('text like "%'+filters+'%"');
    }
    // data.map(item=>console.log(item))
    return data;
  }
  addItemToDB({id, type, text}){//对话写入数据库
    const { subject } = this.state;
    let res = realm.write(()=>{
      realm.create(this.mapping(subject), {
        id,
        type, 
        text
      })
    });
  }
  addMsg(msg){//添加一个dialog对话框
    /////lock btn
    const { dialogs } = this.state
    if(typeof msg == 'string'){//处理用户发的消息
      msg = {
        type: 'user',
        text: msg,
        id: parseInt(Math.random()*1000000)
      }
    }
    this.setState({
      dialogs: dialogs.concat(msg)
    })
    this.addItemToDB(msg);
    let judegeTimer = setTimeout(()=>{
      this.judgeOffset()
      if(msg.type == 'user'){
        this.getData(msg.text) 
        this.addMsg({
          type: 'teacher',
          loading: true,
          text: '',
          id: parseInt(Math.random()*1000000)
        })
      }
    }, 10);//layout获取的高度有延迟
  }
  updateDBMsg({type, id, text}){//改db记录
    const { subject } = this.state
    realm.write(()=>{
      realm.create(this.mapping(subject), {type, id, text}, true);
    })
  }
  getHistoryMsg(){//获取db中的记录
    let { subject } = this.state
    let datas = this.getDBData({subject: this.mapping(subject)});
    let dialogs = [];
    for (let {type, text, id} of datas) {
      dialogs.push({type, text, id})
    }
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
      let subject = this.mapping(this.state.subject)
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
      console.error(e)
      this.cancelLoading('我不明白你在说什么。请你换一种提问方式或检查网络连接是否正常。')
    }
  }
  pressSearch(){//搜索聊天记录
    console.log(333)
    this.props.navigation('Search', { name: 'Jane' });
  }
  mapping(subject){//中文学科名对应的英文，用于请求
    const subjectMap = {
      "语文": "chinese",
      "数学": "math",
      "英语": "english",
      "生物": "biology",
      "历史": "history",
      "地理": "geo",
      "政治": "politics",
      "物理": "physics",
      "化学": "chemistry",
    }
    return subjectMap[subject]
  }
  judgeOffset(){//判断list是否需要偏移
    let restHeight = this.dimensionsHeight - 80 - (this.keyboardHeight || 0) - 72
    console.log('judge', restHeight,this.listHeight)//744 531
    if(restHeight < this.listHeight){//list需要偏移
      this.scrollToEnd()
    }
  }
  judgeOffsetWhenKeyboardHide(){//判断list高度是否大于scrollview
    let scrollViewHeight = this.dimensionsHeight - 160
    let distance = this.listHeight - scrollViewHeight
    if(distance > 0){
      return this._listRef.scrollTo({
        y: distance,
        animated: true
      })
    }
    this._listRef.scrollTo({
      y: 0,
      animated: true
    })
  }
  scrollToEnd(){//处理键盘弹出和发送消息时,让list偏移的情况
    let offset = 160+(this.keyboardHeight || 0)+this.listHeight-this.dimensionsHeight
    this._listRef.scrollTo({
      animated: true, 
      y: offset
    });
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
    this.setState({
      marginBottom: this.keyboardHeight + 80
    })
    this.judgeOffset()
  }
  _keyboardDidHide(){//键盘收起
    this.keyboardHeight = 0
    this.setState({
      marginBottom: 80
    })
    this.judgeOffsetWhenKeyboardHide()

  }
  _captureRef(ref){
    this._listRef = ref
  }
  render() {
    const { dialogs, list, subject, showStatus, marginBottom } = this.state
    console.log(dialogs)
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
          <ScrollView
            ref={this._captureRef}
            style={{
              marginBottom
            }}
          >
            <View 
            onLayout={this._onLayout}
            >
              {
                (dialogs.length > 0) && dialogs.map((item,index)=>(
                  <Dialog avatarType={item.type} loading={item.loading} text={item.text} key={index+item.type}></Dialog>
                ))
              }
            </View>
          </ScrollView>
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
    borderWidth:1
  }
});

