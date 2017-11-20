import React from 'react';
import {
  StyleSheet, Image, AppState, Linking, Dimensions,
  ScrollView, View, Text, TouchableOpacity, FlatList, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { graphql, gql, compose } from 'react-apollo';
import { Colors, Fonts } from '../Theme';
import Assets from '../Assets';
import { CITY, GROUP } from '../Configs';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.off_white,
    paddingHorizontal: 20,
  },
  logoStyles: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 200,
  },
  desc: {
    padding: 10,
  },
  text: {
    color: Colors.primary,
    fontSize: 13,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
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
});

class EventsScreen extends React.Component {
  constructor() {
    super();
    this.state = { appState: AppState.currentState };
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    if (this.props.data) this.props.data.refetch();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (this.props.data) this.props.data.refetch();
    }
    this.setState({ appState: nextAppState });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.logoStyles}>
          <Image source={Assets.LogoHorizontal} />
        </View>
        {this.props.data.loading &&
          <ActivityIndicator size="large" color={Colors.primary} />
        }
        {!this.props.data.loading &&
        <FlatList
          data={this.props.data.agendas}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => (
            <View
              style={styles.card}
            >
              <View style={[styles.desc, { padding: 20 }]}>
                <Text style={[styles.text, styles.title, { textAlign: 'center' }]}>
                  There are no announced events yet, join the group to be part of our community.
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
              </View>
            </View>
          )}
          renderItem={item => (
            <TouchableOpacity
              key={item.index}
              style={styles.card}
              disabled={!item.item.active}
              activeOpacity={0.7}
              onPress={() => {
                    this.props.navigation.navigate('schedule', { agenda: item.item });
                }}
            >
              {item.index === 0 &&
                <Image
                  style={styles.cover}
                  resizeMode="cover"
                  source={item.item.imageUrl ? { uri: item.item.imageUrl } : Assets.Cover}
                />
              }
              <View style={styles.desc}>
                <Text style={[styles.text, styles.title]}>{item.item.title}</Text>
                <Text style={styles.text}>{moment(new Date(item.item.date)).format('MMMM Do, YYYY - hh:mm a')}</Text>
                <Text style={styles.text}>Location: {item.item.location.name}</Text>
              </View>
            </TouchableOpacity>
            )}
        />
      }
      </ScrollView>
    );
  }
}

EventsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Events',
  right: true,
  rightAction: () => {
    navigation.navigate('about');
  },
});

EventsScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    navigate: PropTypes.func,
    state: PropTypes.object,
  }).isRequired,
  data: PropTypes.object.isRequired,
};

const AgendaGQL = gql`
  query agendas {
    agendas {
      id imageUrl active title date
      location {
        name
        long
        lat
      }
      activities {
        id title description hosts { name title subtitle } start_at end_at
      }
    }
  }
`;

export default compose(
  connect(state => ({ configs: state.Configs, account: state.Account })),
  graphql(AgendaGQL),
)(EventsScreen);
