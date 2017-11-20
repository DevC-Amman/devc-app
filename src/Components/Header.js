import React from 'react';
import {
  Platform, View, TouchableOpacity, StyleSheet, Image, Text, StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Fonts } from '../Theme';
import Assets from '../Assets';

const styles = StyleSheet.create({
  header: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    flex: 10,
    color: 'white',
    fontSize: 20,
    backgroundColor: 'transparent',
    fontFamily: Fonts.semibold,
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
  },
});

class Header extends React.Component {
  _getSceneOptions(scene) {
    return this.props.getScreenDetails(scene).options;
  }

  render() {
    const sceneOptions = this._getSceneOptions(this.props.scene);
    const {
      title, headerStyle, headerTitleStyle,
      left, leftAction, right, rightAction,
    } = sceneOptions;
    return (
      <LinearGradient
        colors={[Colors.primary, Colors.light_blue]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={[styles.header, headerStyle]}
      >
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent animated/>
        <View style={styles.left}>
          {left &&
            <TouchableOpacity
              onPress={leftAction}
              style={{ width: 31, height: 31 }}
            >
              <Image style={{ width: 31, height: 31 }} source={Assets.Back}/>
            </TouchableOpacity>
          }
        </View>
        <Text style={[styles.title, headerTitleStyle]}>
          {title}
        </Text>
        <View style={styles.right}>
          { right &&
            <TouchableOpacity
              onPress={rightAction}
              style={{ width: 31, height: 31 }}
            >
              <Image style={{ width: 31, height: 31 }} source={Assets.Info}/>
            </TouchableOpacity>
          }
        </View>
      </LinearGradient>
    );
  }
}

Header.propTypes = {
  getScreenDetails: PropTypes.func.isRequired,
  scene: PropTypes.object.isRequired,
};

export default Header;
