import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '../../ThemeContext';
import Colors from '../../Colors';

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
        justifyContent: 'space-between',
        borderBottomWidth: 0.3,
        borderBottomColor: theme?.isDarkMode? 'white':'#36393f',
      },
      backButton: {
        position: 'relative',
        top: 10,
        left: 0,
        padding: 10,
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
        borderRadius: 5,
        alignItems: 'center',
        width: 60,
        height: 50,
        marginRight: 10,
        marginTop: 8,
        justifyContent: 'center',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      inputIcon: {
        marginRight: 10,
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      input: {
        padding: 6,
        color: theme?.isDarkMode? 'white':'#36393f',
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#4D4D4D',
      },
      inputDescription: {
        color: '#ccc',
        marginLeft: 44,
        marginBottom: 20,
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
  });

  const styles = getStyles(theme);

  return styles;
}
