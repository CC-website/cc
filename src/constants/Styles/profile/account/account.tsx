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
        padding: 40,
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
        marginRight: 20,
      },
      inputIcon: {
        marginRight: 10,
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
        color: theme?.isDarkMode? 'white':'#36393f',
        marginTop: 20,
      },
      createButton: {
        backgroundColor: 'silver',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 120,
        height: 50,
        marginRight: 10,
        marginTop: 8,
        justifyContent: 'center',
      },
      menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
      },
      menuIcon: {
        marginRight: 20,
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      menuText: {
        color: theme?.isDarkMode? 'white':'#36393f',
        fontSize: 16,
      },
      deleteConfirmation: {
        backgroundColor: '#36393f',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
      },
      deleteConfirmationText: {
        color: theme?.isDarkMode? 'white':'#36393f',
        fontSize: 18,
        marginBottom: 20,
      },
      deleteConfirmationButton: {
        backgroundColor: '#202020',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
      },
  });

  const styles = getStyles(theme);

  return styles;
}
