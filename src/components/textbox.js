import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
  
export default class Textbox extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            text: '',
        }
        this.onPressSend = this.onPressSend.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
    }
    onPressSend(){
        let {text} = this.state
        this.props.onPress(text)
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
                blurOnSubmit={true}
                returnKeyType="send"
                enablesReturnKeyAutomatically={true}
                onSubmitEditing={this.onPressSend}
            />
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
        justifyContent: 'center',
        flexDirection: 'row'
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
});