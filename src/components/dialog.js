import React, { PureComponent } from 'react';
import {
    StyleSheet,
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
    },
    avatar: {
        width: 50,
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 25
    },
});
export default class Dialog extends PureComponent{
    render(){
        let user = require('../assets/img/user.jpg'),
            teacher = require('../assets/img/teacher.jpeg')
        const { avatarType, text, loading } = this.props
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
}