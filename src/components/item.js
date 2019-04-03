import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';
const styles = StyleSheet.create({
    container:{
        position:'relative',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginTop: 8,
        marginBottom: 8,
    },
    avatar: {
        width: 50,
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 25
    },
});
export default class Item extends PureComponent{
    render(){
        let user = require('../assets/img/user.jpg'),
            teacher = require('../assets/img/teacher.jpeg')
        const { avatarType, children } = this.props
    return (
        <View style={[styles.container, {
            justifyContent: avatarType == 'user' ? 'flex-end' : 'flex-start',
        }]}>
            {
                avatarType == 'user' && children
            }
            <Image
                style={styles.avatar}
                source={avatarType == 'user' ? user : teacher}
            />
            {
                avatarType != 'user' && children
            }
        </View>
        );
    }
}