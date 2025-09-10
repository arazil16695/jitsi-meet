import React, { useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import Toolbox from '../../../toolbox/components/native/Toolbox'; // Ensure the path is correct
// Import other components (video, participants, etc.)
 
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
      <View style={{ flex: 1 }}>
        {/* Render other components (video streams, participants, etc.) */}
        
        {/* Conditionally render the Toolbox component based on the visibility state */}
        <Toolbox toolboxVisible={toolboxVisible} {...props} />  
      </View>
    </TouchableWithoutFeedback>
  );
};
 
export default Conference;