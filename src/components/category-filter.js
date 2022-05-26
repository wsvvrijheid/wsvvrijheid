import { Avatar, Button, HStack, Stack, Text, useCheckbox, useCheckboxGroup, useUpdateEffect } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect, useRef } from 'react'
import { RiFilterOffLine } from 'react-icons/ri'

import { useChangeParams, useDebounce } from '~hooks'

function CustomCheckbox(props) {
  const { state, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)

  return (
    <HStack
      as='label'
      gridColumnGap={2}
      color={state.isChecked ? 'blue.500' : 'initial'}
      borderWidth={2}
      borderColor={state.isChecked ? 'blue.500' : 'transparent'}
      _hover={{ bg: 'blackAlpha.50' }}
      rounded='full'
      px={3}
      h={12}
      fontWeight='semibold'
      cursor='pointer'
      fontSize='md'
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Avatar size='xs' name={props.title} />
      <Text {...getLabelProps()}>{props.title}</Text>
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
    <Stack justify='stretch' w='full'>
      <Text fontWeight='semibold'>Categories</Text>
      <Button
        isDisabled={!value[0]}
        colorScheme='orange'
        rounded='full'
        h={12}
        leftIcon={<RiFilterOffLine />}
        onClick={() => setValue([])}
      >
        {/* TODO Add translation */}
        {t`clear`}
      </Button>
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
