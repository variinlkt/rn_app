import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import DialogText from './dialogText';
const styles = StyleSheet.create({
    container:{
        position:'relative',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginTop: 16,
        // marginBottom: 16,
        // borderColor: '#000',
        // borderWidth: 1
    },
    avatar: {
        width: 50,
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 25
    },
});
export default function Dialog(props) {
    let user = require('../assets/img/user.jpg'),
        teacher = require('../assets/img/teacher.jpeg')
    const { avatarType, text, loading } = props
    return (
    <View style={[styles.container, {
        justifyContent: avatarType == 'user' ? 'flex-end' : 'flex-start',
    }]}>
        {
            avatarType == 'user' && (
                <DialogText text={text} style={styles.DialogText} type={avatarType}>

                </DialogText>
            )
        }
        <Image
            style={styles.avatar}
            source={avatarType == 'user' ? user : teacher}
        />
        {
            avatarType != 'user' && (
                <DialogText text={text} loading={loading} style={styles.DialogText} type={avatarType}>

                </DialogText>
            )
        }
    </View>
    );
}