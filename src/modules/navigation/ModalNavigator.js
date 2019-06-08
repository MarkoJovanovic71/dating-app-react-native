import React from 'react';
import { Image, TouchableOpacity,View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Auth from '../auth/Auth';
import Login from '../auth/Login';
import Register from '../auth/Register';

import { colors, fonts } from '../../styles';
import MainNavigator from './MainNavigator';
import PhotoModal from '../shared/PhotoModal';

const modalNavigator = createStackNavigator(
  {    
    Main: {
      screen: MainNavigator,
      navigationOptions: {
        header: null,
      },
    },
    PhotoModal:{
        screen: PhotoModal,
        navigationOptions: {
            header: null,
          },
    }
    

    
  },
  {
    mode: 'modal',
    transparentCard: true,

    transitionConfig : () => ({
      containerStyle: {
        backgroundColor: 'transparent',
      }
    }),
  },
);

export default createAppContainer(modalNavigator);
