import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';

const Steps = ({ navigation }) => {
    const [index, setIndex] = useState(0);

    const butNext = () => {
        setIndex((prevIndex) => prevIndex + 1);
    };

    const butBack = () => {
        setIndex((prevIndex) => prevIndex - 1);
    };

    const text = [
        "Encontre sua equipe, participe de partidas e viva a paixão pelo esporte!",
        "Segundo texto",
        "Terceiro texto",
        "Cadastre-se ou faça login para reservar quadras, conectar-se com outros jogadores e organizar partidas."
    ];

    const title = [
        "Bem-Vindo ao Squadra",
        "Segundo título",
        "Terceiro título",
        "Comece sua jornada"
    ];

    const points = [null, null, null, null];

    return (
        <View style={styles.Body}>
            <View style={styles.bg}>
                <Image
                    source={require('../../assets/images/stepbg.png')}
                    style={styles.head}
                />
            </View>

            <View style={styles.section}>
           
                <Text style={styles.Title}>{title[index]}</Text>
                <Text style={styles.Text}>{text[index]}</Text>

                {index !== 0 && index < 3 && (
                    <TouchableOpacity style={styles.buttonBack} onPress={butBack}>
                        <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>
                )}
                
                {index < 3 && (
                    <TouchableOpacity style={styles.buttonNext} onPress={butNext}>
                        <Text style={styles.buttonText}>Próximo</Text>
                    </TouchableOpacity>
                )}

                {index === 3 && (
                    <TouchableOpacity style={styles.buttonReg} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                )}
                 {index === 3 && (
                    <TouchableOpacity style={styles.buttonLog} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                )}
                {index === 3 && (
           
                    <TouchableOpacity style={styles.buttonBack3} onPress={butBack}>
                       <Text style={styles.buttonText}>&lt;</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.Text}>{points[index]}</Text>
                </View>
        
        </View>
    );
};

const styles = StyleSheet.create({
    Body: {
        height: 1920,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bg: {
        width: '100%',
        height: '100%',
        backgroundColor: '#28597C',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    head: {
        height: 800,
        width: 400,
        bottom: 100,
        opacity: 0.5,
    },
    section: {
        backgroundColor: '#ffffff',
        padding: 30,
        paddingTop: 60,
        height: 350,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        fontSize: 40,
        gap: 15,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },

    Title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#37A0EC',
        textAlign: 'center',
    },
    Text: {
        fontSize: 15.2,
        color: 'black',
        textAlign: 'center',
    },
    buttonNext: {
        padding: 10,
        borderColor: '#FF7014',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 30,
        alignItems: 'center',
        width: 130,
        position: 'absolute',
        bottom: 50,
        right: 20,
    },
    buttonBack: {
        padding: 10,
        borderColor: '#FF7014',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 30,
        alignItems: 'center',
        width: 130,
        position: 'absolute',
        bottom: 50,
        left: 20,
    },
    buttonBack3: {
        justifyContent: 'center',
        borderColor: '#FF7014',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 50,
        alignItems: 'center',
        width: 40,
        height: 40,
        position: 'absolute',
        top: 20,
        left: 20,
    },
    buttonReg: {
        padding: 10,
        borderColor: '#FF7014',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 30,
        alignItems: 'center',
        width: 130,
        position: 'absolute',
        bottom: 80,
        left: 52,
    },
    buttonLog: {
        padding: 10,
        borderColor: '#FF7014',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 30,
        alignItems: 'center',
        width: 130,
        position: 'absolute',
        bottom: 80,
        right: 52,
    },
    buttonText: {
        color: '#FF7014',
        fontWeight: 'bold',
    },
    next: {
        left: 0,
        bottom: 12,
        height: 20,
        width: 400,
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'center',
        position: 'absolute',
        backgroundColor: '#19191919',
    },
    selec: {
        color: 'white',
        fontSize: 50,
        bottom: 0,
        position: 'absolute',
    },
    unselec: {
        fontSize: 50,
        color: 'gray',
        position: 'absolute',
        bottom: 0,
    },
    points: {
        backgroundColor: 'red',
        width: 100,
        height: 100,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
        bottom: 10,
        right: 0,
    },
});

export default Steps;
