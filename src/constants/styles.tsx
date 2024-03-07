import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '../../src/constants/ThemeContext';
import Colors from './Colors';

export default function Styles() {
  const theme = useContext(ThemeContext);

  const getStyles = (theme) => StyleSheet.create({
    
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: theme?.isDarkMode? Colors.dark.background : Colors.light.background,
    },
    sectionBase: {
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    section: {
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
      borderRadius: 10,
    },
    sectionContainer: {
      width: 10,
      marginRight: 5,
      padding: 5,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      backgroundColor: theme?.isDarkMode ? Colors.dark.section.background : Colors.light.section.background,
    },
    sectionContainer1: {
      padding: 5,
      backgroundColor: theme?.isDarkMode? Colors.dark.section.background : Colors.light.section.background,
    },
    logoImage: {
      width: 40,
      height: 40,
      borderRadius: 25,
    },
    channelName: {
      color: theme?.isDarkMode? 'white':'#36393f',
      fontWeight: 'bold',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    titleText: {
      color: theme?.isDarkMode? 'white':'#36393f', 
      fontSize: 18,
    },
    dropDownbotton: {
      color: theme?.isDarkMode? 'white':'#36393f', 
    },
    channelItem: {
      padding: 5,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      backgroundColor:  'royalblue',
    },
    channelItem1: {
      padding: 5,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      backgroundColor: '#BFBFBF',
    },
    subChannelItem: {
      marginTop: 18,
    },
    groupChannelItem: {
      marginTop: 10,
      padding: 10,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    subChannelItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 199,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      width: '65%',
      backgroundColor: '#36393f',
    },
    searchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: 20,
    },
    spliter: {
      height: 0.3,
      width: '100%',
      backgroundColor: theme?.isDarkMode? 'white':'#36393f',
    },
    searchInput: {
      flex: 1,
      color: '#fff',
      paddingLeft: 10,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: '#fff',
      height: 34,
      width: '80%',
      paddingRight: 10,
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 30,
    },
    searchButton: {
      backgroundColor: '#36393f',
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
      padding: 3,
      marginLeft: -5,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: '#fff'
    },
    button: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#3498db',
      padding: 5,
      borderRadius: 15,
    },
    buttonText: {
      color: '#fff',
      marginLeft: 5,
    },
    searchInputbutton: {
      color: '#fff',
      marginLeft: 5,
      backgroundColor: '#3498db',
      padding: 5,
      borderRadius: 15,
      marginTop: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 25,
    },
  
    newChannelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'royalblue',
      padding: 10,
      borderRadius: 15,
    },
    headerContainer: {
      flexDirection: 'row',
      position: 'relative',
    },
    iconContainer: {
      position: 'relative',
    },
    iconContainer1: {
      position: 'absolute',
      left: 6,
      top: 6,
    },
  });

  const styles = getStyles(theme);

  return styles;
}
