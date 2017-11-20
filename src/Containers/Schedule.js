import React from 'react';
import {
  StyleSheet, Dimensions, ScrollView, FlatList, View, Linking,
  Text, Image, TouchableOpacity, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import moment from 'moment';
import { Colors, Fonts } from '../Theme';
import Assets from '../Assets';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.off_white,
  },
  eventTitleCont: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  eventTitle: {
    color: Colors.primary,
    fontFamily: Fonts.regular,
    fontSize: 18,
  },
  leadCont: {
    alignItems: 'flex-start',
    marginHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.primary,
  },
  eventDate: {
    color: Colors.primary,
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  contentTitle: {
    color: Colors.primary,
    fontFamily: Fonts.semibold,
    fontSize: 16,
  },
  agendaRow: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 15,
  },
  agendaTimeCont: {
    flex: 2,
    paddingVertical: 10,
    paddingLeft: 5,
  },
  agendaTime: {
    fontFamily: Fonts.semibold,
    fontSize: 13,
    color: Colors.light_blue,
  },
  timelineCont: {
    width: 10,
    alignItems: 'center',
  },
  timeline: {
    width: 1,
    height: 60,
    backgroundColor: Colors.light_blue,
  },
  timelineCircle: {
    position: 'absolute',
    top: 13,
    width: 8,
    height: 8,
    backgroundColor: Colors.off_white,
    borderColor: Colors.light_blue,
    borderWidth: 1,
    borderRadius: 4,
  },
  agendaDataCont: {
    flex: 9,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  agendaTitle: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: Colors.primary,
  },
  agendaDuration: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.primary,
  },
  redeemButton: {
    width: width * 0.9,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  claimText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 19,
    fontFamily: Fonts.semibold,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class ScheduleScreen extends React.Component {
  constructor(props) {
    super(props);
    this._agendaItem = this._agendaItem.bind(this);
  }

  _agendaItem({ item, index }) {
    const { navigate } = this.props.navigation;
    const { activities } = this.props.navigation.state.params.agenda;
    const now = moment();
    const startAt = moment(new Date(item.start_at));
    const endAt = moment(new Date(item.end_at));
    const active = now > startAt && now < endAt;
    const duration = moment.duration(endAt.diff(startAt));
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.agendaRow}
        onPress={() => {
          navigate('slot', { ...item });
        }}
      >
        <View style={styles.agendaTimeCont}>
          <Text style={styles.agendaTime}>
            {startAt.format('HH:mm')}
          </Text>
        </View>

        <View style={[styles.timelineCont, index === 0 && { paddingTop: 13 }]}>
          {index === (activities.length - 1) &&
            <LinearGradient
              colors={[Colors.light_blue, Colors.off_white]}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 0.0, y: 1.0 }}
              style={styles.timeline}
            />
          }

          {index !== (activities.length - 1) &&
            <View style={[styles.timeline]}/>
          }
          <View style={[styles.timelineCircle, active &&
            {
              backgroundColor: Colors.light_blue,
              width: 12,
              height: 12,
              borderRadius: 6,
            },
          ]}
          />
        </View>

        <View style={styles.agendaDataCont}>
          <Text numberOfLines={1} style={styles.agendaTitle}>{item.title}</Text>
          <Text style={styles.agendaDuration}>
            {duration.hours() > 0 && `${duration.hours()} Hour `}
            {duration.minutes() > 0 && `${duration.minutes()} Min `}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    const { title, date, location } = this.props.navigation.state.params.agenda;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.eventTitleCont}>
          <Image source={Assets.LogoHorizontal} />
          <Text style={styles.eventTitle}>
            {this.props.navigation.state.params.agenda &&
              title &&
              title
            }
          </Text>
        </View>

        <TouchableOpacity
          style={styles.leadCont}
          disabled={!location.long || !location.lat}
          onPress={() => {
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.long}`);
          }}
        >
          {this.props.navigation.state.params.agenda && date &&
            <View style={styles.content}>
              <Text style={styles.contentTitle}>When: </Text>
              <Text style={styles.eventDate}>
                {moment(new Date(date)).format('MMMM Do, YYYY - hh:mm a')}
              </Text>
            </View>

          }
          {this.props.navigation.state.params.agenda && location &&
            <View style={styles.content}>
              <Text style={styles.contentTitle}>Where: </Text>

              <Text style={styles.eventDate}>
                {`${location.name}`}
              </Text>
            </View>
          }
        </TouchableOpacity>
        {(this.props.navigation.state.params.agenda) &&
          <FlatList
            data={this.props.navigation.state.params.agenda.active ?
               this.props.navigation.state.params.agenda.activities : []}
            renderItem={this._agendaItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            ListEmptyComponent={() => (
              <Text style={[styles.eventTitle, { textAlign: 'center', padding: 20 }]} >
                {!this.props.navigation.state.params.agenda.active}
              </Text>
            )}
          />
        }
        {(this.props.navigation.state.params.agendas &&
           this.props.navigation.state.params.agenda.active) &&
          this.props.account.user.redeemCode &&
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => { navigate('redeem'); }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.light_blue]}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 2, y: 0.0 }}
              style={styles.redeemButton}
            >
              <Text style={styles.claimText}>
                CLAIM YOUR GIVEAWAY
                <Text style={{ color: Colors.light_blue }}> HERE</Text>
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        }
      </ScrollView>
    );
  }
}

ScheduleScreen.navigationOptions = ({ navigation }) => ({
  title: 'Agenda',
  left: true,
  leftAction: () => {
    navigation.dispatch(NavigationActions.back());
  },
});

ScheduleScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    navigate: PropTypes.func,
    state: PropTypes.object,
  }).isRequired,
  account: PropTypes.object.isRequired,
};


export default connect(state =>
  ({ configs: state.Configs, account: state.Account }))(ScheduleScreen);
