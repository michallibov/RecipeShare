import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDocs, collection, updateDoc, doc, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import ImagePickerComponent from '../components/ImagePickerComponent';
import globalStyles from '../config/colors';

const Profile = () => {
    const [image, setImage] = useState('../assets/chef.png');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editable, setEditable] = useState(false);
    const [userID, setUserID] = useState('');
    const [nicknameError, setNicknameError] = useState('');

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const auth = getAuth();
            const user = auth.currentUser;
          if (user) {
            console.log(user);
            const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Users'));

            const userData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const currentUser = userData.filter(usr => usr.email === user.email);
            setImage(currentUser[0].image || '../assets/chef.png');
            setEmail(currentUser[0].email);
            setNickname(currentUser[0].nickname);
            setUserID(currentUser[0].id);
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
        console.log(nickname)
          if (await checkNicknameExists() || nickname == '') {
              setNicknameError('');
              try {
                  setIsLoading(true);
                  const userRef = doc(FIREBASE_DB, 'Users', userID);
                  const newDetails = {
                      email: email,
                      image: image || '../assets/chef.png',
                      nickname: nickname
                  }
                  await updateDoc(userRef, newDetails);
                  await updateNickname();
                  setIsLoading(false);
                  setEditable(false); 
              } catch (error) {
                  console.error('Error updating user data:', error);
              }
          } else {
              setNicknameError("This nickname is already in use. please choose another one");
          }
      } else {
          setEditable(true);
      }
  };

  const checkNicknameExists = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(FIREBASE_DB, 'Users'), where('nickname', '==', nickname))
      )
      console.log(querySnapshot.empty)
      return querySnapshot.empty;
    }
    catch (error) {
      console.log("Error checking nickname: ", error);
      return false;
    }
  }
  
  const updateNickname = async () => {
      try {
        const querySnapshot = await getDocs(
            query(collection(FIREBASE_DB, 'Recipes'), where('email', '==', email))
        );
        const recipesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        const batch = [];
        recipesData.forEach(recipe => {
            const recipeRef = doc(FIREBASE_DB, 'Recipes', recipe.id);
            const updatedRecipe = { ...recipe, nickname: nickname ? nickname : email};
            batch.push(updateDoc(recipeRef, updatedRecipe));
        });

        await Promise.all(batch);
      } catch (error) {
        console.error('Error updating nickname for recipes:', error);
      }
  }

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
                                style={[
                                  styles.input,
                                  !editable && { color: 'gray' }, 
                              ]}
                                placeholder={email}
                                onChangeText={(text) => setEmail(text)}
                                editable={editable}
                                value={email}
                                placeholderTextColor={editable ? 'black' : 'gray'}
                  
                            />
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.label}>Nickname:</Text>
                            <TextInput
                                style={[
                                  styles.input,
                                  !editable && { color: 'gray' }, 
                              ]}
                                placeholder={nickname ? nickname : 'You did not choose a nickname yet!'}
                                onChangeText={(text) => setNickname(text)}
                                value={nickname}
                                editable={editable}
                                placeholderTextColor={editable ? 'black' : 'gray'}
                            />
                            {nicknameError && <View style={globalStyles.errorBox}>
                                <Text style={globalStyles.errorMessage}>{nicknameError}</Text>            
                              </View>
                            }
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
  }
})

export default Profile;
