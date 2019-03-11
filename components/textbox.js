import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Keyboard,
    Animated
} from 'react-native';
  
export default class Textbox extends Component {
    constructor(props){
        super(props)
        this.state = {
            text: '',
        }
        this.onPressSend = this.onPressSend.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
    }
    onPressSend(){
        if(!this.state.text.length){
            return Alert.alert(
                '注意',
                '问题不能为空哦',
                [
                  {text: '好', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              )
        }
        this.props.onPress(this.state.text)
        this.setState({
            text: ''
        })
    }
    onChangeText(text){
        this.setState({
            text
        })
    }
    render() {
        return (
        <View style={[styles.textbox, {
            // bottom: 0,
        }]}>
            <TextInput
                style={styles.textInput}
                onChangeText={this.onChangeText}
                value={this.state.text}
                placeholder="请输入问题"
            />
            <TouchableOpacity
                onPress={this.onPressSend}
                style={styles.button}
            >
                <Text style={styles.buttonText}>发送</Text>
            </TouchableOpacity>
        </View >
        );
    }
}
const styles = StyleSheet.create({
    textbox: {
        // position: 'absolute',
        // left: 0,
        display: 'flex',
        width: '100%',
        backgroundColor: '#fff',
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
    },
    textInput: {
        height: 40, 
        borderColor: 'transparent', 
        borderWidth: 1,
        // borderRightColor: 'transparent',
        // borderTopColor: 'transparent',
        // borderLeftColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth:1,
        paddingLeft: 8,
        width: '80%'
    },
    button: {
        display: 'flex',
        position: 'absolute',
        right: 16,
        bottom: 16,
        paddingBottom: 12,
        paddingRight: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center'
    }
});