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
        // justifyContent: 'center',
        flexWrap: 'nowrap',
        marginTop: 16,
        marginBottom: 16
    },
    avatar: {
        width: 50,
        height: 50,
        marginLeft: 10,
        marginRight: 10

    },
    DialogText:{
        width: '80%',
        marginLeft: 6,
        marginRight: 6
    }
});
export default function Dialog(props) {
    let user = require('../assets/img/user.jpg'),
        teacher = require('../assets/img/teacher.jpeg')
    const { avatarType, text } = props
    return (
    <View style={{
        position:'relative',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: avatarType == 'user' ? 'flex-end' : 'flex-start',
        marginTop: 16,
        marginBottom: 16
    }}>
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
                <DialogText text={text} style={styles.DialogText} type={avatarType}>

                </DialogText>
            )
        }
    </View>
    );
}