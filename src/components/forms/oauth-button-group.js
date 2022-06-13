import { Box, Button, ButtonGroup, Link } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { FaGoogle } from 'react-icons/fa'

const providers = [
  {
    name: 'Google',
    icon: <Box as={FaGoogle} color='red.500' boxSize='5' />,
    url: '/api/connect/google',
  },
  // {
  //   name: 'Twitter',
  //   icon: <Box as={FaTwitter} color='twitter.500' boxSize='5' />,
  //   url: '/api/connect/twitter',
  // },
  // {
  //   name: 'Facebook',
  //   icon: <Box as={FaFacebook} color='facebook.500' boxSize='5' />,
  //   url: '/api/connect/facebook',
  // },
  // {
  //   name: 'Instagram',
  //   icon: <Box as={FaInstagram} color='#F56040' boxSize='5' />,
  //   url: '/api/connect/instagram',
  // },
]

const backendUrl = process.env.NEXT_PUBLIC_API_URL

export const OAuthButtonGroup = () => {
  const { t } = useTranslation()
  const onSocialLogin = async url => {
    window.open(`${backendUrl}${url}`, '_self')
  }
  return (
    <ButtonGroup variant='outline' spacing='4' width='full'>
      {providers.map(({ name, icon, url }) => (
        <Button
          as={Link}
          key={name}
          isFullWidth
          leftIcon={icon}
          textColor='blue.400'
          onClick={() => {
            onSocialLogin(url)
          }}
        >
          {t('login.sign-with')} {name}
        </Button>
      ))}
    </ButtonGroup>
  )
}
