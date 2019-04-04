import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
const styles = StyleSheet.create({
    box: {
        justifyContent: 'center',
        width: '76%',
    },
    text: {
        fontSize: 16,
    },
});
export default class ResultText extends PureComponent {
    constructor(props){
        super(props)
    }
    render(){
        const { text, type } = this.props
        return (
            <View style={styles.box}>
                <Text
                    ellipsizeMode="tail"
                    style={{
                        textAlign: type == 'user' ? 'right' : 'left'
                    }}
                >{text}</Text>
            </View>
        );
    }
}