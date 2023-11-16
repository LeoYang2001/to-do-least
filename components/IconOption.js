import { View, Text } from 'react-native'
import React from 'react'
import * as Icon from 'react-native-feather'


export default function IconOption({ iconName, color, size}) {
  // Check if the provided iconName is a valid icon component
  const IconComponent = Icon[iconName];
      
  if (!IconComponent) {
    // Handle the case where the iconName is not valid
    return <div>Invalid Icon</div>;
  }

  return (
    <IconComponent
      className="self-center"
      width={size}
      height={size}
      color={color}
    />
  );
}