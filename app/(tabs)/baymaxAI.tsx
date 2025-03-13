import React, { useState, useEffect } from 'react';
import { sendChatMessage } from '../services/chatbotapi';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming 
} from 'react-native-reanimated';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  fullText?: string;
}

const CHARS_BEFORE_SKIP = 40; // Approximately 7-8 words

export default function BaymaxAIScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const typingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Generate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Initialize welcome message with typing animation
  useEffect(() => {
    const welcomeText = `${getGreeting()} ${user?.displayName || 'there'}! I'm Baymax, ready to assist you.`;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= 30) {
        setMessages([{
          role: 'assistant',
          content: welcomeText.slice(0, currentIndex),
          isTyping: true
        }]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setMessages([{
          role: 'assistant',
          content: welcomeText,
          isTyping: false
        }]);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [user?.displayName]);

  // Blinking cursor component
  const BlinkingCursor = () => {
    const opacity = useSharedValue(1);

    useEffect(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    return <Animated.Text style={[styles.cursor, animatedStyle]}>|</Animated.Text>;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      isTyping: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const typingMessage: Message = {
        role: 'assistant',
        content: '',
        isTyping: true
      };
      
      setMessages(prev => [...prev, typingMessage]);

      // Use the API service instead of direct client call
      const responseText = await sendChatMessage(inputMessage);
      let currentIndex = 0;

      const startTypingAnimation = () => {
        typingIntervalRef.current = setInterval(() => {
          if (currentIndex < responseText.length) {
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: responseText.slice(0, currentIndex + 1),
                isTyping: true,
                fullText: responseText
              };
              return newMessages;
            });
            currentIndex++;
          } else {
            if (typingIntervalRef.current) {
              clearInterval(typingIntervalRef.current);
            }
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: responseText,
                isTyping: false
              };
              return newMessages;
            });
          }
        }, 30);
      };

      startTypingAnimation();

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
          isTyping: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessageContent = (message: Message) => {
    const showSkipButton = 
      message.isTyping && 
      message.role === 'assistant' && 
      message.content.length > CHARS_BEFORE_SKIP;

    return (
      <View>
        <View style={[
          styles.messageContent,
          message.role === 'user' ? styles.userMessageContent : styles.assistantMessageContent
        ]}>
          <Text style={[
            styles.messageText,
            message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
          ]}>
            {message.content}
            {message.isTyping && <BlinkingCursor />}
          </Text>
        </View>
        {showSkipButton && (
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              if (message.fullText && typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
                setMessages(prev => prev.map((msg, idx) => 
                  idx === prev.length - 1 
                    ? { ...msg, content: message.fullText!, isTyping: false }
                    : msg
                ));
              }
            }}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/images/Baymax1.jpg')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Baymax AI</Text>
              <Text style={styles.statusText}>Online - Ready to help</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          ref={scrollViewRef}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          showsVerticalScrollIndicator={true}
          bounces={true}
          overScrollMode="always"
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              ]}
            >
              {message.role === 'assistant' && (
                <Image 
                  source={require('../../assets/images/Baymax1.jpg')}
                  style={styles.messageAvatar}
                />
              )}
              {renderMessageContent(message)}
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.inputContainer}>
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Ask Baymax anything..."
              placeholderTextColor="#999"
              multiline
              style={[styles.input, { maxHeight: 100 }]}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !inputMessage.trim() && styles.disabledButton
              ]} 
              onPress={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D6C7E',
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 140,
  },
  chatContent: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  messageContent: {
    borderRadius: 20,
    padding: 12,
    maxWidth: '100%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  userMessageContent: {
    backgroundColor: '#0D6C7E',
  },
  assistantMessageContent: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#333333',
  },
  cursor: {
    color: '#0D6C7E',
    fontWeight: 'bold',
  },
  keyboardAvoidingView: {
    position: 'absolute',
    bottom: 65,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  inputContainer: {
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    padding: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    backgroundColor: '#F4A261',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    marginLeft: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
  },
  skipButtonText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
  },
});
