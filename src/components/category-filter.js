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
      <Avatar display={{ base: 'none', lg: 'block' }} size='xs' name={props.title} />
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
      <Text display={{ base: 'none', lg: 'block' }} fontWeight='semibold'>{t`categories`}</Text>
      <Button
        isDisabled={!value[0]}
        colorScheme='orange'
        rounded='full'
        h={12}
        pr={{ base: 2, lg: 'initial' }}
        leftIcon={<RiFilterOffLine />}
        onClick={() => setValue([])}
      >
        {/* TODO Add translation */}
        <Text display={{ base: 'none', lg: 'block' }}>{t`clear`}</Text>
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
