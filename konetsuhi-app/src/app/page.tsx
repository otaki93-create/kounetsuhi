import dynamic from 'next/dynamic'

const KonetsuhiApp = dynamic(() => import('@/components/KonetsuhiApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">読み込み中...</p>
    </div>
  ),
})

export default function Home() {
  return <KonetsuhiApp />
}
