'use client';

import React from 'react';
import { SidebarProps } from '../sidebar-types';
import { StrategySidebar } from '../StrategySidebar';
import { Guitar } from 'lucide-react';

const Sidebar: React.FC<SidebarProps> = (props) => {
    return <StrategySidebar {...props} menuType="default" title="CHORD EDITOR" icon={Guitar} />;
};

export default Sidebar;
