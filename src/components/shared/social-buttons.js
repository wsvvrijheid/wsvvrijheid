import { HStack, IconButton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa'

const SOCIAL_LINKS = [
  {
    label: 'Twitter',
    icon: FaTwitter,
    link: {
      en: 'https://twitter.com/wsvvrijheid',
      tr: 'https://twitter.com/wsvvrijheid',
      nl: 'https://twitter.com/wsvvrijheid',
    },
  },
  {
    label: 'FaLinkedin',
    icon: FaLinkedin,
    link: {
      en: 'https://www.linkedin.com/company/wsvvrijheid',
      tr: 'https://www.linkedin.com/company/wsvvrijheid',
      nl: 'https://www.linkedin.com/company/wsvvrijheid',
    },
  },
  {
    label: 'WhatsApp',
    icon: FaWhatsapp,
    link: {
      en: 'https://api.whatsapp.com/send?phone=31685221308',
      tr: 'https://api.whatsapp.com/send?phone=31685221308',
      nl: 'https://api.whatsapp.com/send?phone=31685221308',
    },
  },
]

export const SocialButtons = () => {
  const { locale } = useRouter()
  return (
    <HStack align='start'>
      {SOCIAL_LINKS.map((item, i) => (
        <IconButton
          key={i}
          aria-label={item.label}
          as='a'
          size='sm'
          target='_blank'
          icon={<item.icon />}
          href={item.link[locale]}
          variant='outline'
          colorScheme='blue'
          borderColor='blue.200'
          color='blue.200'
          _hover={{ bg: 'whiteAlpha.100' }}
        />
      ))}
    </HStack>
  )
}
