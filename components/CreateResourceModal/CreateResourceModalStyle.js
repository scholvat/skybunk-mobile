import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');
import defaultStyles from '../../styles/styles'

export default (styles = StyleSheet.create({
   modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#00000050'
  },
  view: {
    width: width,
    minHeight: 330,
    maxHeight: height-220,
    backgroundColor: '#DDDDDD',
  },
  poll: {
    width: width-10,
    height: height-350,
  },
  textBox: {
    width: width-10,
    height: 200,
    backgroundColor: '#FFFFFF',
    paddingTop: 5,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#d6d7da',
    marginLeft: 5,
    marginRight: 5,
  },
  buttonGroup: {
    height: 100,
  },
  button: {
    marginTop: 5,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    ...defaultStyles.primaryColor
  },
  gestureRecognizer: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  }
}));
