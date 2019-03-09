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
  KeyboardAvoidingView
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
      enableFlatAviod: false
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._captureRef = this._captureRef.bind(this)
    this.addMsg = this.addMsg.bind(this)
  }
  componentDidMount(){
    let { subject } = this.state
    let timer = setTimeout(()=>{
      this.addMsg({
        type: 'teacher',
        text: `你好，我是${subject}老师，请问有什么可以帮到你？`
      })
    },1000)
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
  _renderItem({item, index}){
    return <Dialog avatarType={item.type} text={item.text} key={index+item.type}></Dialog>
  }
  _onChangeScrollToIndex(){
    this._listRef.scrollToEnd()
  }
  _captureRef(ref){
    this._listRef = ref
  }
  render() {
    const { dialogs, list, subject, showStatus, enableFlatAviod } = this.state
    for (var i = 0; i < dialogs.length; i++) {
      dialogs[i]['key'] = i;
   }
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior='position' style={styles.avoidingView}>
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
            style={styles.FlatList}
            ref={this._captureRef}
          />
        {/* </KeyboardAvoidingView>
        <KeyboardAvoidingView behavior='position'> */}
        {/* <KeyboardAvoidingView behavior='position' > */}

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
    bottom: 100,
    left: 0,
    display: 'flex',
    borderColor:'red',
    borderWidth: 2
  },
  FlatList: {
    marginBottom: 80,
    height: '70%'
  },
  avoidingView: {
    height: '100%',
    borderColor:'#000',
    borderWidth:1
  }
});

AppRegistry.registerComponent('MyApp', () => MyApp);
