/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  Animated,
  ScrollView
} from 'react-native';
import Head from './components/head';
import Textbox from './components/textbox';
import Dialog from './components/dialog';

export default class MyApp extends Component {
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
      marginBottom: 80
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this._captureRef = this._captureRef.bind(this)
    this.addMsg = this.addMsg.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
    this._onLayout = this._onLayout.bind(this)
    this.scrollToEnd = this.scrollToEnd.bind(this)
  }
  componentDidMount(){
    let { subject } = this.state
    let timer = setTimeout(()=>{
      this.addMsg({
        type: 'teacher',
        text: `你好，我是${subject}老师，请问有什么可以帮到你？`,
        subject: this.mapping(subject)

      })

    },1000)
    //获取屏幕高度
    this.dimensionsHeight = Dimensions.get('window').height
    //监听键盘事件
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }
  addMsg(msg){//添加一个dialog对话框
    const { dialogs } = this.state
    if(typeof msg == 'string'){//处理用户发的消息
      msg = {
        type: 'user',
        text: msg
      }
    }
    this.setState({
      dialogs: dialogs.concat(msg)
    })
    let judegeTimer = setTimeout(()=>this.judgeOffset(), 10);//layout获取的高度有延迟
    msg.type == 'user' && this.getData(msg.text)

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
    }else{//关闭picker时，如果当前选择的科目跟上次的一样，就不发新消息
      (lastChosenSubject != subject) && this.addMsg({
        type: 'teacher',
        text: `你好，我是${subject}老师，请问有什么可以帮到你？`,

      })
    }
  }
  changeTitle(subject){//切换学科
    this.setState({
      subject
    })
  }
  _fetchWithTimeout(fetch, timeout=10000){
    return Promise.race([
      fetch,
      new Promise((resolve, reject)=>{
        let timer = setTimeout(() => {
          reject('fetch timeout!')
        }, timeout);
      })
    ])
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
      this.addMsg({
        type: 'teacher',
        text: res.value || '老师也不知道答案哦。',

      })

    }catch(e){
      console.log(e)
      this.addMsg({
        type: 'teacher',
        text: '我不明白你在说什么。请你换一种提问方式或检查网络连接是否正常。',

      })
    }
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
    // let srollViewHeight = this.dimensionsHeight - 152
    let offset = 160+(this.keyboardHeight || 0)+this.listHeight-this.dimensionsHeight
    console.log(this.listHeight, offset)
    this._listRef.scrollTo({
      animated: true, 
      y: offset
    });
  }
  _onLayout(e){//获取list的高度
    let { height } = e.nativeEvent.layout
    this.listHeight = height
    console.log(height)
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
  _captureRef(ref){//ref
    this._listRef = ref
  }
  render() {
    const { dialogs, list, subject, showStatus, marginBottom } = this.state
    return (
      <View style={styles.container}>
          <Head list={list} 
            subject={subject} 
            showStatus={showStatus} 
            onOpenPicker={this.openPicker.bind(this, !showStatus)} 
            onChangeTitle={this.changeTitle}>
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
                  <Dialog avatarType={item.type} text={item.text} key={index+item.type}></Dialog>
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
  // scrollView: {
  //   marginBottom: 80,
  // },
  avoidingView: {
    height: '100%',
    borderColor:'#000',
    borderWidth:1
  }
});

AppRegistry.registerComponent('MyApp', () => MyApp);
