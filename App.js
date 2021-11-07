import React from 'react';
import ContextProvider from './src/context/Money';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Host } from 'react-native-portalize';

import Lucros from './src/components/Lucros';
import Despesas from './src/components/Despesas';
import Home from './src/components/Home';
import Setting from './src/components/Setting';

export default function App() {
  const Tab = createMaterialBottomTabNavigator()

  return (
    <ContextProvider>
      <NavigationContainer>
        <Host>
          <Tab.Navigator activeColor="#FFF" inactiveColor="#000" initialRouteName="Home" barStyle={{ backgroundColor: '#3296FF' }}>
            <Tab.Screen component={Lucros} name='Lucros' options={{
              tabBarOptions: { showIcon: true }, tabBarIcon: ({ focused }) =>
                focused ? <Icon name="cash-multiple" size={26} color="#FFF" /> : <Icon name="cash-multiple" size={26} color="#000" />
            }} />
            <Tab.Screen component={Home} name='Home' options={{
              tabBarOptions: { showIcon: true }, tabBarIcon: ({ focused }) =>
                focused ? <Icon name="home" size={26} color="#FFF" /> : <Icon name="home" size={26} color="#000" />
            }} />
            <Tab.Screen component={Despesas} name='Despesas' options={{
              tabBarOptions: { showIcon: true }, tabBarIcon: ({ focused }) =>
                focused ? <Icon name="cash-minus" size={26} color="#FFF" /> : <Icon name="cash-minus" size={26} color="#000" />
            }} />
            <Tab.Screen component={Setting} name='Configurações' options={{
              tabBarOptions: { showIcon: true }, tabBarIcon: ({ focused }) =>
                focused ? <Icon name="cog-outline" size={26} color="#FFF" /> : <Icon name="cog-outline" size={24} color="#000" />
            }} />
          </Tab.Navigator>
        </Host>
      </NavigationContainer>
    </ContextProvider>
  )
}