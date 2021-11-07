import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { Modalize } from 'react-native-modalize'
import CheckBox from '@react-native-community/checkbox';
import { Portal } from 'react-native-portalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMoney } from '../context/Money';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Setting() {
    const { setPasswordScreen, setActivePassword, activePassword} = useMoney()
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [checkBox, setCheckBox] = useState(true)
    const [modalPassword, setModalPassword] = useState(false)
    const modalizeRef = useRef(null)
    const [showPassword, setShowPassword] = useState(true)
    const [wrongPassword, setWrongPassword] = useState(false)

    function onOpen() {
        modalizeRef.current?.open();
    }

    function show() {
        if (showPassword) {
            setShowPassword(false)
        }
        else {
            setShowPassword(true)
        }
    }

    async function addPassword(){
        if(repeatPassword !== password){
            setWrongPassword(true)
        }
        else{
            setActivePassword(true)
            setPasswordScreen(password)
            modalizeRef.current?.close()
        }
    }
    useEffect(async()=>{
        const getCheckBox = await AsyncStorage.getItem('@checkBox')
        if(getCheckBox){
            setCheckBox(getCheckBox)
            console.log(checkBox)
        }
    },[])

    useEffect(()=>{
        async function saveCheck(){
            await AsyncStorage.setItem('@checkBox', JSON.stringify(checkBox))
        }
        saveCheck()
    },[checkBox])

    return (
        <View style={styles.container}>
            <Text style={styles.titleHeader}>Configurações:</Text>
            <View>
                <View style={{ flexDirection: 'row', padding: 5, marginTop: 35, marginLeft: 15 }}>
                    <Text style={styles.questionPassword}>Colocar senha de acesso ao entrar:</Text>
                    <CheckBox disabled={false} style={{ padding: 0, marginTop: -1, marginLeft: 5 }} tintColors={'#000'} value={checkBox} onValueChange={(value) => setCheckBox(value)} />
                </View>
                {checkBox && <View style={{ padding: 5, marginLeft: 15 }}>
                    <TouchableOpacity style={styles.buttonPassword} onPress={onOpen}>
                        <Text style={styles.textQuestionPassword}>Definir senha</Text>
                    </TouchableOpacity>
                </View>}

                <Portal>
                    <Modalize ref={modalizeRef} adjustToContentHeight={true} snapPoint={300} HeaderComponent={
                        <View>
                            <Text style={styles.headerModal}>Redefinir Senha:</Text>
                        </View>
                    }>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.labelPassword}>Senha:</Text>
                                <View style={styles.viewInputPassword}>
                                    <TextInput style={styles.inputPassword} placeholderTextColor='#FFF' secureTextEntry={showPassword} keyboardType={'number-pad'} value={password} onChangeText={(test) => setPassword(test)} />
                                    <TouchableOpacity onPress={show}>
                                        {showPassword ? <Icon style={styles.iconShow} name="eye" size={25} color="#000" /> : <Icon style={styles.iconShow} name="eye-off" size={25} color="#000" />}
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.labelPassword, { marginTop: 15 }]}>Confirme a senha:</Text>
                                <View style={styles.viewInputPassword}>
                                    <TextInput style={[styles.inputPassword,{width:370}]} keyboardType={'number-pad'} secureTextEntry={showPassword} value={repeatPassword} onChangeText={(test) => setRepeatPassword(test)} />
                                </View>
                                {wrongPassword&&<Text style={styles.wrongPassword}>A senha não corresponde!</Text>}
                                <TouchableOpacity style={styles.submitPassword} onPress={addPassword}>
                                    <Text style={styles.textSubmitPassword}>Definir Senha</Text>
                                </TouchableOpacity>
                            </View>

                    </Modalize>
                </Portal>

            </View>
        </View >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleHeader: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        padding: 15,
        backgroundColor: '#D8D8D8',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    questionPassword: {
        fontSize: 17
    },
    textQuestionPassword: {
        fontSize: 16,
        textAlign: 'center',
        color: '#FFF'
    },
    buttonPassword: {
        backgroundColor: '#FF7800',
        width: 150,
        padding: 7,
        borderRadius: 10
    },
    headerModal: {
        fontSize: 18,
        textAlign: 'center',
        padding: 8,
        backgroundColor: '#FF9433',
        color: '#FFF',
        borderRadius: 10,
        marginBottom: 10
    },
    labelPassword: {
        fontSize: 17,
        padding: 3,
        marginLeft: 10,
    },
    inputPassword: {
        alignSelf: 'center',
        width: 340,
    },
    submitPassword: {
        padding: 10,
        backgroundColor: '#FFA14B',
        width: 250,
        alignSelf: 'center',
        margin: 15,
        marginTop: 35,
        borderRadius: 20
    },
    textSubmitPassword: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    viewInputPassword: {
        flexDirection: 'row',
        backgroundColor: '#FFB97A',
        borderRadius: 20,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 400
    },
    iconShow: {
        borderLeftWidth: 1,
        borderColor: '#000',
        paddingLeft: 8
    },
    wrongPassword:{
        fontSize:14,
        fontStyle:'italic',
        padding:3,
        marginLeft:6,
        color:'#FF0000'
    }
})