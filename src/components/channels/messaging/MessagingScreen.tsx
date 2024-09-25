import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ws_main_url } from '../../../constants/Urls';
import NetInfo from '@react-native-community/netinfo';
import { UserDelete } from 'stream-chat-expo';

const MessagingScreen = ({ roomName }) => {
    const [messages, setMessages] = useState([]);
    const [onlinemessages, setOnlineMessages] = useState([]);
    const [typingmessages, setTypingMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const clientRef = useRef(null);
    const flatListRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [typing, setTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        const loadUserData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('UserData');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    if(!userData){
                        setUserData(parsedData);
                    }
                } else {
                    console.log("No user data found");
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };
        

        const loadMessages = async () => {
            try {
                const storedMessages = await AsyncStorage.getItem('messages');
                if (storedMessages) {
                    const parsedMessages = JSON.parse(storedMessages);
                    if (Array.isArray(parsedMessages)) {
                        setMessages(parsedMessages);
                        console.log("Loaded messages", parsedMessages);
                    } else {
                        console.error('Stored messages are not an array:', parsedMessages);
                    }
                }
            } catch (error) {
                console.error('Failed to load the messages:', error);
            }
        };

        const connectWebSocket = (userdata: { id: any; } | null) => {
            const wsUrl = `ws:${Ws_main_url}/ws/chat/${roomName}/`;
            clientRef.current = new WebSocket(wsUrl);

            clientRef.current.onopen = () => {
                console.log('WebSocket Client Connected');
            };

            clientRef.current.onmessage = (message) => {
                console.log('Received message:', message.data);
                const newMessage = JSON.parse(message.data);

                if (newMessage.text === 'typing') {
                    setTypingMessages((prevMessages) => [...prevMessages, newMessage]);
                } else if (newMessage.text === 'Online') {
                    setOnlineMessages((prevMessages) => [...prevMessages, newMessage]);
                } else if (newMessage.text === 'stoped typing') {
                    setTypingMessages([]);
                } else {
                    if (newMessage.status !== 3) {
                        console.log("message received", newMessage);
                       
                        console.log("showing correct user id=====================", userdata.id);
                        if (userdata.id !== newMessage.sender) {
                            console.log("second send message", newMessage);

                            newMessage.status = 3;
                            console.log("this is Nigel test", newMessage);
                            clientRef.current.send(JSON.stringify(newMessage));
                            saveMessage(newMessage);
                        } else {
                            console.log("testing receptions");
                        }

                        setMessages((prevMessages) => [...prevMessages, newMessage]);
                    }
                }
            };

            clientRef.current.onerror = (error) => {
                console.error('WebSocket Error:', error.message);
            };

            clientRef.current.onclose = (event) => {
                console.log('WebSocket Client Closed:', event.code, event.reason);
            };
        };

        const saveMessage = async (message) => {
            try {
                const storedMessages = await AsyncStorage.getItem('messages');
                let messagesArray = storedMessages ? JSON.parse(storedMessages) : [];

                const existingMessageIndex = messagesArray.findIndex(msg => msg.timestamp === message.timestamp);

                if (existingMessageIndex !== -1) {
                    messagesArray[existingMessageIndex] = message;
                    console.log('Message updated successfully');
                } else {
                    messagesArray.push(message);
                    console.log('Message added successfully');
                }

                await AsyncStorage.setItem('messages', JSON.stringify(messagesArray));
            } catch (error) {
                console.error('Failed to save or update the message:', error);
            }
        };

        const scrollToBottom = () => {
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        };

        loadUserData();
        loadMessages();
        connectWebSocket(userData);

        return () => {
            if (clientRef.current) {
                clientRef.current.close();
            }
            unsubscribe();
        };
    }, [roomName]);

    const sendMessage = () => {
        if (inputText.trim() !== '') {
            if (!userData) {
                console.error('User data not available');
                return;
            }

            const newMessage = {
                text: inputText,
                sender: userData.id,
                status: 0,
                timestamp: Date.now(),
            };

            const newMessage1 = {
                text: inputText,
                sender: userData.id,
                status: 1,
                timestamp: Date.now(),
            };

            if (!isConnected) {
                saveMessage(newMessage);
                console.log("No internet");
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } else {
                saveMessage(newMessage1);
                console.log("Has internet");
            }

            if (isConnected) {
                console.log('Sending message:', newMessage1);
                if (clientRef.current && clientRef.current.readyState === WebSocket.OPEN) {
                    clientRef.current.send(JSON.stringify(newMessage1));
                    setInputText('');
                    if (clientRef.current && clientRef.current.readyState === WebSocket.OPEN) {
                        clientRef.current.send(JSON.stringify({
                            text: 'stoped typing',
                            sender: userData.id,
                            status: 'check',
                            timestamp: Date.now(),
                        }));
                    }
                } else {
                    console.log('WebSocket is not open. Unable to send message.');
                }
            }
        }
    };

    const handleTyping = (text) => {
        setInputText(text);
        if (text !== '') {
            if (clientRef.current && clientRef.current.readyState === WebSocket.OPEN) {
                clientRef.current.send(JSON.stringify({
                    text: 'typing',
                    sender: userData.id,
                    status: 'check',
                    timestamp: Date.now(),
                }));
            }
        } else {
            if (clientRef.current && clientRef.current.readyState === WebSocket.OPEN) {
                clientRef.current.send(JSON.stringify({
                    text: 'stoped typing',
                    sender: userData.id,
                    status: 'check',
                    timestamp: Date.now(),
                }));
            }
        }
    };

    const isMyMessage = (senderId) => {
        return senderId === userData.id;
    };

    const renderMessage = ({ item }) => {
        const messageAlignment = item.sender === userData.id ? 'flex-end' : 'flex-start';
        const messageBackgroundColor = item.sender === userData.id ? '#DCF8C6' : 'silver';

        return (
            <View style={[styles.messageContainer, { justifyContent: messageAlignment }]}>
                <View style={[styles.messageBubble, { backgroundColor: messageBackgroundColor }]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.timestampText}>
                        {new Date(item.timestamp).toLocaleString()}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={{ flexGrow: 1 }}
                inverted={false} // Set to true if you want to reverse the order of messages
            />

            {typingmessages?.length > 0 && typingmessages[0]?.sender !== userData.id ? (
                <Text style={styles.typingText}>{typingmessages[0]?.sender} is typing...</Text>
            ) : null}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={handleTyping}
                    placeholder="Type a message"
                />
                <TouchableOpacity onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
    },
    messageText: {
        fontSize: 16,
    },
    timestampText: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
    },
    sendButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    typingText: {
        color: '#808080',
        fontStyle: 'italic',
        marginVertical: 4,
    },
});

export default MessagingScreen;
