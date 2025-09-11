import React, { useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Toolbox from '../../../toolbox/components/native/Toolbox'; // Ensure the path is correct
 
const Conference = (props) => {
  const [toolboxVisible, setToolboxVisible] = useState(true); // Start with toolbox visible
  
  // Toggle toolbox visibility when tapping the screen
  const toggleToolbox = () => {
    setToolboxVisible(prev => !prev); // Toggle the state
  };
 
  // Auto-hide the toolbox after 3 seconds of being visible
  useEffect(() => {
    if (toolboxVisible) {
      const timer = setTimeout(() => setToolboxVisible(false), 3000);  // Hide toolbox after 3 seconds
      return () => clearTimeout(timer);  // Clear the timeout if visibility changes
    }
  }, [toolboxVisible]);
 
  return (
    <TouchableWithoutFeedback onPress={toggleToolbox}>
      <View style={styles.container}>
        {/* Render other components (video streams, participants, etc.) */}
 
        {/* Conditionally render the Toolbox component based on the visibility state */}
        {toolboxVisible && <Toolbox {...props} />}
      </View>
    </TouchableWithoutFeedback>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Make sure the container takes full height
    justifyContent: 'flex-start',  // Align content to the top (camera and top bar)
  },
});
 
export default Conference;