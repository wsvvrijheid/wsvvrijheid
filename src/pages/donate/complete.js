import { Alert, AlertDescription, AlertIcon, AlertTitle, Center, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { Container, Layout } from '~components'
import { request } from '~lib'

const DonationResult = ({ status, title, description }) => (
  <Alert
    status={status}
    variant='subtle'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    textAlign='center'
    height='200px'
  >
    <AlertIcon boxSize='40px' mr={0} />
    <AlertTitle mt={4} mb={1} fontSize='lg'>
      {title}
    </AlertTitle>
    <AlertDescription maxWidth='sm'>{description}</AlertDescription>
  </Alert>
)

// TODO Make transaction detail messages more user friendly and create translations
const PaymentComplete = () => {
  const { query } = useRouter()

  const {
    data: transaction,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: 'transaction',
    // TODO Instead of relying on our database,
    // we may retrieve payment info from mollie through serverless api
    queryFn: () => request({ url: `api/donates/${query.id}` }),
    enabled: false,
  })

  useEffect(() => {
    if (query.id) refetch()
  }, [query.id, refetch])

  return null

  const renderStatus = () => {
    if (transaction?.status === 'paid') {
      return <DonationResult title='Thank you' description='We received your donation' status='success' />
    }

    if (transaction?.status === 'open') {
      return (
        <DonationResult
          status='warning'
          title='Payment not completed!'
          description='It seems your payment has not been competed'
        />
      )
    }

    if (transaction?.status === 'expired') {
      return <DonationResult status='warning' title='Expired' description='Payment link has been expired' />
    }

    if (transaction?.status === 'canceled') {
      return <DonationResult status='info' title='Cancelled' description='You canceled the donation' />
    }

    if (transaction?.status === 'failed') {
      return <DonationResult status='error' title='Failed' description='Transaction failed' />
    }

    return (
      <DonationResult
        status='warning'
        title='Not found'
        description='Transaction could not been found. Please contact!'
      />
    )
  }

  return (
    <Layout>
      <Container maxWidth='container.sm'>
        <Center minH='70vh'>
          {isLoading || !transaction ? <Spinner colorScheme='blue' size='lg' /> : renderStatus()}
        </Center>
      </Container>
    </Layout>
  )
}

export default PaymentComplete
