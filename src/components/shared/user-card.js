import { Avatar, Box, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export const UserCard = ({ user }) => {
  const { locale } = useRouter()

  return (
    <Stack p={6} spacing={4} rounded='md' bg='white' w='full' shadow='md' align='center'>
      {/* TODO Create shared image component */}
      <Avatar name={user.name || user.username} size='lg' src={process.env.NEXT_PUBLIC_API_URL + user.avatar?.url} />
      <Text textAlign='center' fontSize='lg' fontWeight='semibold' color='blue.500'>
        {user.name || user.username}
      </Text>

      <Box textAlign='center' fontSize='md'>
        {user.jobs.map(job => (
          <Text key={job.code}>{job[`name_${locale}`]}</Text>
        ))}
      </Box>
    </Stack>
  )
}
