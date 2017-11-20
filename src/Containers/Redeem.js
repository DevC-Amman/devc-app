import React from 'react';
import {
  StyleSheet, ScrollView, Dimensions, Text, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import QRCode from 'react-native-qrcode';
import { Colors, Fonts } from '../Theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.off_white,
  },
  mainTitle: {
    color: Colors.primary,
    fontFamily: Fonts.semibold,
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  subTitle: {
    color: Colors.light_blue,
    fontFamily: Fonts.regular,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  qrcodeCont: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
});

const AboutScreen = (props) => {
  const { account: { user } } = props;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <Text style={styles.mainTitle}>
          Please show this code to the person at the giveaways booth
      </Text>
      <View style={styles.qrcodeCont}>
        <QRCode
          value={`http://35.158.97.11:3000/#/giveaway/${user.redeemCode}`}
          size={width * 0.7}
          bgColor="black"
          fgColor="white"
        />
      </View>
    </ScrollView>
  );
};

AboutScreen.navigationOptions = ({ navigation }) => ({
  title: 'Giveaways',
  left: true,
  leftAction: () => {
    navigation.dispatch(NavigationActions.back());
  },
});

AboutScreen.propTypes = {
  account: PropTypes.object.isRequired,
};


export default connect(state => ({ account: state.Account }))(AboutScreen);
