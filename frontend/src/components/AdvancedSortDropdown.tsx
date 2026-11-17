import { ChangeEvent } from 'react'
import { Select, HStack, Text } from '@chakra-ui/react'
import { useSearchParams } from 'react-router-dom'

export const AdvancedSortDropdown = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSort = searchParams.get('sort') || 'created_desc'

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sort', e.target.value)
    newParams.set('skip', '0')
    setSearchParams(newParams)
  }

  return (
    <HStack spacing={2} align="center" my={2}>
      <Text fontSize="sm" fontWeight="bold" color="text.secondary" whiteSpace="nowrap">
        Sort By:
      </Text>
      <Select
        size="sm"
        maxW="200px"
        value={currentSort}
        onChange={handleSortChange}
        borderRadius="md"
        bg="bg.subtle"
      >
        <option value="created_desc">Newest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="delivery_fastest">Fastest Delivery</option>
        <option value="title_asc">Title: A to Z</option>
        <option value="title_desc">Title: Z to A</option>
      </Select>
    </HStack>
  )
}
