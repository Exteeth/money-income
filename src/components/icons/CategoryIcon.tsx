import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  name, 
  className = '', 
  size = 20, 
  color 
}) => {
  // Safe lookup for dynamic icon rendering
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback icon
    return <Icons.HelpCircle className={className} size={size} color={color} />;
  }

  return <IconComponent className={className} size={size} color={color} />;
};

export default CategoryIcon;
