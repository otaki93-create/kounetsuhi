export type ItemId =
  | 'elec' | 'oil' | 'water' | 'net' | 'news'
  | 'town' | 'nhk' | 'tax' | 'ken' | 'maint'

export interface ExpenseItem {
  id: ItemId
  label: string
  note: string
  category: 'monthly' | 'annual'
  excludeFromHalf?: boolean  // 子世帯持ちなど負担分に含めない項目
}

export interface MonthlyRecord {
  id?: string
  month_key: string   // "2026-06"
  values: Record<string, number>
  memo: string
  updated_at?: string
}
