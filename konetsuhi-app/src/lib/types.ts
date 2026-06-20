export type ItemId =
  | 'elec' | 'oil' | 'water' | 'net' | 'news'
  | 'town' | 'nhk' | 'tax' | 'ken' | 'maint'

export interface ExpenseItem {
  id: ItemId
  label: string
  note: string
  category: 'monthly' | 'annual'
  excludeFromHalf?: boolean
  fullAmountForParent?: boolean
}

export interface HistoryEntry {
  at: string        // ISO timestamp
  type: 'confirmed' | 'modified'
  total: number
  half: number
  note?: string
}

export interface MonthlyRecord {
  id?: string
  month_key: string
  values: Record<string, number>
  memo: string
  status: 'draft' | 'confirmed' | 'modified'
  history: HistoryEntry[]
  updated_at?: string
}
