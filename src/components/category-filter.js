import {
  Box,
  Divider,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
  useCheckbox,
  useCheckboxGroup,
  useUpdateEffect,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect, useRef } from 'react'
import { FaCheck } from 'react-icons/fa'
import { RiFilterOffLine } from 'react-icons/ri'

import { useChangeParams, useDebounce } from '~hooks'

function CustomCheckbox(props) {
  const { state, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)

  return (
    <HStack
      as='label'
      color={state.isChecked ? 'blue.500' : 'initial'}
      borderWidth={2}
      borderColor={state.isChecked ? 'blue.500' : 'transparent'}
      _hover={{ bg: 'blackAlpha.50' }}
      rounded='full'
      py={2}
      pr={2}
      fontWeight={600}
      cursor='pointer'
      fontSize='md'
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Box maxW={state.isChecked ? 'auto' : 0} transition='all 0.2s' as={FaCheck} />
      <Text w='max-content' {...getLabelProps()}>
        {props.title}
      </Text>
    </HStack>
  )
}

export const CategoryFilter = ({ categories = [], isLoading }) => {
  const changeParam = useChangeParams()
  const router = useRouter()
  const initialCategorySelected = useRef(false)

  const { value, getCheckboxProps, setValue } = useCheckboxGroup({ defaultValue: [] })
  const { t } = useTranslation()

  const categoryCodes = useDebounce(value, 1000)

  useEffect(() => {
    if (router.query.categories && !initialCategorySelected.current) {
      initialCategorySelected.current = true
      setValue(router.query.categories?.split('&').map(item => item.split('=')[1]))
    }
  }, [setValue, router.query.categories])

  useUpdateEffect(() => {
    changeParam({ categories: categoryCodes })
  }, [categoryCodes])

  return (
    <Stack justify='stretch' w='full' spacing={1}>
      <HStack py={1.5} w='full' justify='space-between' align='center'>
        <Text fontWeight={600}>{t`categories`}</Text>
        {isLoading ? (
          <Spinner size='lg' color='blue.500' />
        ) : (
          <IconButton
            isDisabled={!value[0]}
            colorScheme='blue'
            aria-label='clear filter'
            rounded='full'
            size='sm'
            icon={<RiFilterOffLine />}
            onClick={() => setValue([])}
          />
        )}
      </HStack>
      <Divider />
      {categories?.map(category => (
        <CustomCheckbox
          key={category.id}
          {...getCheckboxProps({
            id: category.id,
            value: category.code,
            title: category[`name_${router.locale}`],
          })}
        />
      ))}
    </Stack>
  )
}
