import { createStandaloneToast } from '@chakra-ui/react'

// FIXME Test fails if we import with alias
import { theme } from '../theme'

const toast = createStandaloneToast({
  theme,
})

/**
 * this function is used to show toast message
 * @param  {String} title title of the toast
 * @param {String}  description   description of the toast
 * @param {("info" | "warning" | "success" | "error")}  status   status of the toast
 */

export const toastMessage = (title, description, status) => {
  toast({
    title,
    description,
    status,
    duration: 5000,
    position: 'top-right',
    isClosable: true,
  })
}
