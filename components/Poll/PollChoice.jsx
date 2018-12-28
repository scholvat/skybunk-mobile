import React from 'react';
import Autolink from 'react-native-autolink';
import { FlatList, View, ScrollView, TouchableOpacity, Modal, Alert, Dimensions, TextInput } from 'react-native';
import Image from 'react-native-scalable-image';
import { Body, Card, CardItem, Text, Thumbnail, Button, Icon, Textarea } from 'native-base';
import _ from 'lodash';
import { Font } from "expo";
import date, { isThisHour } from 'date-fns';
import Popover from 'react-native-popover-view';

import CreateResourceModal from '../CreateResourceModal/CreateResourceModal';
import ApiClient from '../../ApiClient';
import styles from "./PollStyle";

export default class PollChoice extends React.Component {

  constructor(props) {
    super(props);

    const totalVotes = (props.choices ?
      props.choices.reduce((a, b) => ({votes: a.votes.concat(b.votes)})).votes.length
      : 0);

    this.state = {
      text : props.choices,
      votes: totalVotes,
      multiSelect: false,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  render() {
    var percentage = (this.state.votes.length/this.props.totalVotes*100).toFixed();
    if(isNaN(percentage)) percentage = '0%'
    else percentage = percentage + '%'

    const color = item.selected ? '#57b947' : '#D3D3D3';

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.choice}>
          <View style={[styles.progressBar, {width: percentage, backgroundColor: color}]}/>
          <Text style={styles.choiceText}>{this.state.text}</Text>
          <Text style={styles.choiceText}>({this.state.votes.length}) {percentage}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}