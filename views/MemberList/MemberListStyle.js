import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get('window');
import defaultStyles from '../../styles/styles'

export default (styles = StyleSheet.create({
  noMoreUsers: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  editProfileButton: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingLeft: 15, 
    paddingVertical: 10, 
    backgroundColor: 'rgba(196, 196, 196, 0.3);'
  },
  editProfileText: {
    marginLeft: 20, 
    fontSize: 16, 
    fontFamily: 'System'
  }
}));