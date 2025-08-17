import React from 'react';

interface AppVersionProps {
  version: string;
  className?: string;
}

const AppVersion: React.FC<AppVersionProps> = ({ version, className = '' }) => {
  return (
    <div className={`app-version ${className}`}>
      <span className="version-label">Version:</span>
      <span className="version-number">{version}</span>
    </div>
  );
};

export default AppVersion;