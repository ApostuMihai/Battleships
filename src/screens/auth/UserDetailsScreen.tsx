
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../router/types';

type UserDetails = {
  user: {
    id: string;
    email: string;
  };
};

const UserDetailsScreen = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const route = useRoute<RouteProp<RootStackParamList, 'UserDetails'>>();
  const { token } = route.params;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://163.172.177.98:8081/user/details/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('User Details Response:', response.data); // Log the response data
        setUserDetails(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch user details');
      }
    };

    fetchUserDetails();
  }, [token]);

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
      <Text>Password: Sorry, that's private</Text>
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
