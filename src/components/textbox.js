import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from "@react-native-community/async-storage"
// import { getToken } from '../lib/lib'

export default class Textbox extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            text: '',
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.lpcm',
            token: ''
        }
        this.onPressSend = this.onPressSend.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.record = this.record.bind(this)
    }
    componentDidMount(){
        this.getToken()
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            // this.setState({ hasPermission: isAuthorised });
            if (!isAuthorised) return;
    
            this._prepareRecordingPath(this.state.audioPath);
    
            AudioRecorder.onProgress = (data) => {
                console.log('recording')
                //TODO: feedback to toast
              console.log(data)
            };
    
            AudioRecorder.onFinished = ({status, audioFileURL, audioFileSize}) => {
                console.log('finish')

                //TODO: read and upload file
                this.uploadFile(audioFileURL)
            };
        });
    }
    async getToken(){
        try {
            const value = await AsyncStorage.getItem('token');
            if (value == null) {
                let data = await fetch('https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=YEttbYGrGUBem5GKAz21D812&client_secret=We5r6044RZz9n5AD1ZQxGjyC7cY5pysU')
                res = (await data.json());
                await AsyncStorage.setItem('token', res.access_token);
            }
            this.setState({
                token: value
            })
        } catch (error) {
            // Error retrieving data
            console.error(error)
        }
    }
    getAudioPath(fileUri){
        //On iOS platform the directory path will be changed 
        //every time you access to the file system. 
        //So if you need read file on iOS, 
        //you need to get dir path first and concat file name with it.
        try{
            let arr = fileUri.split('/')
            const dirs = RNFetchBlob.fs.dirs
            let filePath = `${dirs.DocumentDir}/${arr[arr.length - 1]}`
            return filePath
        }catch(e){
            console.error(e)
        }
    }
    formatUrl(){
        let base = 'https://vop.baidu.com/pro_api'
        let dev_pid = 80001
        let cuid = 'lamhoit_rn_project'
        let token = this.state.token
        return `${base}?dev_pid=${dev_pid}&cuid=${cuid}&token=${token}`
    }
    async uploadFile(path){
        try{
            let filePath = this.getAudioPath(path)
            let url = this.formatUrl()
            let res = await RNFetchBlob.fetch('POST', url, {
                'format': 'pcm',
                'rate': 16000,
                'Content-Type' : 'audio/pcm;rate=16000',
            }, RNFetchBlob.wrap(filePath))
            console.log(res.info().status)
        }catch(e){
            console.error(e)
        }
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