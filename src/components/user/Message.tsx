import React, { ReactNode } from 'react';

interface MessageProps {
  variant: 'success' | 'danger' | 'warning' | 'info'; 
  children: ReactNode;
}

const Message: React.FC<MessageProps> = ({ variant, children }) => {
  return <div className={`alert alert-${variant}`}>{children}</div>;
}

export default Message;
