import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '../../ThemeContext';
import Colors from '../../Colors';

export default function Styles() {
  const theme = useContext(ThemeContext);

  const getStyles = (theme) => StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      smalltitle: {
        color:'gray',
      },
      separator: {
        height: 1,
        width: '100%',
        backgroundColor: theme?.isDarkMode? 'white':'#36393f',
      },
      userImageContainer: {
        height: 155,
        borderBottomWidth: 1,
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
        width: "100%",
        justifyContent: 'center',
        zIndex: 5,
      },
      profilePicContain: {
        backgroundColor: "green",
        borderRadius: 50,
        width: 80,
        height: 80,
        top: -35,
        zIndex: 5,
        marginLeft: 10,
        borderWidth: 5,
        borderColor: "black",
      },
      topbar: {
        height: 100,
        width: "100%",
        backgroundColor: theme?.isDarkMode? Colors.dark.background : Colors.light.background,
      },
      profileTextContain: {
        width: 250,
        marginLeft: 10,
        height: 40,
        marginTop: -5,
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
      },
      picTextContainer: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
      },
      profileNameContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
      },
      smallText: {
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      modalContent: {
        marginTop: 20,
        padding: 25,
      },
      settingItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
      },
      iconContainer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
      },
      settingTextContainer: {
        flexDirection: 'column',
        backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
      }, 
      mainSettingItemText: {
        fontSize: 17,
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      subSettingItemText: {
        fontSize: 12,
        color: theme?.isDarkMode? 'white':'#36393f',
      }
  });

  const styles = getStyles(theme);

  return styles;
}
