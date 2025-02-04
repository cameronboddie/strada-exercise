export interface Collection {
    id: number;
    name: string;
    description: string;
    team_id: string;
    team_name: string;
    parent_id?: number | null;
    tags?: string[];
    featured_image?: string;
    created_at: string;
    updated_at?: string | null;
}

export interface NewCollection {
    name: string;
    description: string;
    team_id: string;
    parent_id?: number | null;
    tags?: string[];
    featured_image?: string;
}

export interface Content {
    id: number;
    title: string;
    artist: string;
    medium: string;
    year: number;
    image_url: string;
    height?: number | null;
    width?: number | null;
    depth?: number | null;
    dimensions_unit?: string | null;
    price?: number | null;
    condition?: string | null;
    edition_number?: string | null;
    description?: string | null;
    collection_id: number;
    collection:string;
    team_id:string;
    team_name:string;
}

export interface NewContent {
    title: string;
    artist: string;
    medium: 'Art' | 'Photography';
    year: number;
    image_url: string;
    height?: number | null;
    width?: number | null;
    depth?: number | null;
    dimensions_unit?: 'Inches' | 'Centimeters' | null;
    price?: number | null;
    condition?: 'Undamaged' | 'Damaged' | null;
    edition_number?: string | null;
    description?: string | null;
    collection_id: number;
};

export interface Invoice {
    id: number;
    title: string;
    recipient: string;
    amount: number;
    due_date: string;
    status: string;
    paid_at?: string | null;
}
