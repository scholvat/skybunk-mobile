import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');
import defaultStyles from "../../styles/styles"

export default (styles = StyleSheet.create({
	noMorePosts: {
		textAlign: 'center',
		marginTop: 10,
		marginBottom: 10,
	},
	newPostButton: {
		position:"absolute", 
		zIndex: 1, 
		bottom:40, 
		right:20,
	  ...defaultStyles.primaryColor},
	  noDataView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: height / 3
	  },
	  noDataText: {
		fontSize: 18,
		fontStyle: 'italic',
	  }
}));
