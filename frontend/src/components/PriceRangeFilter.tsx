import { HStack, NumberInput, NumberInputField, Button, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const PriceRangeFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')

  useEffect(() => {
    setMinPrice(searchParams.get('min_price') || '')
    setMaxPrice(searchParams.get('max_price') || '')
  }, [searchParams])

  const handleApply = () => {
    const newParams = new URLSearchParams(searchParams)
    if (minPrice) newParams.set('min_price', minPrice)
    else newParams.delete('min_price')

    if (maxPrice) newParams.set('max_price', maxPrice)
    else newParams.delete('max_price')

    newParams.set('skip', '0')
    setSearchParams(newParams)
  }

  const handleClear = () => {
    setMinPrice('')
    setMaxPrice('')
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('min_price')
    newParams.delete('max_price')
    newParams.set('skip', '0')
    setSearchParams(newParams)
  }

  return (
    <HStack spacing={2} align="center" wrap="wrap" my={2}>
      <Text fontSize="sm" fontWeight="bold" color="text.secondary">
        Price ($):
      </Text>
      <NumberInput size="sm" maxW="90px" value={minPrice} onChange={(val) => setMinPrice(val)}>
        <NumberInputField placeholder="Min" />
      </NumberInput>
      <Text color="text.secondary">-</Text>
      <NumberInput size="sm" maxW="90px" value={maxPrice} onChange={(val) => setMaxPrice(val)}>
        <NumberInputField placeholder="Max" />
      </NumberInput>
      <Button size="sm" colorScheme="teal" onClick={handleApply}>
        Filter
      </Button>
      {(minPrice || maxPrice) && (
        <Button size="sm" variant="ghost" onClick={handleClear}>
          Clear
        </Button>
      )}
    </HStack>
  )
}
