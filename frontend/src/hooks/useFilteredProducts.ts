import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { Product } from '../api/types'

export interface UseFilteredProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useFilteredProducts = () => {
  const [rawProducts, setRawProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const minPriceParam = searchParams.get('min_price')
  const maxPriceParam = searchParams.get('max_price')
  const cat = searchParams.get('cat') || ''
  const deliv = searchParams.get('deliv') || ''
  const sort = searchParams.get('sort') || 'created_desc'
  const skip = parseInt(searchParams.get('skip') || '0', 10)
  const limit = parseInt(searchParams.get('limit') || '50', 10)

  const minPrice =
    minPriceParam !== null && minPriceParam !== '' ? parseFloat(minPriceParam) : undefined
  const maxPrice =
    maxPriceParam !== null && maxPriceParam !== '' ? parseFloat(maxPriceParam) : undefined

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: {
        q?: string
        minPrice?: number
        maxPrice?: number
        categoryId?: string
        deliveryOptionId?: string
        sort?: string
        skip?: number
        limit?: number
      } = {}

      if (q) params.q = q
      if (minPrice !== undefined) params.minPrice = minPrice
      if (maxPrice !== undefined) params.maxPrice = maxPrice
      if (cat) params.categoryId = cat
      if (deliv) params.deliveryOptionId = deliv
      if (sort) params.sort = sort
      if (!isNaN(skip)) params.skip = skip
      if (!isNaN(limit)) params.limit = limit

      const productsData = await api.getProducts(params)
      setRawProducts(productsData)
    } catch (err) {
      console.error('Failed to fetch filtered products:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [q, minPrice, maxPrice, cat, deliv, sort, skip, limit])

  const products = useMemo(() => {
    return rawProducts
  }, [rawProducts])

  return { products, loading, error, refetch: fetchProducts }
}
