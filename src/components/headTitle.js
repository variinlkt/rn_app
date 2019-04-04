import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';

const styles = StyleSheet.create({
    header: {
        height: 88,
        backgroundColor: '#fff',
        zIndex: 100,
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,.1)"
    },
    text: {
        textAlign: 'center',
        fontSize: 26,
        marginTop: 50
    },
    iconBtn: {
        position: 'absolute',
        top: 46,
        right: 20,
        display: 'flex',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 24,
        height: 24,
    }
});
export default class HeadTitle extends PureComponent {
    constructor(props){
        super(props)
    }
    render() {
        const { subject, onOpenPicker, onPressSearch } = this.props
        return (
            <View style={styles.header}>
                <Text style={styles.text}
                    onPress={onOpenPicker}
                >
                {subject}
                </Text>
                <TouchableOpacity onPress={onPressSearch} style={styles.iconBtn}>
                    <Image source={require('../assets/img/search.png')}
                        style={styles.icon}
                    ></Image>
                </TouchableOpacity>
            </View>
        );
    }
}