import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Image, useColorScheme, Button, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { main_url } from '../../constants/Urls';
import { ThemeColors } from '../../constants/thems';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewEvent({ visible, onClose, setOverview, eventId = null}) {
  const [eventName, setEventName] = useState('');
const [eventDescription, setEventDescription] = useState('');
const [eventType, setEventType] = useState('unpaid');
const [eventPrice, setEventPrice] = useState('');
const [eventPaymentLink, setEventPaymentLink] = useState('');
const [paymentMethod, setPaymentMethod] = useState('');
const [joinChannel, setJoinChannel] = useState(false);
const [requireForm, setRequireForm] = useState(false);
const [requireAttendeeForm, setRequireAttendeeForm] = useState(false);
const [image, setImage] = useState(null);
const scheme = useColorScheme();
const themeColors = ThemeColors[scheme];
const [eventDate, setEventDate] = useState(new Date()); // Use a Date object
const [showDatePicker, setShowDatePicker] = useState(false);
// State for two different sets of form questions
const [formQuestions, setFormQuestions] = useState([{ id: 1, question: '', type: 'mcq', options: [], answer: '', wordLimit: '' }]);
const [formQuestions2, setFormQuestions2] = useState([{ id: 1, question: '', type: 'mcq', options: [], answer: '', wordLimit: '' }]);

const onChange = (event, selectedDate) => {
  const currentDate = selectedDate || eventDate;
  setShowDatePicker(Platform.OS === 'ios'); // If iOS, keep the picker open
  setEventDate(currentDate); // Update the event date
};

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const jsonObject = JSON.parse(token);
      const response = await axios.get(`${main_url}/api/events/${eventId}/`, {
        headers: {
          'Authorization': `Bearer ${jsonObject.access}`,
        },
      });

      const data = response.data;

      // Check if 'image' exists and is not null before applying 'replace'
      const event_image = data.image ? `${main_url.replace(/\/$/, '')}/${data.image.replace(/^\//, '')}` : null;

      setEventName(data.name || '');
      setEventDescription(data.description || '');
      setEventType(data.type || 'unpaid'); // Default to 'unpaid'
      setEventPaymentLink(data.eventPaymentLink || '');
      setPaymentMethod(data.paymentMethod || '');
      setJoinChannel(data.allowJoinChannel || false);
      setRequireForm(data.requireForm || false);
      setRequireAttendeeForm(data.requireAttendeeForm || false);
      setFormQuestions(data.formQuestions || []); // Default to empty array if null
      setFormQuestions2(data.formQuestions2 || []); // Default to empty array if null
      setImage(event_image); // Set the image or null
      setEventPrice(data.price ? `${data.price}` : '');

      if (data.date) {
        const eventDate = new Date(data.date);
        if (!isNaN(eventDate.getTime())) {
          setEventDate(eventDate);
        } else {
          console.warn("Invalid event date format");
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load events.');
    }
  };

  if (visible) {
    if (eventId) {
      fetchEvents();
    }
  }
}, [visible]);


// Common function to handle changes for both formQuestions and formQuestions2
const handleQuestionChange = (formId, id, field, value) => {
  let updatedQuestions;

  if (formId === 'formQuestions') {
    updatedQuestions = formQuestions.map(q => q.id === id ? { ...q, [field]: value } : q);
    setFormQuestions(updatedQuestions);
  } else if (formId === 'formQuestions2') {
    updatedQuestions = formQuestions2.map(q => q.id === id ? { ...q, [field]: value } : q);
    setFormQuestions2(updatedQuestions);
  }
};

// Handle options change for both forms
const handleOptionChange = (formId, questionId, index, value) => {
  const updatedQuestions = formId === 'formQuestions' ? [...formQuestions] : [...formQuestions2];
  const question = updatedQuestions.find(q => q.id === questionId);
  
  if (question && question.options) {
    const updatedOptions = question.options.map((opt, i) => (i === index ? { ...opt, text: value } : opt));
    const finalQuestions = updatedQuestions.map(q => (q.id === questionId ? { ...q, options: updatedOptions } : q));

    formId === 'formQuestions' ? setFormQuestions(finalQuestions) : setFormQuestions2(finalQuestions);
  }
};

