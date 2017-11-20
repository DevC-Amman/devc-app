import React from 'react';
import {
  StyleSheet, Image, Dimensions, Linking,
  ScrollView, View, Text, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { LoginManager } from 'react-native-fbsdk';
import { graphql, gql, compose } from 'react-apollo';
import { Colors, Fonts } from '../Theme';
import Assets from '../Assets';
import { LEAD, EMAIL, CITY, GROUP } from '../Configs';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.off_white,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.primary,
    marginVertical: 20,
  },
  title: {
    backgroundColor: 'transparent',
    color: Colors.primary,
    fontFamily: Fonts.semibold,
    fontSize: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
  subTitle: {
    backgroundColor: 'transparent',
    color: Colors.light_blue,
    fontFamily: Fonts.regular,
    fontSize: 18,
    textAlign: 'center',
  },
  submitButton: {
    width: width * 0.9,
    height: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  submitButtonText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: Fonts.semibold,
    fontSize: 20,
  },
});

class AboutScreen extends React.Component {
  componentDidMount() {

  }

  render() {
    const { configs } = this.props;

    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: 20 }}>
        <Text style={[styles.title, { textAlign: 'left', paddingTop: 40, paddingRight: 20 }]}>
          Connecting communities to develop the future.
        </Text>
        <Text style={[styles.subTitle, { textAlign: 'left' }]}>
          Developer Circles From Facebook is a global
          network of local communities created
          by developers, for developers.
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => { Linking.openURL(GROUP); }}
          style={[styles.submitButton, { marginBottom: 0 }]}
        >
          <Text style={styles.submitButtonText}>
              Join DevC {CITY}
          </Text>
        </TouchableOpacity>

        <Divider style={styles.divider}/>

        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
          <Text style={styles.title}>
            Why join a circle?
          </Text>
          <Text style={styles.subTitle}>
            Whatever you build, Developer Circles connects
            you to collaborate, learn, and code with other
            local developers.
          </Text>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
          <Image
            style={{ width: 55, height: 25 }}
            resizeMode="contain"
            source={Assets.Connect}
          />
          <Text style={styles.title}>
            Connect with other developers
          </Text>
          <Text style={styles.subTitle}>
            Access an exclusive local Facebook Group
            community and attend meetups near you
          </Text>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
          <Image
            style={{ width: 40, height: 37 }}
            resizeMode="contain"
            source={Assets.Engage}
          />
          <Text style={styles.title}>
            Engage with local experts
          </Text>
          <Text style={styles.subTitle}>
            Each community is organized and run by local
            developer Leads
          </Text>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
          <Image
            style={{ width: 50, height: 46 }}
            resizeMode="contain"
            source={Assets.Learn}
          />
          <Text style={styles.title}>
            Learn about new tech
          </Text>
          <Text style={styles.subTitle}>
            Learn about Bots, AI, IoT, React and other tools
          </Text>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
          <Image
            style={{ width: 60, height: 40 }}
            resizeMode="contain"
            source={Assets.Build}
          />
          <Text style={styles.title}>
            Build with other developers
          </Text>
          <Text style={styles.subTitle}>
            Collaborate with developers of all types
          </Text>
        </View>

        <Divider style={styles.divider}/>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => { Linking.openURL(`mailto:${EMAIL}`); }}
        >
          <Text style={[styles.title, {
          fontFamily: Fonts.regular,
          fontSize: 18,
          textAlign: 'left',
          paddingVertical: 0,
        }]}
          >
          For more info contact your local DevC Lead:
          </Text>
          <Text style={[styles.subTitle, { textAlign: 'left' }]}>
            {LEAD}
          </Text>
        </TouchableOpacity>
        <Divider style={styles.divider}/>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            LoginManager.logOut();
            this.props.updateDevice({ variables: { token: configs.deviceToken } })
            .then(() => {
              this.props.dispatch({ type: 'LOGOUT' });
              this.props.navigation.dispatch(NavigationActions.reset({
                index: 0, actions: [NavigationActions.navigate({ routeName: 'splash' })],
              }));
            });
          }}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>
              Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

AboutScreen.navigationOptions = ({ navigation }) => ({
  title: 'About DevC',
  left: true,
  leftAction: () => {
    navigation.dispatch(NavigationActions.back());
  },
});

AboutScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    navigate: PropTypes.func,
    state: PropTypes.object,
  }).isRequired,
  configs: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  updateDevice: PropTypes.func.isRequired,
};

const UpdateDevice = gql`
  mutation updateDevice($token: String!) {
    updateDevice(token: $token)
  }
`;

export default compose(
  connect(state => ({ configs: state.Configs })),
  graphql(UpdateDevice, { name: 'updateDevice' }),
)(AboutScreen);
