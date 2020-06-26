/**
 * @author Yatanvesh Bhardwaj <yatan.vesh@gmail.com>
 */
import React from 'react';
import FastImage from 'react-native-fast-image'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types';
import colors from "../constants/colors";
import {spacing} from "../constants/dimension";

const Avatar = (props) => {
  const {url, size = spacing.thumbnail, border = false,rounded=false} = props;
  const imageStyle = {
    height: size,
    width: size,
    borderRadius: rounded?size:6,
  }
  const containerStyle = {
    borderWidth: border ? 1 : 0,
    borderRadius: rounded?size:6,
    padding: 1
  }
  return (
    // <View style={[styles.container, containerStyle]}>
      <FastImage
        style={imageStyle}
        source={{
          uri: url,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    // </View>
  );
}

Avatar.propTypes = {
  url: PropTypes.string.isRequired,
};

Avatar.defaultProps = { //testing, remove this later
  url: Math.random() > 0.5 ? 'https://i.ya-webdesign.com/images/people-standing-png-4.png' : 'https://www.pngitem.com/pimgs/m/28-288789_transparent-png-person-standing-standing-png-download.png'
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgGrey,
  }
});

export default Avatar;