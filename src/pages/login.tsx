import { useContext, useState } from "react"

import * as yup from "yup"
import Head from "next/head"
import { Input } from "@chakra-ui/input"
import { Tooltip } from "@chakra-ui/tooltip"
import { Button } from "@chakra-ui/button"
import { yupResolver } from "@hookform/resolvers/yup"
import { SubmitHandler, useForm } from "react-hook-form"
import { Box, Flex, Heading, Stack } from "@chakra-ui/layout"
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control"

import { AuthContext } from "../contexts/AuthContext"

import { ToastComponent } from "../components/Toast"

import { UserLogin } from "../types/User"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"

function Login() {
  const { signIn } = useContext(AuthContext)

  const [loggingInUser, setLoggingInUser] = useState<boolean>(false)

  const schema = yup.object().shape({
    email: yup.string()
      .email("Email inválido")
      .required("Obrigatório inserir email"),
    password: yup.string()
      .required("Obrigatório inserir senha"),
  })

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<UserLogin>({
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<UserLogin> = async data => {
    setLoggingInUser(true)

    await signIn(data)

    setLoggingInUser(false)
  }

  return (
    <>
      <Head>
        <title>Vaccine App - Login Usuário</title>
      </Head>
      <Flex
        w="100%"
        maxW={[360, 360, 480]}
        mx="auto"
        px="8"
        direction="column"
      >
        <Heading mt="12">Logar conta</Heading>
        <Box mt={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isRequired
              mt={4}
              id="email"
              isInvalid={!!errors && !!errors["email"]}
            >
              <FormLabel>Email do usuário</FormLabel>
              <Input
                type="email"
                {...register("email")}
              />
              <FormErrorMessage>
                {errors.email?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              mt={4}
              id="password"
              isInvalid={!!errors && !!errors["password"]}
            >
              <FormLabel>Senha do usuário</FormLabel>
              <Input
                type="password"
                {...register("password")}
              />
              <FormErrorMessage>
                {errors.password?.message}
              </FormErrorMessage>
            </FormControl>
            <Stack direction="row-reverse" spacing={4} mt={4}>
              <Tooltip
                label="Logar"
                aria-label="Clicando neste botão você irá logar o usuário"
              >
                <Button
                  type="submit"
                  isLoading={loggingInUser}
                  loadingText="Logando"
                >
                  Logar
              </Button>
              </Tooltip>
            </Stack>
          </form>
        </Box>
        <ToastComponent />
      </Flex>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { 'nextauth.token': token } = parseCookies(context)

	if (token) {
		return {
			redirect: {
				destination: "/consulta",
				permanent: false,
			}
		}
	}

  return {
    props: {}
  }
}

export default Login
