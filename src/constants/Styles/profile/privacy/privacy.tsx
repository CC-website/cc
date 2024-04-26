import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '../../../ThemeContext';
import Colors from '../../../Colors';

export default function Styles() {
  const theme = useContext(ThemeContext);

  const getStyles = (theme) => StyleSheet.create({
    
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
      },
      modalContent: {
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
        padding: 20,
        borderRadius: 10,
        width: '100%',
        height: '91%',
      },
      backButtonContainer: {
        padding: 10,
        paddingBottom: -10,
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        borderBottomColor: theme?.isDarkMode? 'white':'#36393f',
      },
      backButton: {
        position: 'relative',
        top: 10,
        left: 0,
        padding: 10,
        marginRight: 10,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
        color: theme?.isDarkMode? 'white':'#36393f',
        marginTop: 20,
      },
      createButton: {
        backgroundColor: '#36393f',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center',
        width: "80%",
        marginRight: 10,
        marginTop: 20,
        justifyContent: 'center',
      },
      inputContainer: {
        alignItems: 'center',
        marginBottom: 10,
      },
      inputIcon: {
        marginRight: 10,
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      inputTextIcon: {
        marginRight: 10,
        color: '#505459',
        marginTop: 18,
      },
      input: {
        backgroundColor: '#4D4D4D',
        padding: 6,
        borderRadius: 5,
        color: theme?.isDarkMode? 'white':'#36393f',
        flex: 1,
      },
      inputDescription: {
        color: theme?.isDarkMode? 'white':'#36393f',
        marginBottom: 2,
        fontSize: 15,
      },
      inputDescription2: {
        color:'#505459',
        fontSize: 15,
      },
      profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 20,
      },
      profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
      },
      inputWordContainer:{
        flexDirection: 'row',
        justifyContent:'center', 
        alignItems:'center',
      },
      disappearingContainer: {
        borderTopWidth: .4,
        borderColor: theme?.isDarkMode? 'white':'#36393f',
        borderBottomWidth: .4,
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20,
      },
      disappearingSubContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        width: "85%",
      },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    optionText: {
        fontSize: 16,
        marginRight: 10,
    },
    radioContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButton: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#000',
    }, 
    selectedRadioButton: {
      backgroundColor: '#fff',
  },
  });

  const styles = getStyles(theme);

  return styles;
}
