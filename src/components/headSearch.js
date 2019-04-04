import React, { PureComponent } from 'react';
import { 
  Image, 
  Text, 
  TouchableOpacity, 
  View,
  TextInput,
  StyleSheet
} from 'react-native';
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.3)',
    flex: 1,
    position: 'relative'
  },
  header: {
      height: 88,
      backgroundColor: '#fff',
      zIndex: 100,
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(0,0,0,.1)"
  },
  text: {
      textAlign: 'center',
      fontSize: 26,
      marginTop: 56
  },
  inputArea:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: 6

  },
  iconBtn: {
      display: 'flex',
      width: 30,
      height: 30,
  },
  icon: {
      width: 20,
      height: 20,
      marginRight: 8
  },
  cancel: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 4
  },
  textInput: {
    width: '70%',
  }
});
export default class HeadSearch extends PureComponent {
  constructor(props){
    super(props);
  }
  render() {
    const { subject, onSubmitEditing, onPressCancel } = this.props
    const placeholder = `搜索 ${subject} 学科的历史记录`
    return (
        <View style={styles.header}>
          <View  style={styles.inputArea}>
            <Image source={require('../assets/img/search.png')}
              style={styles.icon}
            ></Image>
            <TextInput placeholder={placeholder}
              autoFocus={true}
              blurOnSubmit={true}
              returnKeyType="search"
              enablesReturnKeyAutomatically={true}
              onSubmitEditing={onSubmitEditing}
              style={styles.textInput}
            ></TextInput>
          </View>
          <TouchableOpacity onPress={onPressCancel} style={styles.iconBtn}>
            <Text style={styles.cancel}>取消</Text>
          </TouchableOpacity>
        </View>
    )
  }
}