import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useBoolean,
} from '@chakra-ui/react'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export const FormItem = ({
  id,
  type,
  as,
  leftElement,
  label,
  helperText,
  errors,
  register,
  isRequired,
  hideLabel,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useBoolean()
  const Tag = as || Input

  return (
    <FormControl isInvalid={errors?.[id]} isRequired={isRequired}>
      {label && !hideLabel && (
        <FormLabel mb={1} htmlFor={id} fontSize='sm' fontWeight='semibold'>
          {label}
        </FormLabel>
      )}
      <InputGroup>
        {leftElement && <InputLeftElement pointerEvents='none'>{leftElement}</InputLeftElement>}
        {type === 'password' && (
          <InputRightElement>
            <IconButton
              variant='link'
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={setIsOpen.toggle}
            />
          </InputRightElement>
        )}
        <Tag id={id} type={isOpen ? 'text' : type} placeholder={label} {...register(id)} {...rest} />
      </InputGroup>
      <FormErrorMessage>{errors?.[id]?.message}</FormErrorMessage>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
