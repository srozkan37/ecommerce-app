import {
  Box,
  Button,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react'
import { Field, FieldProps, Formik, Form as FormikForm, FormikHelpers } from 'formik'
import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { BiExit } from 'react-icons/bi'
import { FaFacebook } from 'react-icons/fa'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { object, string } from 'yup'
import Header from './Header'
import { useAuth } from '../context/AuthContext'

type Props = {
  authType: 'login' | 'register'
}

interface Values {
  email: string
  password: string
  fullName: string
}

// Give the components chakra props
const Form = chakra(FormikForm)
const ExitIcon = chakra(BiExit)
const VisibleEye = chakra(AiFillEye)
const InvisibleEye = chakra(AiFillEyeInvisible)
const FbIcon = chakra(FaFacebook)

const AuthPage = ({ authType }: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const validationSchema = object({
    email: string().email('Invalid email address').required('Required'),
    password: string().min(8, 'Must be at least 8 characters').required('Required'),
    fullName: string().optional(),
  })

  return (
    <>
      <Header />
      <Formik<Values>
        initialValues={{ email: '', password: '', fullName: '' }}
        onSubmit={async (values: Values, actions: FormikHelpers<Values>) => {
          setSubmitError(null)
          try {
            if (authType === 'register') {
              await register({
                email: values.email,
                password: values.password,
                full_name: values.fullName || undefined,
              })
            } else {
              await login({
                email: values.email,
                password: values.password,
              })
            }
            actions.setSubmitting(false)
            navigate('/')
          } catch (err: unknown) {
            actions.setSubmitting(false)
            const message = err instanceof Error ? err.message : 'Authentication failed'
            setSubmitError(message)
          }
        }}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form
            action="/"
            maxW="480px"
            px={6}
            pt={6}
            pb={12}
            boxShadow="lg"
            m="auto"
            mt={{ base: '130px', smallTablet: '152px' }}
          >
            <VStack spacing={6}>
              <Heading fontSize="2xl" textTransform="uppercase" color="text.primary">
                {authType}
              </Heading>

              {submitError && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription fontSize="sm">{submitError}</AlertDescription>
                </Alert>
              )}

              {authType === 'register' && (
                <Field name="fullName">
                  {({ field, form }: FieldProps<string, Values>) => (
                    <FormControl
                      w="100%"
                      isInvalid={form.errors.fullName ? !!form.touched.fullName : false}
                    >
                      <Input
                        {...field}
                        id="fullName"
                        type="text"
                        placeholder="Full Name (Optional)"
                        _placeholder={{ color: 'text.secondary' }}
                        bg="bg.subtle"
                        py={7}
                      />
                      <FormErrorMessage>{form.errors.fullName}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              )}

              <Field name="email">
                {({ field, form }: FieldProps<string, Values>) => (
                  <FormControl
                    w="100%"
                    isInvalid={form.errors.email ? !!form.touched.email : false}
                  >
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      _placeholder={{ color: 'text.secondary' }}
                      bg="bg.subtle"
                      py={7}
                      autoComplete="email"
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field, form }: FieldProps<string, Values>) => (
                  <FormControl
                    w="100%"
                    isInvalid={form.errors.password ? !!form.touched.password : false}
                  >
                    <InputGroup>
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        _placeholder={{ color: 'text.secondary' }}
                        bg="bg.subtle"
                        py={7}
                        autoComplete={authType === 'login' ? 'current-password' : 'new-password'}
                      />
                      <InputRightElement h="100%" mr={1}>
                        <IconButton
                          aria-label="Show or Hide password"
                          borderRadius="full"
                          variant="ghost"
                          size="sm"
                          color="text.primary"
                          icon={
                            showPassword ? <VisibleEye size={22} /> : <InvisibleEye size={22} />
                          }
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Flex
                justify="space-between"
                w="100%"
                fontWeight="500"
                display={authType === 'login' ? 'flex' : 'none'}
              >
                <Checkbox color="text.primary">
                  <Text fontSize={{ base: '0.9375rem', sm: '1rem' }}>Remember me</Text>
                </Checkbox>
                <Link
                  color="text.primary"
                  textDecoration={{ base: 'underline', sm: 'none' }}
                  fontSize={{ base: '0.9375rem', sm: '1rem' }}
                >
                  <Text>Forgot Password?</Text>
                </Link>
              </Flex>

              <Button
                type="submit"
                isLoading={props.isSubmitting}
                textTransform="uppercase"
                w="100%"
                variant="accent"
                py={{ base: 6, sm: 7 }}
                fontWeight="700"
              >
                <ExitIcon size={26} flex={1} />
                <Text flex={6} px={1}>
                  {authType === 'register' ? 'Create Account' : 'Login'}
                </Text>
                <Box visibility="hidden" flex={1} />
              </Button>

              <Text fontSize="sm" color="text.secondary">
                {authType === 'login' ? 'Don’t have an account?' : 'Already have an account?'}{' '}
                <Link
                  as={RouterLink}
                  to={authType === 'login' ? '/register' : '/login'}
                  color="teal.500"
                  fontWeight="bold"
                >
                  {authType === 'login' ? 'Sign Up' : 'Sign In'}
                </Link>
              </Text>

              <Link w="100%" _hover={{ textDecoration: 'none' }}>
                <Button
                  textTransform="uppercase"
                  variant="solid"
                  w="100%"
                  py={{ base: 6, sm: 7 }}
                  fontWeight="700"
                >
                  <FbIcon size={26} flex={1} />
                  <Text flex={8} pl={2}>
                    {authType} with Facebook
                  </Text>
                  <Box visibility="hidden" flex={1} display={{ base: 'none', mobileM: 'block' }} />
                </Button>
              </Link>
            </VStack>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default AuthPage
