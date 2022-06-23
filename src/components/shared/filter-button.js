import { Button, Tag } from '@chakra-ui/react'

export const FilterButton = ({ onClick, isActive, number, children, ...rest }) => {
  return (
    <Button
      colorScheme='blue'
      onClick={onClick}
      variant={isActive ? 'solid' : 'outline'}
      leftIcon={
        isActive && (
          <Tag size='sm' bg='transparent' color='white' fontWeight={600} borderWidth={1} borderColor='white'>
            {number}
          </Tag>
        )
      }
      {...rest}
    >
      {children}
    </Button>
  )
}
