'use client';

import React from 'react';
import { SidebarProps } from '../sidebar-types';
import { StrategySidebar } from '../StrategySidebar';
import { Guitar } from 'lucide-react';

const FullSidebar: React.FC<SidebarProps> = (props) => {
    return <StrategySidebar {...props} menuType="full" title="FULL EDITOR" icon={Guitar} />;
};

export default FullSidebar;
