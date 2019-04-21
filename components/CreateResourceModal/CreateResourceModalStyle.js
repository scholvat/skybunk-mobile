import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
   modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#00000050',
    minHeight: height*0.3
  },
  view: {
    width: width,
    backgroundColor: '#DDDDDD',
  },
  textBox: {
    width: width-10,
    height: 150,
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
    flex: 1
  },
  button: {
    marginTop: 5,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#71d3d1',
  },
  gestureRecognizer: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  }
}));
