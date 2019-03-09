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
  View
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
      ]
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.openPicker = this.openPicker.bind(this)

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
    this.setState({
      dialogs: dialogs.concat(msg)
    })
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
  render() {
    const { dialogs, list, subject, showStatus } = this.state
    return (
      <View style={styles.container}>
        <Head list={list} subject={subject} showStatus={showStatus} onOpenPicker={this.openPicker.bind(this, !showStatus)} onChangeTitle={this.changeTitle}></Head>
        <View style={styles.dialogArea}>
        {
          (dialogs.length > 0) && dialogs.map((dialog, key)=>(
            <Dialog avatarType={dialog.type} text={dialog.text} key={key+dialog.type}></Dialog>
          ))
        }

        </View>
        <Textbox style={styles.textbox}></Textbox>
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
  dialogArea: {
    
  }
});

AppRegistry.registerComponent('MyApp', () => MyApp);
