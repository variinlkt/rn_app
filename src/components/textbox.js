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
import ImagePicker from 'react-native-image-crop-picker';
import Toast from './toast';

export default class Textbox extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            text: '',
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.lpcm',
            audioToken: '',
            imgToken: '',
            audioFileSize: 0,
            audioFileURL: '',
            toastType: 'loading',
            toastDuration: null,
            toastMsg: '',
            toastVisible: false
        }
        this.onPressSend = this.onPressSend.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.record = this.record.bind(this)
        this.hideToast = this.hideToast.bind(this)
        this.stopRecord = this.stopRecord.bind(this)
        this.selectImg = this.selectImg.bind(this)
    }
    componentDidMount(){
        this.getAudioToken()
        this.getImgToken()
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            if (!isAuthorised) {
                this.showToast({
                    msg: '录音初始化失败',
                    type: 'error',
                    duration: 3000
                })
                return;
            }
            this._prepareRecordingPath(this.state.audioPath);
    
            AudioRecorder.onProgress = (data) => {
                this.showToast({
                    msg: '录音中',
                    type: 'recording',
                })
            };
    
            AudioRecorder.onFinished = ({status, audioFileURL, audioFileSize}) => {
                if(audioFileSize < 20000){
                    this.showToast({
                        msg: '录音时长过短',
                        type: 'error',
                        duration: 3000

                    })
                    return
                }
                this.showToast({
                    msg: '转换文字中',
                    type: 'loading',
                })
                this.setState({
                    audioFileURL,
                    audioFileSize
                })
                this.uploadFile(audioFileURL, audioFileSize)
            };
        });
    }
    showToast({msg, type, duration=null}){
        this.setState({
            toastVisible: true,
            toastMsg: msg,
            toastType: type,
            toastDuration: duration
        })
    }
    hideToast(){
        this.setState({
            toastVisible: false
        })
    }
    async getAudioToken(){//获取access token
        try {
            const value = await AsyncStorage.getItem('audioToken');
            if (value == null) {
                let data = await fetch('https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=YEttbYGrGUBem5GKAz21D812&client_secret=We5r6044RZz9n5AD1ZQxGjyC7cY5pysU')
                res = (await data.json());
                await AsyncStorage.setItem('audioToken', res.access_token);
            }
            this.setState({
                audioToken: value
            })
            console.log(value)
        } catch (error) {
            this.showToast({
                msg: '获取语音token失败',
                type: 'error',
                duration: 3000

            })
            console.log(error)
        }
    }
    async getImgToken(){//获取access token
        try {
            const value = await AsyncStorage.getItem('imgToken');
            if (value == null) {
                let data = await fetch('https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=IVGioErzFcpuXV29dtWBrArV&client_secret=eUfRBS89OEWsEtOP06Y28fm4eZqFIoQF')
                res = (await data.json());
                await AsyncStorage.setItem('imgToken', res.access_token);
            }
            this.setState({
                imgToken: value
            })
            console.log(value)
        } catch (error) {
            this.showToast({
                msg: '获取图片token失败',
                type: 'error',
                duration: 3000

            })
            console.log(error)
        }
    }
    getFilePath(fileUri){//获取文件存储路径
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
            this.showToast({
                msg: '获取录音失败',
                type: 'error',
                duration: 3000

            })
            console.log(e)
        }
    }
    async uploadFile(path, fileSize){//上传文件
        let filePath = this.getFilePath(path)
        RNFetchBlob.fs.readFile(filePath, 'base64').then(audioData=>{
            RNFetchBlob.fetch('POST', 'https://vop.baidu.com/pro_api', {
                'Content-Type' : 'application/json',
            }, JSON.stringify({
                "format":"pcm",
                "rate":16000,
                "dev_pid":80001,
                "channel":1,
                "token":this.state.audioToken,
                "cuid":"lamhoit_rn_project",
                "len":fileSize,
                "speech":audioData, 
            }))
            .then((resp) => {
                this.handleAudioData(resp.data)
            })
            .catch((err) => {
                this.showToast({
                    msg: '上传录音失败',
                    type: 'error',
                    duration: 3000
    
                })
                console.log(err)
            })
        }).catch(e=>{
            this.showToast({
                msg: '录音编码失败',
                type: 'error',
                duration: 3000

            })
            console.log(e)
        })
    }
    async handleAudioData(data){//根据不同errno处理数据
        const{ audioFileURL, audioFileSize } = this.state
        data = JSON.parse(data);
        switch(data.err_no){
            case 0://成功
                this.showResult(data.result[0])
                this.showToast({
                    msg: '转换完成',
                    type: 'success',
                    duration: 1000
                })
                break;
            case 3301://空白语音
                this.showToast({
                    msg: '空白录音',
                    type: 'error',
                    duration: 3000
                })
                break;
            case 3302://鉴权失败
                await AsyncStorage.setItem('audioToken', null)
                await this.getToken()
                this.uploadFile(audioFileURL, audioFileSize)
                break;
            default://其他问题
                this.showToast({
                    msg: '转换接口错误',
                    type: 'error',
                    duration: 3000
                })
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
    selectImg(){//
        ImagePicker.openPicker({
            cropping: false
        })
        .then(image => {
            this.setState({
                imgPath: image.path
            })
            this.uploadImg(image.path)

        }).catch(e=>console.log(e))
    }
    uploadImg(path){
        RNFetchBlob.fs.readFile(path, 'base64')
        .then(async imgData=>{
            let encoded = encodeURIComponent(imgData)
            const {imgToken} = this.state
            let url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=' + imgToken
            RNFetchBlob.fetch('POST', url, {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }, `image=${encoded}`
            )
            .then((resp) => {
                this.handleImgData(JSON.parse(resp.data))
            })
            .catch((err) => {
                this.showToast({
                    msg: '上传录音失败',
                    type: 'error',
                    duration: 3000
    
                })
                console.log(err)
            })
        }).catch(e=>console.log(e))
    }
    async handleImgData(data){
        const { words_result_num, words_result, error_code, error_msg } = data
        const { imgData } = this.state
        let res = ''
        if(error_code){
            console.log(error_code, error_msg)
            switch(error_code){
                case 110:
                case 111:
                case 100:
                //token error
                    await AsyncStorage.setItem('imgToken', null)
                    this.getImgToken()
                    this.uploadImg(imgData)
                    break;
                case 216201:
                    this.showToast({
                        msg: '图片格式错误，仅支持PNG、JPG、JPEG、BMP',
                        type: 'error',
                        duration: 3000
                    })
                    break;
                case 216202:
                    this.showToast({
                        msg: '图片过大，请重试',
                        type: 'error',
                        duration: 3000
                    })
                    break;
                case 282810:
                    this.showToast({
                        msg: '图片检测错误，请重试',
                        type: 'error',
                        duration: 3000
                    })
                    break;
                default:
                    this.showToast({
                        msg: '图片转换失败',
                        type: 'error',
                        duration: 3000
                    })
                    break;
            }
            return 
        }
        if(words_result_num){
            words_result.map(result => res += result.words)
            this.setState({
                text: res
            })
            this.showToast({
                msg: '转换完成',
                type: 'success',
                duration: 1000
            })
        }else{
            this.showToast({
                msg: '转换结果为空',
                type: 'error',
                duration: 3000
            })
        }
    }
    onChangeText(text){
        this.setState({
            text
        })
    }
    async record(){
        try {
            this.showToast({
                msg: '录音中',
                type: 'recording',
            })
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.log(error);
            this.showToast({
                msg: '录音失败',
                type: 'error',
                duration: 3000

            })
        }
    }
    async stopRecord(){
        try {
            this.hideToast()
            const filePath = await AudioRecorder.stopRecording();
            return filePath;
          } catch (error) {
            console.log(error);
          }

    }
    render() {
        const { toastType, toastMsg, toastVisible, toastDuration } = this.state
        return (
            <View>
                <Toast
                    type={toastType}
                    duration={toastDuration}
                    msg={toastMsg}
                    visible={toastVisible}
                    handleHideToast={this.hideToast}
                >
                </Toast>
                <View style={[styles.textbox, {
                    // bottom: 0,
                }]}>
                    <TouchableOpacity 
                        onLongPress={this.record} 
                        onPressOut={this.stopRecord}
                    >
                        <Image
                            style={styles.icon}
                            source={require('../assets/img/audio.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={this.selectImg} 
                    >
                        <Image
                            style={styles.icon}
                            source={require('../assets/img/pic.png')}
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
            </View>
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
        width: '70%'
    },
    icon: {
        width: 28,
        height: 28,
        marginRight: 12,
        marginTop: 8
    }
});