// Handle the addition of questions
const addFormQuestion = (formId) => {
  const newQuestion = { id: (formId === 'formQuestions' ? formQuestions : formQuestions2).length + 1, question: '', type: 'mcq', options: [], answer: '', wordLimit: '' };
  formId === 'formQuestions' ? setFormQuestions([...formQuestions, newQuestion]) : setFormQuestions2([...formQuestions2, newQuestion]);
};

// Handle the removal of questions
const removeFormQuestion = (formId, id) => {
  const updatedQuestions = (formId === 'formQuestions' ? formQuestions : formQuestions2).filter((q) => q.id !== id);
  formId === 'formQuestions' ? setFormQuestions(updatedQuestions) : setFormQuestions2(updatedQuestions);
};

// Handle the addition of options
const handleAddOption = (formId, questionId) => {
  const updatedQuestions = formId === 'formQuestions' ? [...formQuestions] : [...formQuestions2];
  const question = updatedQuestions.find(q => q.id === questionId);

  if (question && question.options) {
    const newOptions = [...question.options, { text: '' }];
    const finalQuestions = updatedQuestions.map(q => (q.id === questionId ? { ...q, options: newOptions } : q));

    formId === 'formQuestions' ? setFormQuestions(finalQuestions) : setFormQuestions2(finalQuestions);
  }
};

// Handle correct answer selection
const handleCorrectOptionChange = (formId, questionId, optionIndex) => {
  const updatedQuestions = formId === 'formQuestions' ? [...formQuestions] : [...formQuestions2];
  const finalQuestions = updatedQuestions.map(q => (q.id === questionId ? { ...q, correctOption: optionIndex } : q));

  formId === 'formQuestions' ? setFormQuestions(finalQuestions) : setFormQuestions2(finalQuestions);
};

// Function to handle image selection
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri); // Access the image URI from the result
  }
};

