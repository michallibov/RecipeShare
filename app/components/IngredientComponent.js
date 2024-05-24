import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';

const IngredientComponent = ({ 
    item = {}, 
    onMeasurementChange = () => {}, 
    onQuantityChange = () => {}, 
    onNameChange = () => {}, 
    onDelete = () => {} 
}) => {
    const [measurement, setMeasurement] = useState(item.measurement ? item.measurement : '');
    const [name, setName] = useState(item.name ? item.name : '');
    const [quantity, setQuantity] = useState(item.quantity ? item.quantity : '');

    useEffect(() => {
        setMeasurement(item.measurement || '');
    }, [item.measurement]);

    const measurements = [
        { label: 'Teaspoon', value: '1' },
        { label: 'Tablespoon', value: '2' },
        { label: 'Cup', value: '3' },
        { label: 'Fluid Ounce', value: '4' },
        { label: 'Pint', value: '5' },
        { label: 'Quart', value: '6' },
        { label: 'Gallon', value: '7' },
        { label: 'Milliliter', value: '8' },
        { label: 'Liter', value: '9' },
        { label: 'Gram', value: '10' },
        { label: 'Kilogram', value: '11' },
        { label: 'Piece', value: '12'},
        {label: '', value: '13'}
    ];

    const renderLabel = (item,index) => {
        const isSelected = item.value === measurement.value;

        return (
            <View key={item.value}>
                <TouchableOpacity onPress={() => onMeasurementChange(item)}>
                    <Text style={[styles.labelStyle, isSelected && styles.boldLabel]}>
                        {item.label}
                    </Text>
                </TouchableOpacity>
                {index < measurements.length - 1 && <View style={styles.separator} />}
        </View>
        );
    };

    return (
        <View key={item.id} style={styles.ingredientItem}>
            <TextInput
                style={[styles.input, styles.quantity]}
                placeholder='Quantity'
                value={quantity}
                onChangeText={(text) => {
                    onQuantityChange(text);
                    setQuantity(text);
                }}
                keyboardType='numeric'
                placeholderTextColor='white'
            />
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={measurements}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={measurement}
                onChange={(selectedItem) => {
                    setMeasurement(selectedItem.label); // Update local state with the selected label
                    onMeasurementChange(selectedItem.label); // Update parent state with the selected label
                }}
                renderItem={renderLabel}
                ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                )}
            />
            <TextInput
                style={styles.input}
                placeholder="Ingredient name"
                value={name}
                onChangeText={(text) => {
                    onNameChange(text);
                    setName(text);
                }}
                placeholderTextColor='white'
            />
            <TouchableOpacity
                onPress={() => onDelete(item.id)}
                style={styles.deleteButton}>
                <FontAwesome name='trash-o' size={20} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 8,
        padding: 8,
        borderRadius: 10,
        color: 'white',
        flex: 4,
        backgroundColor: '#846444', 
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        justifyContent: 'space-between'
    },
    quantity: {
        flex: 2,
    },
    dropdown: {
        marginHorizontal: 4,
        borderBottomColor: 'white',
        borderBottomWidth: 0.5,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        flex: 3,
        height: 40,
        padding: 4,
        marginBottom: 8,
        backgroundColor: '#846444', 
    },
    placeholderStyle: {
        fontSize: 13,
        color: 'white',
    },
    selectedTextStyle: {
        fontSize: 13,
        color: 'white',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 5,
        marginLeft: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'black'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 13,
        color: 'white'
    },
    labelStyle: {
        fontSize: 15,
        margin: 2,
        marginBottom: 5,
        padding: 2,
        borderRadius: 5,
    },
    boldLabel: {
        fontWeight: 'bold'
    },
    separator: {
        height: 1,
        backgroundColor: 'gray',
    },
});

export default IngredientComponent;
