import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Thumbnail } from 'native-base';
import styles from './ToolbarStyle';

export default function(props) {
	return (
		<View style={styles.view}>
			<TouchableOpacity onPress={props.takeImage}>
				<Icon style={styles.icon} type='MaterialIcons' name='add-a-photo' />
			</TouchableOpacity>
			<TouchableOpacity onPress={props.pickImage}>
			<Icon style={styles.icon} type='MaterialIcons' name='photo' />
		  	</TouchableOpacity>
			  <TouchableOpacity onPress={props.createPoll}>
			<Icon style={styles.icon} type='MaterialIcons' name='poll' />
		  	</TouchableOpacity>
			  {props.image ? <Thumbnail square source={{ uri: props.image }} style={styles.image}/> : null }
			<TouchableOpacity onPress={props.closeModal} style={styles.closeButton}>
				<Icon style={styles.icon} type='MaterialIcons' name='close' />
		  	</TouchableOpacity>
		</View>
	);
}