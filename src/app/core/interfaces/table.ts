export interface TableTitle {
    name: string;
    classes: string;
}

export interface Column {
    id?: string;
    label: string;
    classes: string;
}

export interface TableContent {
    columns: Column[];
    editRow: boolean;
    deleteRow: boolean;
    idForm?: string;
    onEdit?: () => void;
    onDelete?: () => Promise<void>;
}