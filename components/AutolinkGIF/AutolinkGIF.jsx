import React from 'react';
import Autolink from 'react-native-autolink';
import {Image } from 'react-native';

export default class AutolinkGIF extends Autolink{
	renderGIF(text, match, index, textProps) {
	  return (
		<Image source={{uri: match.url}} style={{width: 300, height: 300}} />
	  );
	}
	renderLink(text, match, index, textProps){
	  if(text.endsWith('.gif')){return this.renderGIF(text, match, index, textProps);}
	  return super.renderLink(text, match, index, textProps)
	}
  }