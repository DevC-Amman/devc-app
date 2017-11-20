import React from 'react';
import {
  StyleSheet, View, Text, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { graphql, gql, compose } from 'react-apollo';
import moment from 'moment';
import { Colors, Fonts } from '../Theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.off_white,
  },
  agendaTitle: {
    fontFamily: Fonts.semibold,
    fontSize: 20,
    color: Colors.primary,
  },
  agendaDuration: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.light_blue,
  },
  agendaDesc: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    color: Colors.primary,
    marginTop: 30,
  },
  title: {
    fontFamily: Fonts.semibold,
    fontSize: 20,
    color: Colors.light_blue,
    marginTop: 20,
    marginBottom: 5,
  },
  nameRow: {
    paddingVertical: 3,
  },
  nameName: {
    fontFamily: Fonts.semibold,
    fontSize: 18,
    color: Colors.primary,
  },
  nameTitle: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    color: Colors.light_blue,
    marginTop: 2,
  },
  nameSubTitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.light_blue,
    marginTop: 2,
    marginBottom: 20,
  },
  submitButton: {
    width: width * 0.8,
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
  qrcodeCont: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
});

class SlotScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: '' };
    this._submit = this._submit.bind(this);
  }

  _submit() {
    const { account: { user } } = this.props;
    const { code } = this.state;

    if (code === '') {
      return false;
    }

    this.props.dispatch((dispatch) => {
      dispatch({ type: 'UPDATE_LOADING' });
      this.props.register({
        variables: {
          userId: user.id,
          code,
        },
      }).then(({ data }) => {
        dispatch({ type: 'UPDATE_LOADING' });
        if (data.registration) {
          this.props.dispatch({
            type: 'UPDATE_USER',
            payload: {
              user: {
                registered: true,
                regCode: data.registration.regCode,
                redeemCode: data.registration.redeemCode,
              },
            },
          });
        }
      });
    });

    return true;
  }

  render() {
    const { state: { params } } = this.props.navigation;

    const startAt = moment(new Date(params.start_at));
    const endAt = moment(new Date(params.end_at));
    const duration = moment.duration(endAt.diff(startAt));

    return (
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.agendaTitle}>{params.title}</Text>
        <Text style={styles.agendaDuration}>
          {duration.hours() > 0 && `${duration.hours()} Hour `}
          {duration.minutes() > 0 && `${duration.minutes()} Mins `}
        </Text>
        <Text style={styles.agendaDesc}>{params.description}</Text>
        {(params.hosts && params.hosts.length !== 0) &&
          <Text style={styles.title}>Hosts:</Text>
        }
        {(params.hosts && params.hosts.length !== 0) &&
          params.hosts.map((host, index) => (
            <View style={styles.nameRow} key={index}>
              <Text style={styles.nameName}>{host.name}</Text>
              {host.title && <Text style={styles.nameTitle}>{host.title}</Text>}
              {host.subtitle && <Text style={styles.nameSubTitle}>{host.subtitle}</Text>}
            </View>
          ))
        }
      </KeyboardAwareScrollView>
    );
  }
}

SlotScreen.navigationOptions = ({ navigation }) => ({
  title: moment(new Date(navigation.state.params.start_at)).format('HH:mm'),
  left: true,
  leftAction: () => {
    navigation.dispatch(NavigationActions.back());
  },
});

SlotScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    navigate: PropTypes.func,
    state: PropTypes.object,
  }).isRequired,
  account: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const RegisterGQL = gql`
  mutation registration($userId: ID $code: String!) {
    registration(userId: $userId code: $code) {
      regCode redeemCode
    }
  }
`;

export default compose(
  connect(state => ({ configs: state.Configs, account: state.Account })),
  graphql(RegisterGQL, { name: 'register' }),
)(SlotScreen);
