import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-shell animate-fade-in-up">
      {children}
    </div>
  );
};

export default AppShell;
