import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

const ImagePickerComponent = ({ image, setImage, editable, circled }) => {
    
    const pickImage = async () => { 
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        }).then((res) => {
            if (!res.canceled) {
                setImage(res.assets[0].uri);
            }
            else {
                console.log("cancelled");
            }
        });
    };

    return (
        <>
            {
                image !== '../assets/chef.png' ? (
                    <View style={styles.imageBox}>
                        <Image
                            source={{ uri: image }}
                            style={[styles.imageStyle, circled && styles.circularImage]}
                        />

                        {editable &&
                            <TouchableOpacity
                                onPress={() => setImage('../assets/chef.png')}
                                style={styles.button}>
                                <FontAwesome name='trash-o' size={20} />
                            </TouchableOpacity>
                        }

                    </View>
                ) : (
                    <View style={styles.imageBox}>
                        <Image
                            source={require('../assets/chef.png')}
                            style={[styles.imageStyle, circled && styles.circularImage]}
                        />
                        {editable &&
                            <TouchableOpacity
                                onPress={pickImage}
                                style={styles.button}>
                                <FontAwesome name='upload' size={20} />
                            </TouchableOpacity>
                        }
                    </View>
                )
            }
        </>
    )
        
}

const styles = StyleSheet.create({
    imageBox: {
        flex: 2,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: 120,
        height: 120,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black'
    },
    circularImage: {
        borderRadius: 60,
    },
    button: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 15,
        padding: 5,
    },
})

export default ImagePickerComponent;
