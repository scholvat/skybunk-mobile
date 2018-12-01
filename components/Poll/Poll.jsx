import React from 'react';
import Autolink from 'react-native-autolink';
import { FlatList, View, ScrollView, TouchableOpacity, Modal, Alert, Dimensions } from 'react-native';
import Image from 'react-native-scalable-image';
import { Body, Card, CardItem, Text, Thumbnail, Button, Icon } from 'native-base';
import _ from 'lodash';
import { Font } from "expo";
import date, { isThisHour } from 'date-fns';
import Popover from 'react-native-popover-view';

import CreateResourceModal from '../CreateResourceModal/CreateResourceModal';
import ApiClient from '../../ApiClient';
import styles from "./PollStyle";

export default class Poll extends React.Component {

  constructor(props) {
    super(props);

    const totalVotes = props.choices.map(choice => {return choice.votes}).reduce((a, b) => a + b, 0);
    this.state = {
      choices : props.choices,
      totalVotes: totalVotes,
      multiSelect: false
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  sortChoices(choices) {
    sorted = choices.sort((m1, m2) => {
      //sort by # votes, then alphabetically
      if (m1.votes < m2.votes) return 1;
      if (m1.votes > m2.votes) return -1;
      if (m1.text < m2.text) return -1;
      if (m1.text > m2.text) return 1;
      return 0;
    });
    return sorted;
  }

  buildListItems() {
    items = this.state.choices.map(choice => {
      choice.key = this.state.choices.indexOf(choice);
      return choice;
    });
    items = this.sortChoices(items);
    return items;
  }

  renderListItem = ({ item }) => {
    var onPress = () => {
      if(!multiSelect && !item.selected){
        this.state.choices.map()
        
      }else{
        item.selected = !item.selected;
        item.selected ? item.votes++ : item.votes--;
        var choices = ;
        
        choices[item.key] = item
        this.setState({
          choices: choices,
          totalVotes: item.selected ? this.state.totalVotes+1 : this.state.totalVotes-1
        });
      }
    }
    const percentage = (item.votes/this.state.totalVotes*100).toFixed() + '%';
    const color = item.selected ? '#57b947' : '#D3D3D3';
    return (
      <TouchableOpacity onPress={onPress}>
          <View style={styles.choice}>
            <View style={[styles.progressBar, {width: percentage, backgroundColor: color}]}/>
            <Text style={styles.choiceText}>{item.text}</Text>
            <Text style={styles.choiceText}>({item.votes}) {percentage}</Text>
          </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
        <FlatList style={styles.poll}
            data={this.buildListItems()}
            renderItem={this.renderListItem}
        />
    )
  }
}