const handleSaveEvent = async () => {
  if (!eventName || !eventDescription || !eventDate) {
    Alert.alert("Please fill in all required fields.");
    return;
  }

  // Process form questions
  const processedFormQuestions = formQuestions.map((q) => {
    if (q.type === 'mcq') {
      return {
        ...q,
        answer: q.correctOption !== undefined ? [q.correctOption] : [],
      };
    }
    return q;
  });

  const processedFormQuestions2 = formQuestions2.map((q) => {
    if (q.type === 'mcq') {
      return {
        ...q,
        answer: q.correctOption !== undefined ? [q.correctOption] : [],
      };
    }
    return q;
  });

  const eventData = {
    channel: setOverview.id,
    name: eventName,
    description: eventDescription,
    date: eventDate,
    type: eventType,
    price: eventType === 'paid' ? eventPrice : undefined, // Set to undefined if unpaid
    eventPaymentLink: eventType === 'paid' ? eventPaymentLink : undefined,
    paymentMethod: eventType === 'paid' ? paymentMethod : undefined,
    allowJoinChannel: joinChannel,
    requireForm,
    requireAttendeeForm,
    formQuestions: processedFormQuestions,
    formQuestions2: processedFormQuestions2,
  };

  // Remove undefined values from eventData
  const cleanEventData = Object.fromEntries(
    Object.entries(eventData).filter(([_, v]) => v !== undefined)
  );

  const formData = new FormData();
  formData.append('eventData', JSON.stringify(cleanEventData));
  if (image) {
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'event-image.jpg',
    });
  }

  try {
    const token = await AsyncStorage.getItem('userToken');
    const jsonObject = JSON.parse(token);
    let response = null;
    if (eventId) {
      response = await axios.put(`${main_url}/api/events/${eventId}/`, formData, {
        headers: {
          'Authorization': `Bearer ${jsonObject.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await axios.post(`${main_url}/api/events/`, formData, {
        headers: {
          'Authorization': `Bearer ${jsonObject.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    if (response && response.status === 200) {
      Alert.alert('Success', 'Event saved successfully.');
      onClose();
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to save the event.');
  }
};





  return (
    <Modal style={{ backgroundColor: themeColors.background }} visible={visible} animationType="slide">
      <View  style={[styles.backButtonContainer, { backgroundColor: themeColors.background }]}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create Event</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleSaveEvent}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      <KeyboardAvoidingView style={[styles.modalContainer, { backgroundColor: themeColors.background }]} behavior="padding">
        <ScrollView  style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={styles.input}
            value={eventName}
            onChangeText={setEventName}
            placeholder="Enter event name"
          />

          <Text style={styles.label}>Event Description</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={eventDescription}
            onChangeText={setEventDescription}
            placeholder="Enter event description"
            multiline
          />

          <View>
            <Text style={styles.label}>Event Date</Text>

            {/* Display a button to show the date picker */}
            <Button onPress={() => setShowDatePicker(true)} title="Select Event Date" />

            {/* Display the selected date in a readable format */}
            <Text style={styles.input}>{eventDate.toISOString().split('T')[0]}</Text>

            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>Pick an Event Image</Text>
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          )}

          <Text style={styles.label}>Event Type</Text>
          <Picker selectedValue={eventType} onValueChange={setEventType} style={styles.picker}>
            <Picker.Item label="Unpaid" value="unpaid" />
            <Picker.Item label="Paid" value="paid" />
          </Picker>

          {/* Conditional Paid fields */}
          {eventType === 'paid' && (
            <>
              <Text style={styles.label}>Event Price</Text>
              <TextInput
                style={styles.input}
                value={eventPrice}
                onChangeText={setEventPrice}
                placeholder="Enter price"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Payment Method</Text>
              <Picker selectedValue={paymentMethod} onValueChange={setPaymentMethod} style={styles.picker}>
                <Picker.Item label="Credit Card" value="credit_card" />
                <Picker.Item label="Paypal" value="paypal" />
                <Picker.Item label="Cash" value="cash" />
              </Picker>

              <Text style={styles.label}>payment link or contact</Text>
              <TextInput
                style={styles.input}
                value={eventPaymentLink}
                onChangeText={setEventPaymentLink}
                placeholder="Enter price"
                keyboardType="numeric"
              />
            </>
          )}
          <Text style={styles.label}>Require Attend Event Form?</Text>
          <Picker selectedValue={requireAttendeeForm} onValueChange={setRequireAttendeeForm} style={styles.picker}>
            <Picker.Item label="No" value={false} />
            <Picker.Item label="Yes" value={true} />
          </Picker>

          {/* First Dynamic Form */}
          {requireAttendeeForm && (
            <View style={{ marginBottom: 30 }}>
              <Text style={styles.label}>Attendee Form Questions</Text>
              {formQuestions.map((q, index) => (
                <View key={q.id} style={styles.formQuestionContainer}>
                  <Text style={styles.label}>Question {index + 1}</Text>
                  <TextInput
                    style={styles.input}
                    value={q.question}
                    onChangeText={(value) => handleQuestionChange('formQuestions', q.id, 'question', value)}
                    placeholder="Enter your question"
                  />
                  <Text style={styles.label}>Select Question Type</Text>
                  <Picker
                    selectedValue={q.type}
                    onValueChange={(value) => handleQuestionChange('formQuestions', q.id, 'type', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="MCQ" value="mcq" />
                    <Picker.Item label="Structural" value="structural" />
                    <Picker.Item label="Essay" value="essay" />
                  </Picker>

                  {q.type === 'mcq' && q.options.map((option, i) => (
                    <View key={i} style={styles.optionContainer}>
                      <TextInput
                        style={styles.optionInput}
                        value={option.text}
                        onChangeText={(value) => handleOptionChange('formQuestions', q.id, i, value)}
                        placeholder={`Option ${i + 1}`}
                      />
                      <TouchableOpacity style={{flexDirection: 'row', marginLeft: 10, marginBottom: 5}} onPress={() => handleCorrectOptionChange('formQuestions', q.id, i)}>
                        <View style={styles.radioButton}>
                          {q.correctOption === i && <View style={styles.radioButtonSelected} />}
                        </View>
                        <Text style={styles.radioLabel}>Correct Answer</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {q.type === 'mcq' && (
                    <TouchableOpacity onPress={() => handleAddOption('formQuestions', q.id)}>
                      <Text style={styles.addOptionText}>Add Option</Text>
                    </TouchableOpacity>
                  )}
                  {q.type === 'essay' && (
                    <>
                      <Text style={styles.label}>Maximum Word Count</Text>
                      <TextInput
                        style={styles.input}
                        value={q.wordLimit?.toString()}
                        onChangeText={(value) => handleQuestionChange('formQuestions', q.id, 'wordLimit', value)}
                        placeholder="Enter maximum number of words"
                        keyboardType="numeric"
                      />
                    </>
                  )}
                  <TouchableOpacity onPress={() => removeFormQuestion('formQuestions', q.id)}>
                    <Text style={styles.removeQuestionText}>Remove Question</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={() => addFormQuestion('formQuestions')}>
                <Text style={styles.addQuestionText}>Add Question</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Allow Attendees to Join Channel</Text>
          <Picker selectedValue={joinChannel} onValueChange={setJoinChannel} style={styles.picker}>
            <Picker.Item label="No" value={false} />
            <Picker.Item label="Yes" value={true} />
          </Picker>

          {(joinChannel || eventType === 'paid') && (
            <>
              <Text style={styles.label}>Require Join Channel Form?</Text>
              <Picker selectedValue={requireForm} onValueChange={setRequireForm} style={styles.picker}>
                <Picker.Item label="No" value={false} />
                <Picker.Item label="Yes" value={true} />
              </Picker>
            </>
          )}

          {/* Second Dynamic Form */}
          {requireForm && (
            <View style={{ marginBottom: 30 }}>
              <Text style={styles.label}>Attendee Form Questions</Text>
              {formQuestions2.map((q, index) => (
                <View key={q.id} style={styles.formQuestionContainer}>
                  <Text style={styles.label}>Question {index + 1}</Text>
                  <TextInput
                    style={styles.input}
                    value={q.question}
                    onChangeText={(value) => handleQuestionChange('formQuestions2', q.id, 'question', value)}
                    placeholder="Enter your question"
                  />
                  <Text style={styles.label}>Select Question Type</Text>
                  <Picker
                    selectedValue={q.type}
                    onValueChange={(value) => handleQuestionChange('formQuestions2', q.id, 'type', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="MCQ" value="mcq" />
                    <Picker.Item label="Structural" value="structural" />
                    <Picker.Item label="Essay" value="essay" />
                  </Picker>

                  {q.type === 'mcq' && q.options.map((option, i) => (
                    <View key={i} style={styles.optionContainer}>
                      <TextInput
                        style={styles.optionInput}
                        value={option.text}
                        onChangeText={(value) => handleOptionChange('formQuestions2', q.id, i, value)}
                        placeholder={`Option ${i + 1}`}
                      />
                      <TouchableOpacity style={{flexDirection: 'row', marginLeft: 10, marginBottom: 5}} onPress={() => handleCorrectOptionChange('formQuestions2', q.id, i)}>
                        <View style={styles.radioButton}>
                          {q.correctOption === i && <View style={styles.radioButtonSelected} />}
                        </View>
                        <Text style={styles.radioLabel}>Correct Answer</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {q.type === 'mcq' && (
                    <TouchableOpacity onPress={() => handleAddOption('formQuestions2', q.id)}>
                      <Text style={styles.addOptionText}>Add Option</Text>
                    </TouchableOpacity>
                  )}
                  {q.type === 'essay' && (
                    <>
                      <Text style={styles.label}>Maximum Word Count</Text>
                      <TextInput
                        style={styles.input}
                        value={q.wordLimit?.toString()}
                        onChangeText={(value) => handleQuestionChange('formQuestions2', q.id, 'wordLimit', value)}
                        placeholder="Enter maximum number of words"
                        keyboardType="numeric"
                      />
                    </>
                  )}
                  <TouchableOpacity onPress={() => removeFormQuestion('formQuestions2', q.id)}>
                    <Text style={styles.removeQuestionText}>Remove Question</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={() => addFormQuestion('formQuestions2')}>
                <Text style={styles.addQuestionText}>Add Question</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#36393f',
    padding: 10,
    borderRadius: 5,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    padding: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  backButtonContainer: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: ThemeColors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: 'white',
  },
  optionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    maxWidth: "90%",
    color: 'white',
  },
  imagePicker: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    fontWeight: 'bold',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  formQuestionContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  addOptionText: {
    color: 'blue',
    marginTop: 5,
  },
  removeQuestionText: {
    color: 'red',
    marginTop: 5,
  },
  addQuestionText: {
    color: 'blue',
    marginTop: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Added styles
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  radioLabel: {
    color: 'white',
  },
});
