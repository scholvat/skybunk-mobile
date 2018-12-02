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

    const totalVotes = props.choices.reduce((a, b) => ({votes: a.votes.concat(b.votes)})).votes.length;
    this.state = {
      choices : props.choices,
      totalVotes: totalVotes,
      multiSelect: false,
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
      if(!this.state.multiSelect && !item.selected){
        //Figure out if the user has already voted
        const hasVoted = this.state.choices
          .reduce((a, b) => ({votes: a.votes.concat(b.votes)}))
          .votes.includes(this.props.loggedInUser._id)
        if(hasVoted) return;
      }
      item.selected = !item.selected;
      var totalVotes = this.state.totalVotes
      if(item.selected && !item.votes.includes(this.props.loggedInUser._id)){
        //user selected a choice
        item.votes.push(this.props.loggedInUser._id)
        totalVotes++;
      }else if(!item.selected && item.votes.includes(this.props.loggedInUser._id)){
        //user deselected a choice
        item.votes.splice(item.votes.indexOf(this.props.loggedInUser._id),1)
        totalVotes--;
      }
      var choices = this.state.choices;

      choices[item.key] = item;
      this.setState({
        choices: choices,
        totalVotes: totalVotes
      });
    }

    var percentage = (item.votes.length/this.state.totalVotes*100).toFixed();
    if(isNaN(percentage)) percentage = '0%'
    else percentage = percentage + '%'

    const color = item.selected ? '#57b947' : '#D3D3D3';
    return (
      <TouchableOpacity onPress={onPress}>
          <View style={styles.choice}>
            <View style={[styles.progressBar, {width: percentage, backgroundColor: color}]}/>
            <Text style={styles.choiceText}>{item.text}</Text>
            <Text style={styles.choiceText}>({item.votes.length}) {percentage}</Text>
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