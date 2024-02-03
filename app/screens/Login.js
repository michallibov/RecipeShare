import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Image,
    ActivityIndicator
} from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import globalStyles from '../config/colors';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const auth = FIREBASE_AUTH;

    const handleLogin = async () => {
        checkEmail();
        checkPassword();

        if (emailError || passwordError)
            return;
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            setIsLoading(false);
            navigation.navigate('Navbar');
        } catch (error) {
            setIsLoading(false);
            if (error.code === 'auth/user-not-found') {
                setEmailError('User not found');
            } else if (error.code === 'auth/invalid-credential') {
                setPasswordError('Wrong password');
            }
        }
    };

    const checkEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email))
            setEmailError('Invalid email!');
        else
            setEmailError('');
    }

    const checkPassword = () => {

        if (password.length < 6)
            setPasswordError('Password must be at least 6 characters!');
        else
            setPasswordError('');
    }

    return (
        <View style={[styles.container, globalStyles.container]}>
            <View style={styles.logo}>
                <Image style={styles.logoStyle} source={require("../assets/logo-no-background.png")} />
            </View>
            <KeyboardAvoidingView behavior='padding'>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                />
                {emailError && <View style={styles.errorBox}><Text style={styles.errorMessage}>{emailError}</Text></View>}
                <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                {passwordError && <View style={styles.errorBox}><Text style={styles.errorMessage}>{passwordError}</Text></View>}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity> 
                <View style={styles.signUpBox}>
                    <Text>Or</Text>
                    <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signUpText}>SignUp</Text>
                    </TouchableOpacity>
                </View>
                
            </KeyboardAvoidingView>
        </View>
  );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 8,
    },
    passwordInput: {
        marginTop: 16,
    },
    loginButton: {
        backgroundColor: '#6e492a',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorMessage: {
        color: 'darkred',
        fontWeight: 'bold',
    },
    errorBox: {
        padding: 4,
        marginTop: 4,
        backgroundColor: 'salmon',
        borderWidth: 1,
        borderColor: 'darkred',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoStyle: {
        height: 200,
        width: 200,
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50
    },
    signUpButton: {
       margin: 10
    },
    signUpText: {
        textDecorationLine: 'underline'
    },
    signUpBox: {
        alignContent: 'center',
        margin: 15,
        alignItems: 'center',
    }
});

export default Login;
