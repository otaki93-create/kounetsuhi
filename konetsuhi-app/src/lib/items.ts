import { ExpenseItem } from './types'

export const EXPENSE_ITEMS: ExpenseItem[] = [
  { id: 'elec',  label: '電気代',               note: '',                   category: 'monthly' },
  { id: 'oil',   label: '灯油代',               note: '毎月でない',         category: 'monthly' },
  { id: 'water', label: '上下水道代',           note: '',                   category: 'monthly' },
  { id: 'net',   label: '電話・インターネット代', note: '',                   category: 'monthly' },
  { id: 'news', label: '新聞代', note: '親世帯持ち', category: 'monthly', fullAmountForParent: true },
  { id: 'town',  label: '町内会費',             note: '年払い・子世帯持ち', category: 'annual', excludeFromHalf: true },
  { id: 'nhk',   label: 'NHK受信料',           note: '年1回・折半',        category: 'annual' },
  { id: 'tax',   label: '固定資産税',           note: '折半',               category: 'annual' },
  { id: 'ken',   label: '県民済',               note: '折半',               category: 'annual' },
  { id: 'maint', label: '上越メンテナンス',     note: '折半',               category: 'annual' },
]

export const MONTHLY_ITEMS = EXPENSE_ITEMS.filter(i => i.category === 'monthly')
export const ANNUAL_ITEMS  = EXPENSE_ITEMS.filter(i => i.category === 'annual')
