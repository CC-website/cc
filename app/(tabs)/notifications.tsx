import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BroadCast = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -200],
    extrapolate: 'clamp',
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    scrollY.setValue(currentOffset);
  };

  // Dummy data for five horizontal and five vertical posts
  const horizontalPosts = [
    {
      id: '1',
      user: {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'Beautiful Sunset at the Beach',
      image: 'https://via.placeholder.com/600x400',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel ligula nec magna gravida convallis.',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      user: {
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'Hiking Adventure in the Mountains',
      image: 'https://via.placeholder.com/600x400',
      content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      user: {
        name: 'Mike Johnson',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'City Lights from Above',
      image: 'https://via.placeholder.com/600x400',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      timestamp: '10 hours ago',
    },
    {
      id: '4',
      user: {
        name: 'Emily Brown',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'Exploring Ancient Ruins',
      image: 'https://via.placeholder.com/600x400',
      content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      timestamp: '1 day ago',
    },
    {
      id: '5',
      user: {
        name: 'Chris Wilson',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'Sunrise at the Summit',
      image: 'https://via.placeholder.com/600x400',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      timestamp: '2 days ago',
    },
  ];

  const verticalPosts = [
    {
      id: '6',
      user: {
        name: 'Alice Green',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'Morning Coffee',
      image: 'https://via.placeholder.com/400x600',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      timestamp: '3 hours ago',
    },
    {
      id: '7',
      user: {
        name: 'Daniel White',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'Gardening Tips',
      image: 'https://via.placeholder.com/400x600',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      timestamp: '6 hours ago',
    },
    {
      id: '8',
      user: {
        name: 'Sarah Turner',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'Healthy Recipes',
      image: 'https://via.placeholder.com/400x600',
      content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      timestamp: '12 hours ago',
    },
    {
      id: '9',
      user: {
        name: 'Michael Brown',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'Cycling Adventure',
      image: 'https://via.placeholder.com/400x600',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      timestamp: '1 day ago',
    },
    {
      id: '10',
      user: {
        name: 'Emma Garcia',
        avatar: 'https://via.placeholder.com/150',
      },
      title: 'Art Exhibition',
      image: 'https://via.placeholder.com/400x600',
      content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      timestamp: '2 days ago',
    },
  ];

  // Render item for vertical posts
  const renderVerticalPostItem = (post) => (
    <View key={post.id} style={styles.verticalPostContainer}>
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: post.image }} style={styles.postImage} />
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="black" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color="black" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render set of horizontal posts
  const renderHorizontalPostsSet = (startIndex, endIndex) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalContainer}>
      {horizontalPosts.slice(startIndex, endIndex).map((post) => (
        <View key={post.id} style={styles.horizontalPostContainer}>
          <Image source={{ uri: post.image }} style={styles.horizontalPostImage} />
          <View style={styles.horizontalPostTitle}>
            <Text style={styles.title}>{post.title}</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.upperHeaderContainer}>
        <View style={styles.upperHeaderInerContainer}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.notificationContainer}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="black" />
              {5 > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>{5}</Text>
                </View>
              )}
            </TouchableOpacity>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profilePicture} />
          </View>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer} onScroll={handleScroll} scrollEventThrottle={16}>
        {/* Header */}
        <Animated.View style={[styles.headerContainer, { transform: [{ translateY: headerTranslateY }] }]}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput style={styles.searchInput} placeholder="Search..." />
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {/* Filter Buttons */}
          <View style={styles.filterButtonsContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Community</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Channel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Status</Text>
            </TouchableOpacity>
          </View>
          {/* Header Title */}
          <Text style={styles.headerTitle}>Notifications</Text>
        </Animated.View>
        {/* Render two vertical posts followed by a horizontal post set */}
        <View style={styles.secondContainer}>
        {verticalPosts.map((post, index) => (
          <React.Fragment key={post.id}>
            {index % 2 === 0 && renderHorizontalPostsSet(Math.floor(index / 2) * 2, Math.floor(index / 2) * 2 + 2)}
            {renderVerticalPostItem(post)}
          </React.Fragment>
        ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  upperHeaderContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
    height: 80,
  },
  upperHeaderInerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    zIndex: 1000,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  secondContainer:{
    marginTop: 180,
    paddingHorizontal: 16,
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginLeft: 8,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    paddingVertical: 0,
  },
  horizontalContainer: {
    marginBottom: 16,
    paddingVertical: 12,
  },
  horizontalPostContainer: {
    width: 300,
    marginRight: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  horizontalPostTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalPostImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
  verticalPostContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
  },
  settingsButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

export default BroadCast;
