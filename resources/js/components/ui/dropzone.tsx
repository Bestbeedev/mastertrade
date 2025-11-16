import React from "react";

type DropzoneProps = {
    accept?: string;
    multiple?: boolean;
    onFiles: (files: File[]) => void;
    className?: string;
    children?: React.ReactNode;
};

export default function Dropzone({ accept, multiple, onFiles, className, children }: DropzoneProps) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [isOver, setIsOver] = React.useState(false);

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (!files.length) return;
        const filtered = filterByAccept(files, accept);
        onFiles(multiple ? filtered : filtered.slice(0, 1));
    };

    const onBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const filtered = filterByAccept(files, accept);
        onFiles(multiple ? filtered : filtered.slice(0, 1));
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 text-sm cursor-pointer transition-colors ${isOver ? 'border-primary bg-primary/5' : 'border-muted'} ${className || ''}`}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
        >
            {children ?? (
                <>
                    <span className="text-muted-foreground">Glissez-déposez un fichier ici, ou cliquez pour parcourir</span>
                    {accept && <span className="text-xs text-muted-foreground">Formats acceptés: {accept}</span>}
                </>
            )}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={onBrowse}
                className="hidden"
            />
        </div>
    );
}

function filterByAccept(files: File[], accept?: string) {
    if (!accept) return files;
    const patterns = accept.split(',').map(s => s.trim()).filter(Boolean);
    if (!patterns.length) return files;
    const match = (file: File) => patterns.some(p => {
        if (p === '*/*') return true;
        if (p.endsWith('/*')) {
            const typeRoot = p.split('/')[0];
            return file.type.startsWith(typeRoot + '/');
        }
        return file.type === p || file.name.toLowerCase().endsWith(p.replace('*', '').toLowerCase());
    });
    return files.filter(match);
}
