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

export default class Poll extends React.Component {

  constructor(props) {
    super(props);

    const totalVotes = (props.choices ?
      props.choices.reduce((a, b) => ({votes: a.votes.concat(b.votes)})).votes.length
      : 0);

    this.state = {
      choices : props.choices,
      addOptionText: '',
      totalVotes: totalVotes,
      multiSelect: props.multiSelect,
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
    if(!this.state.choices){
      items = [];
    }
    else{
      items = this.state.choices.map(choice => {
        choice.key = this.state.choices.indexOf(choice).toString();
        return choice;
      });
      items = this.sortChoices(items);
    }
    
    if(this.props.editing) items.push({key:'', isAddOption: true})
    return items;
  }

  onPress(item){
    if(!this.state.multiSelect && !item.selected){
      //Figure out if the user has already voted
      const hasVoted = this.state.choices
        .reduce((a, b) => ({votes: a.votes.concat(b.votes)}))
        .votes.includes(this.props.loggedInUser._id)
      if(hasVoted) return;
    }
    var totalVotes = this.state.totalVotes
    if(!item.selected && !item.votes.includes(this.props.loggedInUser._id)){
      //user selected a choice
      item.votes.push(this.props.loggedInUser._id)
      totalVotes++;
      item.selected = true;
    }else if(item.selected && item.votes.includes(this.props.loggedInUser._id)){
      //user deselected a choice
      item.votes.splice(item.votes.indexOf(this.props.loggedInUser._id),1)
      totalVotes--;
      item.selected = false;
    }

    var choices = this.state.choices;

    choices[item.key] = item;
    this.setState({
      choices: choices,
      totalVotes: totalVotes
    });
  }

  onChange(item, text){
    var choices = this.state.choices;

    //Keep track of previously saved choice to detect if text has changed
    if(!item.previousSavedText) item.previousSavedText = item.text;
    item.text = text;

    choices[item.key] = item;
    this.setState({
      choices: choices
    });
  }

  addItem(){
    newChoices = this.state.choices ? this.state.choices : []
    newChoices.push({'text':this.state.addOptionText, 'votes':[]})
    this.setState({
      choices: newChoices,
      addOptionText: ''
    })
  }

  onUndo(item){
    var choices = this.state.choices;
    item.text = item.previousSavedText;

    choices[item.key] = item;
    this.setState({
      choices: choices
    });
  }
  onConfirmChange(item){
    var choices = this.state.choices;
    item.previousSavedText = item.text;

    choices[item.key] = item;
    this.setState({
      choices: choices
    });
  }
  onRemoveChoice(item){
    this.setState({
      choices: this.state.choices.splice(item.key+1)
    });
  }

  renderListItem = ({ item }) => {
    if(item.isAddOption){
      return (
        <View>
            <View style={styles.choice}>
              <TextInput 
                value = {this.state.addOptionText} 
                style={[styles.choiceText, {flex:1}]} 
                onChangeText={(text) => this.setState({addOptionText: text})}
              />
              <TouchableOpacity onPress={() => {this.addItem()}}>
              <Icon style={{color: '#fc4970'}} type='Feather' name='plus-square' />
              </TouchableOpacity>
            </View>
        </View>
      );
    }

    var percentage = (item.votes.length/this.state.totalVotes*100).toFixed();
    if(isNaN(percentage)) percentage = '0%'
    else percentage = percentage + '%'
    const color = item.selected ? '#57b947' : '#D3D3D3';
    
    if(!this.props.editing){
      return (
        <TouchableOpacity onPress={() => {this.onPress(item)}}>
            <View style={styles.choice}>
              <View style={[styles.progressBar, {width: percentage, backgroundColor: color}]}/>
              <Text style={styles.choiceText}>{item.text}</Text>
              <Text style={styles.choiceText}>({item.votes.length}) {percentage}</Text>
            </View>
        </TouchableOpacity>
      );
    }
    choiceEditted = item.previousSavedText && item.previousSavedText != item.text
      return (
        <View>
            <View style={styles.choice}>
              <View style={[styles.progressBar, {width: percentage, backgroundColor: color}]}/>
              <TextInput 
                style={[styles.choiceText, {flex:1}]} 
                value={item.text} 
                onChangeText={text => {this.onChange(item, text)}}
              />
              {choiceEditted ?
                <View>
                  <TouchableOpacity onPress={() => {this.onUndo(item)}}>
                    <Icon style={{color: '#fc4970'}} type='Feather' name='rotate-ccw' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {this.onConfirmChange(item)}}>
                    <Icon style={{color: '#fc4970'}} type='Feather' name='plus-square' />
                  </TouchableOpacity>
                </View> :
                <View>
                  <TouchableOpacity onPress={() => {this.onRemoveChoice(item)}}>
                    <Icon style={{color: '#fc4970'}} type='Feather' name='minus-square' />
                  </TouchableOpacity>
                </View>
              }
            </View>
        </View>
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