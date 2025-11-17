import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DropzoneProps = {
    accept?: string;
    multiple?: boolean;
    onFiles: (files: File[]) => void;
    className?: string;
    children?: React.ReactNode;
    value?: File[];
    onRemove?: (index: number) => void;
};

export default function Dropzone({
    accept,
    multiple,
    onFiles,
    className,
    children,
    value = [],
    onRemove
}: DropzoneProps) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [isOver, setIsOver] = useState(false);
    const [previews, setPreviews] = useState<{ url: string, file: File }[]>([]);

    // Mettre à jour les aperçus quand les fichiers changent
    useEffect(() => {
        const newPreviews = value.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setPreviews(prev => {
            // Libérer les URLs précédentes pour éviter les fuites mémoire
            prev.forEach(p => URL.revokeObjectURL(p.url));
            return newPreviews;
        });

        return () => {
            // Nettoyage des URLs lors du démontage
            newPreviews.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, [value]);

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (!files.length) return;
        const filtered = filterByAccept(files, accept);
        onFiles(multiple ? [...value, ...filtered] : filtered.slice(0, 1));
    };

    const onBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const filtered = filterByAccept(files, accept);
        onFiles(multiple ? [...value, ...filtered] : filtered.slice(0, 1));
        if (inputRef.current) inputRef.current.value = ''; // Réinitialiser l'input pour permettre la sélection du même fichier
    };

    const handleRemove = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove(index);
        } else {
            const newFiles = [...value];
            newFiles.splice(index, 1);
            onFiles(newFiles);
        }
    };

    const isImage = (file: File) => file.type.startsWith('image/');

    return (
        <div className="space-y-4">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
                onDragLeave={() => setIsOver(false)}
                onDrop={onDrop}
                className={cn(
                    "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 text-sm cursor-pointer transition-colors",
                    isOver ? 'border-primary bg-primary/5' : 'border-muted',
                    className
                )}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
            >
                {children ?? (
                    <div className="text-center">
                        <p className="text-muted-foreground">Glissez-déposez des fichiers ici, ou cliquez pour parcourir</p>
                        {accept && <p className="text-xs text-muted-foreground mt-1">Formats acceptés: {accept}</p>}
                    </div>
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

            {/* Aperçu des fichiers */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative group rounded-md overflow-hidden border border-muted">
                            {isImage(preview.file) ? (
                                <div className="aspect-square bg-muted/50 flex items-center justify-center">
                                    <img
                                        src={preview.url}
                                        alt={preview.file.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-square bg-muted/50 flex items-center justify-center p-3">
                                    <div className="text-center">
                                        <FileIcon className="w-8 h-8 mx-auto text-muted-foreground mb-1" />
                                        <p className="text-xs text-muted-foreground truncate w-full px-1">
                                            {preview.file.name}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={(e) => handleRemove(e, index)}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                                aria-label="Supprimer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function filterByAccept(files: File[], accept?: string) {
    if (!accept) return files;
    const patterns = accept.split(',').map(s => s.trim()).filter(Boolean);
    if (!patterns.length) return files;
    const match = (file: File) => {
        return patterns.some(p => {
            if (p === '*/*') return true;
            if (p.endsWith('/*')) {
                const typeRoot = p.split('/')[0];
                return file.type.startsWith(typeRoot + '/');
            }
            return file.type === p || file.name.toLowerCase().endsWith(p.replace('*', '').toLowerCase());
        });
    };
    return files.filter(match);
}

// Composant d'icône pour les fichiers
function FileIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
    );
}
