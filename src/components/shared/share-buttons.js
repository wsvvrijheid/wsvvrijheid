import { ButtonGroup, IconButton } from '@chakra-ui/react'
import { FacebookShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from 'next-share'
import { FaFacebook, FaTelegram, FaTwitter, FaWhatsapp } from 'react-icons/fa'

import { makeSocialContent } from '~utils'

export const ShareButtons = ({ title, url, quote, size = 'sm', children, ...rest }) => {
  const { twitterContent, content } = makeSocialContent(quote, title)

  return (
    <ButtonGroup variant='outline' size={size} alignItems='center' {...rest}>
      {children}
      <FacebookShareButton quote={content} url={url}>
        <IconButton
          as='span'
          isRound
          aria-label='share on faceobok'
          _hover={{ bg: 'facebook.500', color: 'white' }}
          icon={<FaFacebook />}
        />
      </FacebookShareButton>
      <TwitterShareButton title={twitterContent} url={url}>
        <IconButton
          as='span'
          isRound
          _hover={{ bg: 'twitter.500', color: 'white' }}
          aria-label='share on twitter'
          icon={<FaTwitter />}
        />
      </TwitterShareButton>
      <WhatsappShareButton title={content} url={url}>
        <IconButton
          as='span'
          isRound
          _hover={{ bg: 'whatsapp.500', color: 'white' }}
          aria-label='share on whatsapp'
          icon={<FaWhatsapp />}
        />
      </WhatsappShareButton>
      <TelegramShareButton url={url} title={content}>
        <IconButton
          as='span'
          isRound
          _hover={{ bg: 'blue.500', color: 'white' }}
          aria-label='share on telegram'
          icon={<FaTelegram />}
        />
      </TelegramShareButton>
    </ButtonGroup>
  )
}
