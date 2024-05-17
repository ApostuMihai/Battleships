// UserDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../router/types';

type UserDetails = {
  user: {
    id: string;
    email: string;
  };
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
};

const UserDetailsScreen = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const route = useRoute<RouteProp<RootStackParamList, 'UserDetails'>>();
  const { token } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://163.172.177.98:8081/user/details/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('User Details Response:', response.data);
        setUserDetails(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch user details');
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{userDetails.user.email}'s details page</Text>
      {userDetails.user.id ? <Text>User ID: {userDetails.user.id}</Text> : null}
      <Text>Email: {userDetails.user.email}</Text>
      <Text>Games played: {userDetails.gamesPlayed}</Text>
      <Text>Games won: {userDetails.gamesWon}</Text>
      <Text>Games lost: {userDetails.gamesLost}</Text>
      <Text>Password: Sorry, that's private</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default UserDetailsScreen;
