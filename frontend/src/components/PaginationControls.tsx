import { HStack, Button, Text } from '@chakra-ui/react'
import { useSearchParams } from 'react-router-dom'

interface PaginationControlsProps {
  hasMore?: boolean
  pageSize?: number
}

export const PaginationControls = ({ pageSize = 20 }: PaginationControlsProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const skip = parseInt(searchParams.get('skip') || '0', 10)
  const limit = parseInt(searchParams.get('limit') || pageSize.toString(), 10)

  const currentPage = Math.floor(skip / limit) + 1

  const handlePrev = () => {
    if (skip <= 0) return
    const newSkip = Math.max(0, skip - limit)
    const newParams = new URLSearchParams(searchParams)
    newParams.set('skip', newSkip.toString())
    setSearchParams(newParams)
  }

  const handleNext = () => {
    const newSkip = skip + limit
    const newParams = new URLSearchParams(searchParams)
    newParams.set('skip', newSkip.toString())
    setSearchParams(newParams)
  }

  return (
    <HStack spacing={4} justify="center" my={6}>
      <Button size="sm" onClick={handlePrev} isDisabled={skip <= 0}>
        Previous
      </Button>
      <Text fontSize="sm" color="text.secondary">
        Page {currentPage}
      </Text>
      <Button size="sm" onClick={handleNext}>
        Next
      </Button>
    </HStack>
  )
}
