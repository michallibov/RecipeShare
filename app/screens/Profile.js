import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import ImagePickerComponent from '../components/ImagePickerComponent';

const Profile = () => {
    const [image, setImage] = useState('../assets/chef.png');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editable, setEditable] = useState(false);
    const [userID, setUserID] = useState('');

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Users'));

                const userData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setImage(userData[0].image || '../assets/chef.png');
                setEmail(userData[0].email);
                setNickname(userData[0].nickname);
                setUserID(userData[0].id);
                setIsLoading(false);
            }
            } catch (error) {
            console.error('Error fetching recipes:', error);
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
        fetchUserData();
        }, [])
    );

    const handleEditPress = async () => {
        if (editable) {
            try {
                setIsLoading(true);
                const userRef = doc(FIREBASE_DB, 'Users', userID);
                const newDetails = {
                    email: email,
                    image: image || '../assets/chef.png' , 
                    nickname: nickname
                }
                await updateDoc(userRef, newDetails);
                setIsLoading(false);
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        }
        setEditable(!editable);
    };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.userDataBox}>
            { isLoading ? <ActivityIndicator size={40} color={'black'} /> :
                <>
                    <View style={styles.imageWrapper}>
                        <ImagePickerComponent image={image} setImage={setImage} editable={editable} circled={true}/>
                    </View>
                    <View style={styles.userDataDetails}>
                        <View style={styles.detail}>
                            <Text style={styles.label}>Email:</Text>
                            <TextInput
                                style={!editable ? styles.input : styles.input}
                                placeholder={email}
                                onChangeText={(text) => setEmail(text)}
                                editable={editable}
                                placeholderTextColor={editable ? 'black' : 'gray'}
                            />
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.label}>Nickname:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={nickname ? nickname : 'You did not choose a nickname yet!'}
                                onChangeText={(text) => setNickname(text)}
                                editable={editable}
                                placeholderTextColor={editable ? 'black' : 'gray'}
                            />
                        </View>
                    </View>    
                </>
            }
        </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.editButtonText}>{editable ? 'Save' : 'Edit'}</Text>
              )
            }   
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(231, 217, 203, 220)',
    padding: 14,
    justifyContent: 'center'
  },
  userDataBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'white', 
    borderRadius: 15,
    padding: 7
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'black'
  },
  imageWrapper: {
    alignItems: 'center',
    marginRight: 10
  },
  userDataDetails: {
    flex: 1,
  },
  detail: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6e492a',
    padding: 10,
    borderRadius: 5,
    minWidth: 200,
    color: '#6e492a'
  },
  editButton: {
    backgroundColor: '#6e492a',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
})

export default Profile;
