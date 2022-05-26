import { Image, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

export const HomeJustice = () => {
  const { t } = useTranslation()

  return (
    <Stack justify='center' align='center' direction={{ base: 'column', lg: 'row' }} spacing={8}>
      <Image boxSize='400px' objectFit='cover' src='/images/scales-of-justice.jpeg' alt='humanity' />
      <Text>{t`home.justice`}</Text>
    </Stack>
  )
}
