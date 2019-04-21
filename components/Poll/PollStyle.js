import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
	choice: {
		flex: 1,
		borderWidth: 2,
		marginTop: 2,
		marginBottom: 2,
		borderColor: '#D3D3D3',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	progressBar: {
		width: '50%',
		height:'100%',
		backgroundColor: '#D3D3D3',
		position: 'absolute',
	},
	choiceText: {
		margin: 8
	},
	poll: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 5,
		marginBottom: 5,
		padding: 5,
		backgroundColor: 'white'
	}

}));
