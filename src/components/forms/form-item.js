import {
  Box,
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
import { Select } from 'chakra-react-select'
import { useController } from 'react-hook-form'
import { HiEye, HiEyeOff } from 'react-icons/hi'

const SelectItem = ({ control, id, ...rest }) => {
  const { field } = useController({
    name: id,
    control,
  })

  return <Box as={Select} w='full' {...field} {...rest} />
}

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
  selectOptions,
  control,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useBoolean()
  const Tag = as || Input

  return (
    <FormControl isInvalid={errors?.[id]} isRequired={isRequired}>
      {label && !hideLabel && (
        <FormLabel mb={1} htmlFor={id} fontSize='sm' fontWeight={600}>
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
        {selectOptions ? (
          <SelectItem control={control} id={id} {...selectOptions} placeholder={label} />
        ) : (
          <Tag
            id={id}
            type={!selectOptions && isOpen ? 'text' : type}
            placeholder={label}
            {...register(id)}
            {...rest}
          />
        )}
      </InputGroup>
      <FormErrorMessage>{errors?.[id]?.message}</FormErrorMessage>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
