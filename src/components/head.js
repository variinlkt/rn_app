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
        height: 80,
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
        marginTop: 40
    },
    mask: {
        backgroundColor: 'rgba(0,0,0,.3)',
        height: '100%'
    },
    icon: {
        position: 'absolute',
        top: 40,
        right: 20,
        display: 'flex',
        width: 30,
        height: 30
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
                <View style={styles.header}>
                    <Text style={styles.text}
                        onPress={onOpenPicker}
                    >
                    {subject}
                    </Text>
                    <Image source={require('../assets/img/search.png')}
                        style={styles.icon}
                        onPress={onPressSearch}
                    ></Image>
                </View>
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
            </View>
        );
    }
}