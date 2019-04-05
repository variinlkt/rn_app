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

export default class Textbox extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            text: '',
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.lpcm',
            token: '',
            audioFileSize: 0,
            audioFileURL: ''
        }
        this.onPressSend = this.onPressSend.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.record = this.record.bind(this)
    }
    componentDidMount(){
        this.getToken()
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            if (!isAuthorised) {
                //TODO: error toast 录音初始化失败
                 
                return;
            }
            this._prepareRecordingPath(this.state.audioPath);
    
            AudioRecorder.onProgress = (data) => {
                //TODO: recording toast：录音中
            };
    
            AudioRecorder.onFinished = ({status, audioFileURL, audioFileSize}) => {
                if(audioFileSize < 20000){
                //TODO: error toast:录音时长过短
                    return
                }
                //TODO: loading toast
                this.setState({
                    audioFileURL,
                    audioFileSize
                })
                this.uploadFile(audioFileURL, audioFileSize)
            };
        });
    }
    async getToken(){//获取access token
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
            //TODO: hide loading toast
            // TODO: toast get token error
            console.log(error)
        }
    }
    getAudioPath(fileUri){//获取录音存储路径
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
            //TODO: hide loading toast
            // TODO: toast record error
            console.log(e)
        }
    }
    async uploadFile(path, fileSize){//上传文件
        try{
            let filePath = this.getAudioPath(path)
            RNFetchBlob.fs.readFile(filePath, 'base64').then(audioData=>{
                RNFetchBlob.fetch('POST', 'https://vop.baidu.com/pro_api', {
                    'Content-Type' : 'application/json',
                }, JSON.stringify({
                    "format":"pcm",
                    "rate":16000,
                    "dev_pid":80001,
                    "channel":1,
                    "token":this.state.token,
                    "cuid":"lamhoit_rn_project",
                    "len":fileSize,
                    "speech":audioData, 
                }))
                .then((resp) => {
                    this.handleData(resp.data)
                })
                .catch((err) => {
                    //TODO: hide loading toast
                    // TODO: toast network error
                    console.log(err)
                })
            }).catch(e=>{
                //TODO: hide loading toast
                    // TODO: toast network error
                console.log(e)
            })

        }catch(e){
            console.log(e)
        }
    }
    async handleData(data){//根据不同errno处理数据
        const{ audioFileURL, audioFileSize } = this.state
        data = JSON.parse(data);
        //TODO: hide loading toast
        switch(data.err_no){
            case 0://成功
                this.showResult(data.result[0])
                //TODO: success toast
                break;
            case 3301://空白语音
                //TODO: error toast - blank audio or low audio quality
                break;
            case 3302://鉴权失败
                //authorization error
                await AsyncStorage.setItem('token', null)
                await this.getToken()
                this.uploadFile(audioFileURL, audioFileSize)
                break;
            default://其他问题
                //TODO: error toast - audio api network error, error code:
                console.log('error code:'+data.err_no)
                break;
        }
    }
    showResult(result){//显示翻译
        this.setState({
            text: result
        })
    }
    _prepareRecordingPath(audioPath){//录音配置
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 16000,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "lpcm"
        });
    }
    onPressSend(){//发送问题
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

            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.log(error);
            //TODO: err toast : record init fail
        }
    }
    async stopRecord(){
        //TODO: hide recording toast
        try {
            const filePath = await AudioRecorder.stopRecording();
            return filePath;
          } catch (error) {
            console.log(error);
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