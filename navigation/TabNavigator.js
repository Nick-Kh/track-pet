import React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons, AntDesign, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { HomeNavigator, SearchNavigator, PostNavigator, ActivityNavigator, ProfileNavigator } from './StackNavigator'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

const TabNavigator = createBottomTabNavigator({
    Home: {
        screen: HomeNavigator,
        navigationOptions: {
            tabBarLabel: ' ',
            tabBarIcon: ({focused}) => (
                <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} size={32} />
            ),
        },
    },
    Search: {
        screen: SearchNavigator,
        navigationOptions: {
            tabBarLabel: ' ',
            tabBarIcon: ({focused}) => (
                <MaterialCommunityIcons name={focused ? 'account-search' : 'account-search-outline'} size={32} />
            ),
        },
    },
    Post: {
        screen: PostNavigator,
        navigationOptions: {
            tabBarLabel: ' ',
            tabBarIcon: ({focused}) => (
                <AntDesign name={focused ? 'cloudupload' : 'clouduploado'} size={32} />
            ),
        },
    },
    Activity: {
        screen: ActivityNavigator,
        navigationOptions: {
            tabBarLabel: ' ',
            tabBarIcon: ({focused}) => (
                <FontAwesome name={focused ? 'heartbeat' : 'heart-o'} size={32} />
            ),
        },
    },
    MyProfile: { 
        screen: ProfileNavigator,
        navigationOptions: {
          tabBarLabel: ' ',
          tabBarIcon: ({focused}) => (
            <MaterialIcons name={focused ? 'person' : 'person-outline'} size={32} />
          ) 
        }
      }
    }, 
    { 
      tabBarOptions: {
        style: {
          paddingVertical: 10,
          height: 60
        }
      }
    }
  );
  
  export default createAppContainer(TabNavigator);