import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Picker,
    View,
    Text,
    TouchableOpacity,
    Modal,
    Image
} from 'react-native';
const styles = StyleSheet.create({
    container:{
        position:'relative'
    },
    header: {
        height: 88,
        backgroundColor: '#fff',
        zIndex: 100,
        position: 'relative',
    },
    picker: {
        position: 'absolute',
        top: 0,
    },
    text: {
        textAlign: 'center',
        fontSize: 26,
        marginTop: 50
    },
    mask: {
        backgroundColor: 'rgba(0,0,0,.3)',
        height: '100%'
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
export default class HeadPicker extends PureComponent {
    constructor(props){
        super(props)
    }
    render() {
        const { subject, list, onOpenPicker, onChangeTitle, showStatus } = this.props
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={showStatus}
            >
                <View style={styles.header}>
                    <Text style={styles.text}
                        onPress={onOpenPicker}
                    >{subject}</Text>
                </View>
                <TouchableOpacity onPress={onOpenPicker} style={{
                        backgroundColor: 'rgba(0,0,0,.3)',
                        height: '100%',
                    }}
                >
                </TouchableOpacity>
                <Picker style={{
                        // display: showStatus,
                        top: 150,
                        height: 200,
                        position: 'absolute',
                        width: '100%',
                        top: 30,
                        backgroundColor: '#fff'
                        // overflow: "hidden"
                    }}
                    selectedValue={subject}
                    onValueChange={onChangeTitle}
                >
                    {
                        list && list.map(pickerItem=>(
                            <Picker.Item label={pickerItem} value={pickerItem} key={pickerItem}/>
                        ))
                    }
                </Picker>
                
            </Modal>
        );
    }
}