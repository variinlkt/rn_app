import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
const styles = StyleSheet.create({
    container:{
        marginLeft: 10,
        marginRight: 10,
        maxWidth: '80%',
        // borderColor: '#000',
        // borderWidth: 1
    },
    box: {
        maxWidth: '100%',
        // height: 50,
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
    }
});
export default function DialogText(props) {
    const { text, type } = props
    return (
    <View style={styles.container}>
        <View style={[styles.box, {
            backgroundColor: type == 'user' ? '#2ecc71' : '#fff',
        }]}>
            <View style={[styles.triangle, {
                [type == 'user' ? 'borderLeftWidth' : 'borderRightWidth']: 10,
                [type == 'user' ? 'borderLeftColor' : 'borderRightColor']: type == 'user' ? '#2ecc71' : '#fff',
                [type == 'user' ? 'right' : 'left']: -10,
            }]}>
            
            </View>
            <Text style={styles.text}>{text}</Text>
        </View>
    </View>
    );
}