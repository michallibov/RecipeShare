import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { getAuth, fetchSignInMethodsForEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import globalStyles from '../config/colors';
import { FIREBASE_DB } from '../../FirebaseConfig';
import ImagePickerComponent from '../components/ImagePickerComponent';

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [image, setImage] = useState('../assets/chef.png');
    const [varifyPass, setVarifyPass] = useState('');
    const [emailNotValid, setEmailNotValid] = useState(false);
    const [passwordNotValid, setPasswordNotValid] = useState(false);
    const [varifyPassNotValid, setVarifyPassNotValid] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailNotValid(true);
            setEmailError('Please enter a valid email!');
            return false;
        } else {
            setEmailNotValid(false);
            setEmailError('');
        }
        return true;
    };

    const checkPassword = () => {
        if (password.length < 6) {
            setPasswordNotValid(true);
            return false;
        }
        setPasswordNotValid(false);
        return true;    
    };

    const handleSignUp = async () => {
        const validEmail = checkEmail();
        const validPass = checkPassword();
        if (!validEmail || !validPass) return;

        if (email === '' || password === '') {
            alert('Please fill all the information!');
            return;
        }

        if (password !== varifyPass) {
            setVarifyPassNotValid(true);
            return;
        }

        try {
            setIsLoading(true);
            const auth = getAuth();
            const methods = await fetchSignInMethodsForEmail(auth, email);

            if (methods && methods.length > 0) {
                // Email already exists
                setEmailNotValid(true);
                setEmailError('This email is already registered.');
                setIsLoading(false);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                email: user.email,
                image: image || '../assets/chef.png',
                nickname: nickname,
            };

            const myCollection = collection(FIREBASE_DB, 'Users');
            await addDoc(myCollection, userData);

            setIsLoading(false);
            navigation.navigate('Login');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setEmailNotValid(true);
                setEmailError('This email is already registered.');
            } else {
                console.error('Error during sign up:', error.message);
            }
        }
    };

    return (
        <View style={[styles.container, globalStyles.container]}>
            <Image source={require('../assets/logo-no-background.png')} style={styles.logoStyle} circled={true} />
            <Text style={styles.titleStyle}>Sign Up</Text>

            <Text style={styles.label}>Email *</Text>
            <TextInput
                style={[styles.input, emailNotValid && styles.inputError]}
                placeholder="Enter your email"
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            {emailNotValid && <Text style={styles.errorText}>{emailError}</Text>}

            <Text style={styles.label}>Password *</Text>
            <TextInput
                style={[styles.input, styles.passwordInput, passwordNotValid && styles.inputError]}
                placeholder="Enter your password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            {passwordNotValid && <Text style={styles.errorText}>Password must contain at least 6 characters!</Text>}

            <Text style={styles.label}>Verify Password *</Text>
            <TextInput
                style={[styles.input, styles.passwordInput, varifyPassNotValid && styles.inputError]}
                placeholder="Re-enter your password"
                secureTextEntry
                onChangeText={(text) => setVarifyPass(text)}
                value={varifyPass}
            />
            {varifyPassNotValid && <Text style={styles.errorText}>The passwords do not match!</Text>}

            <View style={styles.optionalSection}>
                <Text style={styles.optionalText}>Nickname & Image (Optional)</Text>
                <View style={styles.nicknameImageBoxStyle}>
                    <TextInput
                        style={[styles.input, styles.nicknameStyle]}
                        placeholder='Enter your nickname'
                        onChangeText={(text) => setNickname(text)}
                        value={nickname}
                    />
                    <ImagePickerComponent image={image} setImage={setImage} editable={true} />
                </View>
            </View>

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up!</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 16,
    },
    titleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
        textDecorationLine: 'underline',
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 8,
        marginBottom: 10
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        marginLeft: 10
    },
    signUpButton: {
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
    logoStyle: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        marginBottom: 20
    },
    nicknameImageBoxStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nicknameStyle: {
        flex: 3,
        marginRight: 10
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 10
    },
    optionalText: {
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 5,
    },
    optionalSection: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10
    }
});

export default SignUp;
