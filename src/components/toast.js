import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    Image,
    Animated,
    Easing
} from 'react-native';

export default class Toast extends Component {
    constructor(props){
        super(props)
        this.state = {
            degree: new Animated.Value(0), 
        }
    }
    // componentDidMount() {
    //     const{ type } = this.props
    //     if(type != 'loading'){
    //         return;
    //     }
    //     let animation = Animated.timing(                       
    //       this.state.degree,           
    //       {
    //         toValue: 360,                        
    //         duration: 1200, 
    //         easing: Easing.inOut(Easing.linear)
    //       }
    //     )
    //     Animated.loop(animation).start();  
    // }
    componentDidUpdate(){
        const{ type, duration, handleHideToast } = this.props
        if(type == 'loading'){
            let animation = Animated.timing(                       
                this.state.degree,           
                {
                  toValue: 360,                        
                  duration: 1200, 
                  easing: Easing.inOut(Easing.linear)
                }
              )
              Animated.loop(animation).start();  
        }
        if(duration){
            let timer = setTimeout(() => {
                handleHideToast()
            }, duration);
        }
    }
    render() {
        const { degree } = this.state
        const { msg='', type='loading', visible=false } = this.props
        //type: 'success' | 'error' | 'loading' | 'recording'
        const iconType = {
            'success': require('../assets/img/success.png'),
            'error': require('../assets/img/failure.png'),
            'loading': require('../assets/img/loading_toast.png'),
            'recording': require('../assets/img/recording.png')
        }
        return (
            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
            >
                <View style={styles.container}>
                    <View style={styles.view}>
                    {
                        type == 'loading' && (
                            <Animated.Image source={iconType[type]}
                                style={{
                                    transform: [{
                                        rotate: degree.interpolate({
                                            inputRange: [0, 360],
                                            outputRange: ['0deg', '360deg']
                                        })
                                    }]
                                }}
                            >
                            </Animated.Image>
                        )
                    }
                    { 
                        type != 'loading' && <Image style={styles.icon} source={iconType[type]}></Image>
                    }
                        <Text style={styles.text}>
                            {msg}
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view:{
        width: '30%',
        backgroundColor: 'rgba(0,0,0,.3)',
        padding: 16,
        alignItems: 'center',
        borderRadius: 10
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 8,
        color: '#fff'
    },
    icon: {
        width: 32,
        height: 32,
    }
});