import {
  Box,
  Divider,
  HStack,
  IconButton,
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
      px={2}
      py={2}
      fontWeight='semibold'
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

export const CategoryFilter = ({ categories = [] }) => {
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
    <Stack
      direction={{ base: 'row', lg: 'column' }}
      justify='stretch'
      w='full'
      overflowX={{ base: 'auto', lg: 'hidden' }}
    >
      <HStack w='full' justify='space-between' align='center'>
        <Text display={{ base: 'none', lg: 'block' }} fontWeight='semibold'>{t`categories`}</Text>
        <IconButton
          isDisabled={!value[0]}
          colorScheme='orange'
          aria-label='clear filter'
          rounded='full'
          size='sm'
          icon={<RiFilterOffLine />}
          onClick={() => setValue([])}
        />
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
