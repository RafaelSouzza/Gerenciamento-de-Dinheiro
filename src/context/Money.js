import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContextMoney = createContext();
export default function ContextProvider({ children }) {
    const [money, setMoney] = useState('')
    const [lucro, setLucro] = useState(0)
    const [despesa, setDespesa] = useState(0)
    const [passwordScreen, setPasswordScreen] = useState('')
    const [activePassword, setActivePassword] = useState(false)
    const [cash, setCash] = useState('')

    useEffect(async () => {
        const getStoreHomeLucro = await AsyncStorage.getItem('@valueLucro')
        const getStoreHomeDespesa = await AsyncStorage.getItem('@valueDespesa')
        const getStoreCash = await AsyncStorage.getItem('@valueCash')
        const getStorePassword = await AsyncStorage.getItem('@password')
        const getStoreActivePassword = await AsyncStorage.getItem('@activePassword')
        if (getStoreHomeLucro || getStoreHomeDespesa || getStorePassword || getStoreActivePassword) {
            setLucro(JSON.parse(getStoreHomeLucro))
            setDespesa(JSON.parse(getStoreHomeDespesa))
            setCash(JSON.parse(getStoreCash))
            setActivePassword(getStoreActivePassword)
            setPasswordScreen(JSON.parse(getStorePassword))
        }
    }, [])

    useEffect(() => {
        async function saveLucroDespesa() {
            await AsyncStorage.setItem('@valueLucro', JSON.stringify(lucro))
            await AsyncStorage.setItem('@valueDespesa', JSON.stringify(despesa))
            await AsyncStorage.setItem('@valueCash', JSON.stringify(cash))
            await AsyncStorage.setItem('@password', JSON.stringify(passwordScreen))
            await AsyncStorage.setItem('@activePassword', JSON.stringify(activePassword))
        }
        saveLucroDespesa()
        let subtracao = (lucro + cash) - despesa
        setMoney(subtracao)
    }, [lucro, despesa, passwordScreen, activePassword, cash])

    const values = { cash, setCash, money, setMoney, lucro, setLucro, despesa, setDespesa, passwordScreen, setPasswordScreen, activePassword, setActivePassword }

    return (
        <ContextMoney.Provider value={values}>
            {children}
        </ContextMoney.Provider>
    )
}

export function useMoney() {
    const context = useContext(ContextMoney)
    const values = context;
    return values;
}