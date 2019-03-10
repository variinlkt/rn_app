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
  Animated
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
      enableFlatAviod: false,
      marginBottom: 72
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._captureRef = this._captureRef.bind(this)
    this.addMsg = this.addMsg.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
    this._onLayout = this._onLayout.bind(this)
  }
  componentDidMount(){
    let { subject } = this.state
    let timer = setTimeout(()=>{
      this.addMsg({
        type: 'teacher',
        text: `你好，我是${subject}老师，请问有什么可以帮到你？`
      })
    },1000)
    this.dimensionsHeight = Dimensions.get('window').height
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }
  addMsg(msg){
    const { dialogs } = this.state
    if(typeof msg == 'string'){
      this.getData(msg)
      msg = {
        type: 'user',
        text: msg
      }
    }
    this.setState({
      dialogs: dialogs.concat(msg)
    })
    // this._onChangeScrollToIndex()
  }
  openPicker(showStatus){
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
        text: `你好，我是${subject}老师，请问有什么可以帮到你？`
      })
    }
  }
  changeTitle(subject){
    this.setState({
      subject
    })
  }
  
  async getData(msg){
    // 166.111.68.66:8007
    //http://ip/course/inputQuestion
    try{
      let subject = this.mapping(this.state.subject)
      let res = await fetch('http://166.111.68.66:8007/course/inputQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `course=${subject}&inputQuestion=${msg}`
      })
      res = (await res.json())[0]
      console.log(res)

      this.addMsg({
        type: 'teacher',
        text: res.value
      })

    }catch(e){
      console.error(e)
    }
  }
  mapping(subject){
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
  onChangeView(state){
    this.setState({
      enableFlatAviod: state
    })
  }
  _onLayout(e){
    let { height } = e.nativeEvent.layout
    this.listHeight = height
  }
_keyboardDidShow(e){
  // let keyboardHeight = e.endCoordinates.height
  // let restHeight = this.dimensionsHeight - 80 - keyboardHeight - 72
  // console.log(restHeight, this.listHeight)
  // if(restHeight < this.listHeight){//flatlist需要偏移
  //   this._listRef.scrollToOffset({
  //     animated: true, 
  //     offset: (this.listHeight - keyboardHeight)
  //   });

  // }
  // Animated.timing(                       // 随时间变化而执行动画
  //     this.state.marginBottom,            // 动画中的变量值
  //     {
  //       toValue: e.endCoordinates.height + 72 ,                        // 透明度最终变为1，即完全不透明
  //       duration: 300,                   // 让动画持续一段时间
  //     }
  //   ).start();   
  this.setState({
      marginBottom: e.endCoordinates.height + 80
  })
}
_keyboardDidHide(){
  this.setState({
    marginBottom: 80
  })
  // Animated.timing(                       // 随时间变化而执行动画
  //     this.state.marginBottom,            // 动画中的变量值
  //     {
  //       toValue: 72,                        // 透明度最终变为1，即完全不透明
  //       duration: 300,                   // 让动画持续一段时间
  //     }
  // ).start();
    // this._listRef.scrollToOffset({
    //   animated: true, 
    //   offset: 0
    // });
}
  _renderItem({item, index}){
    return <Dialog avatarType={item.type} text={item.text} key={index+item.type}></Dialog>
  }
  // _onChangeScrollToIndex(){
  //   this._listRef.scrollToEnd()
  // }
  _captureRef(ref){
    this._listRef = ref
  }
  render() {
    const { dialogs, list, subject, showStatus, enableFlatAviod, marginBottom } = this.state
    for (var i = 0; i < dialogs.length; i++) {
      dialogs[i]['key'] = i;
   }
    return (
      <View style={styles.container}>
        {/* <KeyboardAvoidingView behavior='position' style={styles.avoidingView}> */}
          <Head list={list} 
            subject={subject} 
            showStatus={showStatus} 
            onOpenPicker={this.openPicker.bind(this, !showStatus)} 
            onChangeTitle={this.changeTitle}>
          </Head>
        {/* </KeyboardAvoidingView>
        <KeyboardAvoidingView behavior='position'> */}
          <FlatList
            data={dialogs}
            renderItem={this._renderItem}
            style={{
              marginBottom,
              backgroundColor:'red'
            }}
            ref={this._captureRef}
            onLayout={this._onLayout}
          />
        {/* </KeyboardAvoidingView>
        <KeyboardAvoidingView behavior='position'> */}
        <KeyboardAvoidingView behavior='position' style={styles.textbox}>

          <Textbox style={styles.textbox}
            onPress={this.addMsg}
            onFocus={this.onChangeView.bind(this, true)}
            onBlur={this.onChangeView.bind(this, false)}
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
    position: 'relative',
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
  // FlatList: {
  //   marginBottom: 80,
  // },
  avoidingView: {
    height: '100%',
    borderColor:'#000',
    borderWidth:1
  }
});

AppRegistry.registerComponent('MyApp', () => MyApp);
