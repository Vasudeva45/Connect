import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TextInput, Alert, Clipboard } from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import axios from 'axios';

const SERVER_URL = 'http://localhost:8000/generate-token';

const HomeScreen = () => {
    const [videoCall, setVideoCall] = useState(false);
    const [inputChannelCode, setInputChannelCode] = useState('');
    const [token, setToken] = useState('');
    const [channelCode, setChannelCode] = useState('');

    const createCall = async () => {
        const newChannelCode = 'roomCode' + Math.floor(Math.random() * 10000);
        setChannelCode(newChannelCode);

        try {
            const response = await axios.post(SERVER_URL, {
                channelName: newChannelCode,
                uid: 0,
            });

            console.log('Token received from server:', response.data.token);
            setToken(response.data.token);
            setVideoCall(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to generate token.');
        }
    };

    const joinCall = async () => {
        if (inputChannelCode) {
            try {
                const response = await axios.post(SERVER_URL, {
                    channelName: inputChannelCode,
                    uid: 0,
                });

                console.log('Token received from server:', response.data.token);
                setToken(response.data.token);
                setVideoCall(true);
            } catch (error) {
                Alert.alert('Error', 'Failed to generate token.');
            }
        } else {
            Alert.alert('Invalid Channel Code', 'Please enter a channel code.');
        }
    };


    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        Alert.alert('Channel Code Copied', 'The channel code has been copied to your clipboard.');
    };

    const connectionData = {
        appId: '77b6a4ab3cb44436a5a3205a061ac701',
        channel: channelCode,
        token: token,
    };


    const rtcCallbacks = {
        EndCall: () => {
            setVideoCall(false);
        },
        OnError: (error) => {
            console.error('Agora Error:', error);
        },
    };


    return videoCall ? (
        <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
    ) : (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Button title="Create Call" onPress={createCall} />
                <View style={styles.generatedCodeContainer}>
                    <Text style={styles.generatedCodeText}>Your Channel Code: {channelCode}</Text>
                    <Button title="Copy Code" onPress={() => copyToClipboard(channelCode)} />
                </View>
                <Text style={styles.description}>Or join a call with a code:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Channel Code"
                    value={inputChannelCode}
                    onChangeText={setInputChannelCode}
                />
                <Button title="Join Call" onPress={joinCall} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 18,
        marginTop: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginVertical: 12,
        width: '80%',
    },
    generatedCodeContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    generatedCodeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
