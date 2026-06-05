import { Fitment } from './fitment.model';
import { KitVariant } from './kit-variant.model';

export interface Kit {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
  fitments: Fitment[];
  variants: KitVariant[];
  includes: string[];
  featured?: boolean;
}

export interface KitWritePayload {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
  fitments: Fitment[];
  variants: Array<{
    id?: string;
    label: string;
    sku: string;
    priceCents: number;
    colorHex?: string;
  }>;
  includes: string[];
  featured: boolean;
}

export interface PatchKitPayload {
  featured: boolean;
}
