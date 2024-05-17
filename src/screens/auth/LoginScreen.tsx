
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../router/types';

type FormData = {
  email: string;
  password: string;
};

// Type guard for Error object
function isError(obj: unknown): obj is Error {
  return obj instanceof Error;
}

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post('http://163.172.177.98:8081/auth/login', data);
      console.log('API Response:', response.data);  // Log the response data
      const token = response.data.accessToken;

      if (!token) {
        throw new Error('Token not found in response');
      }

      await AsyncStorage.setItem('token', token);
      navigation.navigate('UserDetails', { token });
    } catch (error) {
      console.error(error);
      if (isError(error)) {
        Alert.alert('Error', error.message || 'Failed to login');
      } else {
        Alert.alert('Error', 'Failed to login');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' } }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long' } }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text>Password</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>
        )}
      />
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  linkText: {
    color: 'blue',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
