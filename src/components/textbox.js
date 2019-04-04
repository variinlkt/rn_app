import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
export default class Textbox extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            text: '',
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.lpcm'
        }
        this.onPressSend = this.onPressSend.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.record = this.record.bind(this)
    }
    componentDidMount(){
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            // this.setState({ hasPermission: isAuthorised });
            if (!isAuthorised) return;
    
            this._prepareRecordingPath(this.state.audioPath);
    
            AudioRecorder.onProgress = (data) => {
                console.log('recording')
                //TODO: feedback to toast
              console.log(data)
            };
    
            AudioRecorder.onFinished = (data) => {
                console.log('finish')

                console.log(data);
            };
        });
    }
    _prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 16000,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "lpcm"
        });
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
    async record(){
        //TODO: show recording toast
        try {
            console.log('begin')
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }
    async stopRecord(){
        //TODO: hide recording toast
        try {
            console.log('end')

            const filePath = await AudioRecorder.stopRecording();
            return filePath;
          } catch (error) {
            console.error(error);
          }

    }
    render() {
        return (
        <View style={[styles.textbox, {
            // bottom: 0,
        }]}>
            <TouchableOpacity onLongPress={this.record} onPressOut={this.stopRecord}
            >
                <Image
                    style={styles.icon}
                    source={require('../assets/img/audio.png')}
                />
            </TouchableOpacity>
            <TextInput
                style={styles.textInput}
                onChangeText={this.onChangeText}
                value={this.state.text}
                placeholder="请输入问题"
                blurOnSubmit={false}
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
        borderBottomColor: 'gray',
        borderBottomWidth:1,
        paddingLeft: 8,
        width: '80%'
    },
    icon: {
        width: 28,
        height: 28,
        marginRight: 12,
        marginTop: 8
    }
});