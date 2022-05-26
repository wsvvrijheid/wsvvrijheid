import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEuroCircle } from 'react-icons/ai'
import { FaDonate } from 'react-icons/fa'
import * as yup from 'yup'

import { Container, FormItem, Layout, ProjectsList } from '~components'
import { request } from '~lib'

function generateSchema(t) {
  return yup.object().shape({
    name: yup.string().required(t`apply-form.name.required`),
    email: yup
      .string()
      .email(t`apply-form.email.invalid`)
      .required(t`apply-form.email.required`),
  })
}

const DonatePage = ({ projects, title }) => {
  const [amount, setAmount] = useState(10)
  const [method, setMethod] = useState()

  const format = val => `€` + val
  const parse = val => +val.replace(/^\€/, '')

  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(generateSchema(t)),
    mode: 'onTouched',
  })

  const onSubmit = async data => {
    try {
      const { name, email } = data

      const result = await axios.post('/api/payment', { amount, method, name, email })

      window.location = result.data
    } catch (error) {
      console.error('request payment error', error)
    }
  }

  return (
    <Layout seo={{ title }}>
      <Container>
        <SimpleGrid alignItems='start' columns={{ base: 1, lg: 2 }} my={16} gap={16}>
          <Stack
            px={{ base: 8, lg: 16 }}
            py={{ base: 8, lg: 12 }}
            spacing={8}
            bg='white'
            rounded='lg'
            shadow='lg'
            as='form'
            onSubmit={handleSubmit(onSubmit)}
          >
            <Heading as='h3' size='lg' textAlign='center' fontWeight='black'>
              {title}
            </Heading>

            <Stack align='center'>
              <ButtonGroup>
                <Button
                  py={4}
                  colorScheme={method === 'ideal' ? 'blue' : 'gray'}
                  variant={method === 'ideal' ? 'solid' : 'outline'}
                  onClick={() => setMethod('ideal')}
                  h='auto'
                  size='lg'
                >
                  <Image src='/images/ideal-logo.svg' h={50} alt='ideal' />
                </Button>
                <Button
                  py={4}
                  colorScheme={method === 'creditcard' ? 'blue' : 'gray'}
                  variant={method === 'creditcard' ? 'solid' : 'outline'}
                  onClick={() => setMethod('creditcard')}
                  h='auto'
                  size='lg'
                >
                  <Image src='/images/visa-master-logo.svg' h={50} alt='ideal' />
                </Button>
                <Button
                  py={4}
                  colorScheme={method === 'paypal' ? 'blue' : 'gray'}
                  variant={method === 'paypal' ? 'solid' : 'outline'}
                  onClick={() => setMethod('paypal')}
                  h='auto'
                  size='lg'
                >
                  <Image src='/images/paypal-logo.svg' h={50} alt='ideal' />
                </Button>
              </ButtonGroup>
              <Text textAlign='center' fontSize='md' color='gray.500'>
                Choose your payment method *
              </Text>
            </Stack>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormItem isRequired register={register} id='name' errors={errors} label={t`apply-form.name.input`} />
              <FormItem isRequired register={register} id='email' errors={errors} label={t`apply-form.email.input`} />
            </Stack>

            <ButtonGroup w='full' isAttached alignSelf='center' size='lg'>
              {useBreakpointValue({ base: [10, 20, 30, 50], sm: [10, 20, 30, 50, 100] }).map(val => (
                <Button
                  isFullWidth
                  key={val}
                  variant={amount === val ? 'solid' : 'outline'}
                  colorScheme={amount === val ? 'green' : 'gray'}
                  onClick={() => setAmount(val)}
                >
                  €{val}
                </Button>
              ))}
            </ButtonGroup>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              pb={8}
              w='full'
              justify='center'
              align='center'
              spacing={6}
            >
              <NumberInput
                maxW={120}
                onChange={valueString => setAmount(parse(valueString))}
                value={format(amount)}
                min={10}
                size='lg'
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Slider
                flex={1}
                id='slider'
                defaultValue={10}
                value={amount}
                min={10}
                max={100}
                colorScheme='green'
                onChange={v => setAmount(v)}
                focusThumbOnChange={false}
              >
                <SliderTrack height={3} rounded='lg'>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg='green.500'
                  color='white'
                  placement='bottom'
                  isOpen={!!amount}
                  label={`€${amount}`}
                >
                  <SliderThumb boxSize={6} bg='green.500' color='white'>
                    <Box boxSize='full' as={AiOutlineEuroCircle} />
                  </SliderThumb>
                </Tooltip>
              </Slider>
            </Stack>
            <Button
              isDisabled={!amount || !method || !isValid}
              colorScheme='blue'
              type='submit'
              leftIcon={<FaDonate />}
            >
              {title}
              {amount && ` €${amount}`}
            </Button>
          </Stack>
          {projects.result && <ProjectsList projects={projects.result} />}
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export const getStaticProps = async context => {
  const projects = await request({ url: 'api/projects' })

  const seo = {
    title: {
      en: 'Donate',
      nl: 'Doneer',
      tr: 'Bağış Yap',
    },
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      title: seo.title[context.locale],
      projects,
    },
  }
}

export default DonatePage
