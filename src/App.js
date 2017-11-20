import React from 'react';
import { Platform, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { ApolloProvider, gql } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { StackNavigator } from 'react-navigation';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import storage from 'redux-persist/lib/storage';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

import { GQLURI } from './Configs';

import Reducers from './Reducers';

import SplashScreen from './Containers/Splash';
import ScheduleScreen from './Containers/Schedule';
import SlotScreen from './Containers/Slot';
import AboutScreen from './Containers/About';
import RedeemScreen from './Containers/Redeem';
import Header from './Components/Header';
import EventsScreen from './Containers/Events';

const AppStack = StackNavigator({
  splash: { screen: SplashScreen },
  events: { screen: EventsScreen },
  schedule: { screen: ScheduleScreen },
  slot: { screen: SlotScreen },
  redeem: { screen: RedeemScreen },
  about: { screen: AboutScreen },
}, {
  initialRouteName: 'splash',
  navigationOptions: {
    header: props => <Header {...props}/>,
  },
});

const networkInterface = createNetworkInterface({ uri: GQLURI });
const client = new ApolloClient({ networkInterface });

const reducer = persistCombineReducers({
  key: 'root',
  storage,
  blacklist: ['apollo'],
}, {
  ...Reducers,
  apollo: client.reducer(),
});

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunkMiddleware),
    applyMiddleware(client.middleware()),
    (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ?
      window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  ),
);

const persistor = persistStore(store);

class AppFCM extends React.Component {
  constructor() {
    super();

    this._onPushRegistered = this._onPushRegistered.bind(this);
    FCM.removeAllDeliveredNotifications();
  }

  componentDidMount() {
    if (Platform.OS === 'ios') FCM.requestPermissions();

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, this._onPushRegistered);
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      // if (notif.opened_from_tray) {}

      if (Platform.OS !== 'ios') {
        Alert.alert(
          notif.fcm.title,
          notif.fcm.body,
          [{ text: 'Cancel', onPress: () => {}, style: 'cancel' },
            { text: 'Ok', onPress: () => {} }],
          { cancelable: true },
        );
      }

      if (Platform.OS === 'ios') {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData);
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All);
            break;
          default:
            break;
        }
      }
    });

    FCM.getFCMToken().then((token) => { this._onPushRegistered(token); });
  }

  componentWillUnmount() {
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }

  _onPushRegistered(token) {
    const { deviceToken } = this.props.configs;
    if (token && (!deviceToken || deviceToken !== token)) {
      this.props.dispatch((dispatch) => {
        client.mutate({
          mutation: gql`
            mutation addDevice($token: String! $os: String!) {
              addDevice(token: $token os: $os)
            }`,
          variables: {
            token, os: Platform.OS,
          },
        }).then(({ data }) => {
          if (data.addDevice) dispatch({ type: 'SET_TOKEN', payload: { token } });
        });
      });
    }
  }

  render() { return (<AppStack />); }
}

AppFCM.propTypes = {
  dispatch: PropTypes.func.isRequired,
  configs: PropTypes.object.isRequired,
};

const AppFCMConnected = connect(state => ({ configs: state.Configs }))(AppFCM);

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <AppFCMConnected />
    </PersistGate>
  </Provider>
);

export default () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
