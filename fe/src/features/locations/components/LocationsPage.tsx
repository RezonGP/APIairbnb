import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getLocations } from '@/features/locations/services/locations.api'
import type { Location } from '@/features/locations/types/locations'
import { navigateTo } from '@/lib/useHashRoute'

function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [query, setQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGetLocations = async () => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      const result = await getLocations()
      setLocations(result.data)
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Lấy danh sách vị trí thất bại.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleGetLocations()
  }, [])

  const filteredLocations = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return locations
    return locations.filter((loc) => {
      const haystack = `${loc.tenViTri} ${loc.tinhThanh} ${loc.quocGia}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [locations, query])

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">Vị trí</h1>
          <p className="text-sm text-slate-600">Chọn vị trí để xem phòng.</p>
        </div>

        <div className="w-full sm:max-w-xs">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên, tỉnh, quốc gia..."
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="aspect-[16/10] animate-pulse bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            {filteredLocations.length} vị trí
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((loc) => (
              <Card
                key={loc.id}
                className="cursor-pointer overflow-hidden shadow-sm transition hover:shadow-md"
                onClick={() => navigateTo(`/locations/${loc.id}`)}
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  {loc.hinhAnh ? (
                    <img
                      src={loc.hinhAnh}
                      alt={loc.tenViTri}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                      Chưa có ảnh
                    </div>
                  )}
                </div>
                <CardHeader className="space-y-1">
                  <CardTitle className="truncate text-base">
                    {loc.tenViTri}
                  </CardTitle>
                  <p className="truncate text-sm text-slate-600">
                    {loc.tinhThanh}, {loc.quocGia}
                  </p>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default LocationsPage

