'use client';

import React from 'react';
import { SidebarProps } from '../sidebar-types';
import { StrategySidebar } from '../StrategySidebar';
import { Music } from 'lucide-react';

const BeatsSidebar: React.FC<SidebarProps> = (props) => {
    return <StrategySidebar {...props} menuType="beats" title="BEATS EDITOR" icon={Music} />;
};

export default BeatsSidebar;
