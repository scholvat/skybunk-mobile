import React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Container, Text, Thumbnail} from 'native-base';
import { Font, AppLoading } from "expo";
import defaultStyles from "../../../styles/styles";
import _ from 'lodash';
import styles from "./WidgetStyle";
import ApiClient from "../../../ApiClient";
import ImageCache from '../../../helpers/imageCache'

export default class NotificationList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      donPictures: []
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.getOnDonProfilePics();
  }

  filterOnDons(users){
    var dons = []
    users.forEach(user =>{
      if(user.role && user.donInfo && user.role.includes("don") && user.donInfo.isOn){
        dons.push(user);
      }
    });
    return dons;
  }

  getOnDonProfilePics(){
    ApiClient.get('/users', {authorized: true})
      .then(users => {
        let dons = this.filterOnDons(users)
        const numDons = dons.length
        console.log(dons[0]._id)
        for(var i=0; i < numDons; i++){
          ImageCache.getProfilePicture(dons[i]._id).then(picture => {
            let donPictures = this.state.donPictures;
            donPictures.push(picture);
            this.setState({
              donPictures: donPictures
            })
          })
        }
        this.setState({
          dons: this.filterOnDons(users)
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getPictureJSX(){
    return _.map(this.state.donPictures, (picture, key) => {
      return (
        <Thumbnail small source={{ uri: `data:image/png;base64,${picture}` }} />
      )
    });
  }

  render() {
    return (
      <View style={defaultStyles.backgroundTheme}>
        <Text style={{fontWeight:'bold', fontSize: 20, ...defaultStyles.primaryColorText}}>Find a Don</Text>
        <View style={{backgroundColor: '#E7E7E7', borderRadius: 10}}>
        <Text>Hi</Text>
        {this.getPictureJSX()}
        </View>
      </View>
    );
  }
}
