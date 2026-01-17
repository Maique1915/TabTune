
import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface HistoryControlsProps {
    onExport: () => void;
    onImport: (file: File) => void;
    className?: string;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({ onExport, onImport, className }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImport(file);
        }
        // Reset inputs
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Button
                variant="outline"
                size="sm"
                onClick={handleImportClick}
                className="flex items-center gap-2 text-xs font-bold"
                title="Import History (JSON)"
            >
                <Upload size={14} />
                <span>Import</span>
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
            />

            <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex items-center gap-2 text-xs font-bold"
                title="Export History (JSON)"
            >
                <Download size={14} />
                <span>Export</span>
            </Button>
        </div>
    );
};
