import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

import { useDeleteArt, usePublishArt, useUnpublishArt } from '~services'

export const ArtCardAlertDialog = ({ art, actionType, isOpen, onClose, queryKey }) => {
  const { t } = useTranslation()
  const deleteArtMutation = useDeleteArt(queryKey)
  const publishArtMutation = usePublishArt(queryKey)
  const unpublishArtMutation = useUnpublishArt(queryKey)

  const actions = {
    delete: {
      title: t`profile.art.delete.title`,
      text: t`profile.art.delete.text`,
      button: t`profile.art.delete.button`,
      colorScheme: 'red',
      action: () => deleteArtMutation.mutateAsync({ id: art.id }).then(onClose),
    },
    publish: {
      title: t`profile.art.publish.title`,
      text: t`profile.art.publish.text`,
      button: t`profile.art.publish.button`,
      colorScheme: 'green',
      action: () => publishArtMutation.mutateAsync({ id: art.id }).then(onClose),
    },
    unpublish: {
      title: t`profile.art.unpublish.title`,
      text: t`profile.art.unpublish.text`,
      button: t`profile.art.unpublish.button`,
      colorScheme: 'orange',
      action: () => unpublishArtMutation.mutateAsync({ id: art.id }).then(onClose),
    },
  }

  return (
    <AlertDialog isCentered isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {actions[actionType].title}
          </AlertDialogHeader>

          <AlertDialogBody>{actions[actionType].text}</AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              isLoading={deleteArtMutation.isLoading || publishArtMutation.isLoading || unpublishArtMutation.isLoading}
              colorScheme={actions[actionType].colorScheme}
              onClick={actions[actionType].action}
              ml={3}
            >
              {actions[actionType].button}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
