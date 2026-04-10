export interface LineItem {
  id?: string;
  item: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  uom?: string;
  worksheet?: string;
  rowNumber?: number;
}

export interface ProposalData {
  fileName: string;
  items: LineItem[];
  totalCost: number;
}

export type DiffStatus = 'Changed' | 'New' | 'Removed';

export interface DiffItem {
  status: DiffStatus;
  item: string;
  qtyV1: number;
  qtyV2: number;
  qtyDelta: number;
  qtyDeltaPercent: number;
  priceV1: number;
  priceV2: number;
  priceDelta: number;
  priceDeltaPercent: number;
  totalV1: number;
  totalV2: number;
  totalDelta: number;
  totalDeltaPercent: number;
  confidence?: number;
  notes?: string;
}

export interface ComparisonResult {
  v1: ProposalData;
  v2: ProposalData;
  diffs: DiffItem[];
  summary: {
    totalV1: number;
    totalV2: number;
    delta: number;
    deltaPercent: number;
    addedImpact: number;
    removedImpact: number;
    varianceDistribution: {
      price: number;
      quantity: number;
      scope: number;
    };
  };
  narrative: string;
  comparisonType: 'version' | 'vendor';
  currencySymbol?: string;
}
