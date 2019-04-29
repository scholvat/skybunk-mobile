import React from 'react';
import { StatusBar, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Spinner, Footer, Thumbnail} from 'native-base';
import ChannelList from "../../components/ChannelList/ChannelList";
import NotificationList from "../../components/NotificationList/NotificationList";
import HomeTabBar from "./HomeTabBar/HomeTabBar";
import WidgetList from "../../components/WidgetList/WidgetList"
import styles from "./HomeStyle";
import ApiClient from '../../ApiClient';
import ImageCache from '../../helpers/imageCache'
import { Font} from "expo";
import { Notifications } from 'expo';
import _ from 'lodash';

export default class HomeView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      get headerRight() {
          return (
            <TouchableOpacity onPress={() => {navigation.navigate('Settings', { user: navigation.getParam('user') }) }}>
              <Image source={require('../../assets/settings-with-word-icon.png')} style={styles.settingsIcon} />
            </TouchableOpacity>
          )
      },
      get headerLeft() {
        if(!navigation.getParam('profilePic')){
          return null;
        }
        return (
          <TouchableOpacity 
            hitSlop={{ top: 10, bottom: 10, left: 0, right: 40 }} 
            onPress={() => {navigation.navigate('MemberList', {user: navigation.getParam('user')}); }}>
            <Thumbnail
                  small
                  style={styles.profilePicThumbnail}
                  source={{ uri: `data:image/png;base64,${navigation.getParam('profilePic')}` }}
            />
          </TouchableOpacity>
        )
    }
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      channels: [],
      user: props.navigation.getParam('user'),
      notifications: props.navigation.getParam('user').notifications,
      currentTab: 'channels'
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    ApiClient.get('/channels',  {authorized: true})
    .then(response => {
      this.setState({ channels: response, loading: false });
    })
    .catch(err => console.error(err));

    ImageCache.getProfilePicture(this.state.user._id)
    .then(response => {
      this.props.navigation.setParams({
        'profilePic': response
      })
    })

    this.notificationSubscription = Notifications.addListener(this.handleNewNotification);
  }

  handleNewNotification = () => {
    this.refreshNotifications();
  }

  refreshNotifications = () => {
    ApiClient.get(
      '/users/loggedInUser',  {authorized: true}
    )
    .then(user => {
      if (user._id) {
        this.setState({notifications: user.notifications});
      }
    }).catch(err => console.error(err));
  }

  onPressChannel = (channelId, channelName) => {
    const { channels, user } = this.state;
    var channel;

    if (['all', 'subs', 'myPosts'].includes(channelId)) channel = { _id: channelId, name: channelName };
    else channel = _.head(_.filter(channels, { _id: channelId }));

    this.props.navigation.navigate('Feed', { channel, loggedInUser: user });
  }

  onPressNotif = (notif) => {
    this.updateNotificationState(notif);
    this.props.navigation.navigate(
      'Comments', 
      { 
        postData: notif.data.post,
        updateParentState: () => {}, 
        loggedInUser: this.state.user,
      }
    );
  }

  updateNotificationState = (notif) => {
    ApiClient.post(
      `/notifications/${notif._id}/markSeen`, {}, {authorized: true}
    ).catch(err => console.error(err));

    this.setState({
      notifications: this.state.notifications.map(curNotif => {
        if (notif._id === curNotif._id) {
          curNotif.seen = true;
        }
        return curNotif;
      })
    });
  }

  hasNewNotifications = () => {
    for (let i = 0; i < this.state.notifications.length; i++) {
      if (!this.state.notifications[i].seen) {
        return true;
      }
    }
    return false;
  };

  markNotifsSeen = () => {
    ApiClient.post(
      `/users/${this.state.user._id}/markNotifsSeen`, {}, {authorized: true}
    )
    .then(res => {
      this.setState({
        notifications: this.state.notifications.map(notif => {
          notif.seen = true;
          return notif;
        })
      });
    })
    .catch(err => console.error(err));
  }

  render() {
    const { channels, loading, user } = this.state;
    
    StatusBar.setBarStyle('dark-content', true);
    if (loading) {
      return (
        <Container>
          <Content contentContainerStyle={styles.contentContainer}>
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      );
    } else {
      const hasNewNotifications = this.hasNewNotifications();
      switch(this.state.currentTab){
        case 'notifs':
          var tabJSX = (<NotificationList
            notifications={this.state.notifications.slice(0, 30)}
            onPressNotif={this.onPressNotif}
            markNotifsSeen={this.markNotifsSeen}
            refreshNotifications={this.refreshNotifications}
            hasNewNotifications={hasNewNotifications}
          />);
          break;
        case 'widgets':
          var tabJSX = (<WidgetList />);
          break;
        case 'channels':
        default:
          var tabJSX = (<ChannelList
            channels={channels}
            onPressChannel={this.onPressChannel}
            user={user}
          />);
          break;
      }

      return (
        <Container>
          <Container>
              {tabJSX}
          </Container>
          <Footer>
            <HomeTabBar 
              onSwitchTab={ (tab) => {this.setState({currentTab: tab})} }
              currentTab={this.state.currentTab}
              newNotifications={hasNewNotifications}
            />
          </Footer>
        </Container>
      );
    }
  }
}