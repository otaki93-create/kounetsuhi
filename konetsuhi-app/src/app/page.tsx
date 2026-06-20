'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { MONTHLY_ITEMS, ANNUAL_ITEMS, EXPENSE_ITEMS } from '@/lib/items'
import { MonthlyRecord } from '@/lib/types'

const TABLE = 'konetsuhi_records'

function fmtMonth(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}
function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
function yen(n: number) {
  return n > 0 ? `¥${n.toLocaleString()}` : '—'
}

export default function Home() {
  const [date, setDate] = useState(new Date())
  const [values, setValues] = useState<Record<string, number>>({})
  const [memo, setMemo] = useState('')
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const recordId = useRef<string | null>(null)

  /* ── load ── */
  const load = useCallback(async (d: Date) => {
    const key = monthKey(d)
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('month_key', key)
      .maybeSingle()

    if (error) { setSyncStatus('error'); return }
    if (data) {
      recordId.current = data.id
      setValues(data.values ?? {})
      setMemo(data.memo ?? '')
    } else {
      recordId.current = null
      setValues({})
      setMemo('')
    }
    setSyncStatus('synced')
  }, [])

  useEffect(() => { load(date) }, [date, load])

  /* ── realtime ── */
  useEffect(() => {
    const channel = supabase
      .channel('konetsuhi-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        (payload) => {
          const row = (payload.new ?? payload.old) as MonthlyRecord
          if (row?.month_key === monthKey(date)) {
            setValues(row.values ?? {})
            setMemo(row.memo ?? '')
            setSyncStatus('synced')
          }
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [date])

  /* ── save ── */
  const save = useCallback(
    (newValues: Record<string, number>, newMemo: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      setSyncStatus('saving')
      saveTimer.current = setTimeout(async () => {
        const key = monthKey(date)
        const payload = { month_key: key, values: newValues, memo: newMemo, updated_at: new Date().toISOString() }
        let error
        if (recordId.current) {
          ;({ error } = await supabase.from(TABLE).update(payload).eq('id', recordId.current))
        } else {
          const res = await supabase.from(TABLE).insert(payload).select().single()
          error = res.error
          if (!error) recordId.current = res.data.id
        }
        setSyncStatus(error ? 'error' : 'synced')
      }, 700)
    },
    [date]
  )

  function handleValue(id: string, raw: string) {
    const n = raw === '' ? 0 : Number(raw)
    const next = { ...values, [id]: n }
    setValues(next)
    save(next, memo)
  }

  function handleMemo(v: string) {
    setMemo(v)
    save(values, v)
  }

  /* ── totals ── */
  const total = EXPENSE_ITEMS.reduce((s, it) => s + (values[it.id] ?? 0), 0)
  const half  = Math.round(total / 2)

  /* ── render ── */
  const SyncDot = () => (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <span className={`inline-block w-2 h-2 rounded-full ${
        syncStatus === 'synced' ? 'bg-emerald-500' :
        syncStatus === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'
      }`} />
      {syncStatus === 'synced' ? '同期済み' : syncStatus === 'saving' ? '保存中...' : 'エラー'}
    </span>
  )

  const ItemRow = ({ id, label, note }: { id: string; label: string; note: string }) => {
    const v = values[id] ?? 0
    return (
      <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 mb-2 border border-gray-100">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 leading-tight">{label}</p>
          {note && <p className="text-xs text-gray-400 mt-0.5">{note}</p>}
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={v === 0 ? '' : v}
          onChange={e => handleValue(id, e.target.value)}
          placeholder="0"
          className="w-24 text-right text-sm bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-200 focus:outline-none focus:border-emerald-400 focus:bg-white transition"
        />
        <span className="w-20 text-right text-xs text-gray-500 shrink-0">{yen(Math.round(v / 2))}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-3 pb-16">

        {/* Header */}
        <div className="pt-10 pb-4 border-b border-gray-200 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900">⚡ 光熱費管理</h1>
            <SyncDot />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 active:scale-95 transition"
            >‹</button>
            <span className="flex-1 text-center text-base font-medium text-gray-800">{fmtMonth(date)}</span>
            <button
              onClick={() => setDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 active:scale-95 transition"
            >›</button>
          </div>
        </div>

        {/* Column labels */}
        <div className="flex items-center gap-2 px-3 mb-2">
          <span className="flex-1 text-xs text-gray-400">項目</span>
          <span className="w-24 text-right text-xs text-gray-400">総額 (円)</span>
          <span className="w-20 text-right text-xs text-gray-400">負担分</span>
        </div>

        {/* Monthly */}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">毎月の費用</p>
        {MONTHLY_ITEMS.map(it => <ItemRow key={it.id} {...it} />)}

        {/* Annual */}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mt-4 mb-2">年払い・その他</p>
        {ANNUAL_ITEMS.map(it => <ItemRow key={it.id} {...it} />)}

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mt-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm text-gray-500">合計</span>
            <span className="text-base font-medium text-gray-800">{yen(total)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">負担合計（半額）</span>
            <span className="text-2xl font-semibold text-emerald-600">{yen(half)}</span>
          </div>
        </div>

        {/* Memo */}
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">メモ</p>
          <textarea
            value={memo}
            onChange={e => handleMemo(e.target.value)}
            placeholder="備考・支払いURL・振込先など..."
            rows={3}
            className="w-full bg-white rounded-xl border border-gray-100 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-emerald-400 resize-none"
          />
        </div>

      </div>
    </div>
  )
}
