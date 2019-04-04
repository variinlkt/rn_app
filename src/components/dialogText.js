import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity
} from 'react-native';
const styles = StyleSheet.create({
    container:{
        marginLeft: 10,
        marginRight: 10,
        maxWidth: '76%',
    },
    box: {
        maxWidth: '100%',
        position: 'relative',
        borderRadius: 10,
        padding: 10,
        overflow: 'visible'
    },
    triangle: {
        width: 0,
        height: 0,
        borderColor: 'transparent',
        borderTopWidth: 7,
        borderBottomWidth: 7,
        position: 'absolute',
        top: 10,
    },
    text: {
        fontSize: 20
    },
    image: {
        width: 24,
        height: 24,
    }
});
export default class DialogText extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            degree: new Animated.Value(0), 
        }
    }
    componentDidMount() {
        let animation = Animated.timing(                       
          this.state.degree,           
          {
            toValue: 360,                        
            duration: 700, 
          }
        )
        Animated.loop(animation).start();                           
    }
    render(){
        let { degree } = this.state
        const { text, type, loading } = this.props
        return (
        <TouchableOpacity style={styles.container}>
            <View style={[styles.box, {
                backgroundColor: type == 'user' ? '#2ecc71' : '#fff',
            }]}>
                <View style={[styles.triangle, {
                    [type == 'user' ? 'borderLeftWidth' : 'borderRightWidth']: 10,
                    [type == 'user' ? 'borderLeftColor' : 'borderRightColor']: type == 'user' ? '#2ecc71' : '#fff',
                    [type == 'user' ? 'right' : 'left']: -10,
                }]}>
                </View>
                {
                    loading && (
                        <Animated.Image source={require('../assets/img/loading.png')} 
                            style={[styles.image, {
                                transform: [{
                                    rotate: degree.interpolate({
                                        inputRange: [0, 360],
                                        outputRange: ['0deg', '360deg']
                                    })
                                }]
                            }]}>
                        </Animated.Image>
                    )
                }
                {
                    !loading && <Text selectable={true} style={styles.text}>{text}</Text>
                }
            </View>
        </TouchableOpacity>
        );
    }
}