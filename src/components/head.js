import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import HeadPicker from './headPicker';
import HeadTitle from './headTitle';
const styles = StyleSheet.create({
    container:{
        position:'relative',
        backgroundColor: 'red',

    },
    header: {
        height: 88,
        backgroundColor: '#fff',
        zIndex: 100,
        position: 'relative',
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
    },
    icon: {
        width: 30,
        height: 30,
    }
});
export default class Head extends PureComponent {
    constructor(props){
        super(props)
    }
    render() {
        const { subject, list, onOpenPicker, onChangeTitle, showStatus, onPressSearch } = this.props
        return (
            <View style={styles.container}>
                <HeadTitle
                    subject={subject}
                    onOpenPicker={onOpenPicker}
                    onPressSearch={onPressSearch}
                >
                </HeadTitle>
                <HeadPicker
                    subject={subject}
                    list={list}
                    onOpenPicker={onOpenPicker}
                    onChangeTitle={onChangeTitle}
                    showStatus={showStatus}
                >
                </HeadPicker>
            </View>
        );
    }
}