import React from 'react';
import {
  StyleSheet, StatusBar, Dimensions, Platform,
  ImageBackground, View, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { SocialIcon } from 'react-native-elements';
import { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { graphql, gql, compose } from 'react-apollo';
import { NavigationActions } from 'react-navigation';
import { Fonts } from '../Theme';
import Assets from '../Assets';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);

    this._facebookConnect = this._facebookConnect.bind(this);
    this._userGraphCallback = this._userGraphCallback.bind(this);
    if (Platform.OS === 'ios') LoginManager.setLoginBehavior('native');
  }

  componentDidMount() {
    const { configs } = this.props;
    if (configs.loading) this.props.dispatch({ type: 'UPDATE_LOADING' });

    this._logo.transitionTo({
      opacity: 1,
    }, 500, 'ease');

    if (!configs.loggedIn) {
      this._button.transitionTo({
        opacity: 1,
      }, 500, 'ease');
    } else {
      setTimeout(() => {
        this.props.navigation.dispatch(NavigationActions.reset({
          index: 0, actions: [NavigationActions.navigate({ routeName: 'events' })],
        }));
      }, 2000);
    }
  }

  _facebookConnect() {
    const { dispatch } = this.props;
    dispatch({ type: 'UPDATE_LOADING' });
    LoginManager.logOut();
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then((result) => {
        if (!result.isCancelled) {
          const infoRequest = new GraphRequest(
            '/me?fields=id,email,name,gender',
            null, this._userGraphCallback,
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        } else dispatch({ type: 'UPDATE_LOADING' });
      }).catch((error) => {
        dispatch({ type: 'UPDATE_LOADING' });
        console.log(error);
      });
  }

  async _userGraphCallback(error, result) {
    const { deviceToken } = this.props.configs;

    if (error) this.props.dispatch({ type: 'UPDATE_LOADING' });
    else {
      const { data } = await this.props.fbConnect({
        variables: {
          deviceToken,
          userInput: {
            fbid: result.id,
            name: result.name,
            email: result.email,
            gender: result.gender,
          },
        },
      });

      if (data.fbConnect && data.fbConnect.id) {
        const user = data.fbConnect;
        this.props.dispatch((dispatch) => {
          dispatch({ type: 'LOGIN', payload: { user } });
          setTimeout(() => {
            dispatch({ type: 'UPDATE_LOADING' });
            this.props.navigation.dispatch(NavigationActions.reset({
              index: 0, actions: [NavigationActions.navigate({ routeName: 'events' })],
            }));
          }, 1000);
        });
      } else this.props.dispatch({ type: 'UPDATE_LOADING' });
    }
  }

  render() {
    const { configs } = this.props;

    return (
      <ImageBackground
        style={styles.container}
        source={Assets.Splash}
      >
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent animated/>
        <View/>
        <Animatable.Image
          ref={(r) => { this._logo = r; }}
          delay={500}
          style={{ opacity: 0, marginVertical: 40 }}
          source={Assets.Logo}
        />

        <Animatable.View
          ref={(r) => { this._button = r; }}
          delay={1000}
          style={{ marginVertical: 40, opacity: 0, width: width * 0.8 }}
        >
          {configs.loading &&
            <ActivityIndicator color="white" size="large" />
          }

          {!configs.loading &&
            <SocialIcon
              raised
              button
              style={{ borderRadius: 10 }}
              disabled={configs.loggedIn || configs.loading}
              title="Connect With Facebook"
              fontFamily={Fonts.regular}
              type="facebook"
              onLongPress={() => { this._facebookConnect(); }}
              onPress={() => { this._facebookConnect(); }}
            />
          }
        </Animatable.View>

      </ImageBackground>
    );
  }
}

SplashScreen.navigationOptions = {
  header: null,
};

SplashScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.object,
    dispatch: PropTypes.func,
  }).isRequired,
  configs: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  fbConnect: PropTypes.func.isRequired,
};

const fbConnect = gql`
  mutation fbConnect($userInput: UserInput! $deviceToken: String) {
    fbConnect(newUser: $userInput deviceToken: $deviceToken) {
      id fbid name email gender
    }
  }
`;

export default compose(
  connect(state => ({ configs: state.Configs })),
  graphql(fbConnect, { name: 'fbConnect' }),
)(SplashScreen);
