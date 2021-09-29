import { useState } from "react"

import * as yup from "yup"
import Head from "next/head"
import { Input } from "@chakra-ui/input"
import { Tooltip } from "@chakra-ui/tooltip"
import { Button } from "@chakra-ui/button"
import { useRouter } from "next/router"
import { yupResolver } from "@hookform/resolvers/yup"
import { parseCookies } from "nookies"
import { GetServerSideProps } from "next"
import { SubmitHandler, useForm } from "react-hook-form"
import { Box, Flex, Heading, Stack } from "@chakra-ui/layout"
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control"

import { showErrorMessage, ToastComponent } from "../components/Toast"

import UserService from "../services/UserService"

import { UserData } from "../types/User"

function Registro() {
  const router = useRouter()

  const [savingUser, setSavingUser] = useState<boolean>(false)

  const schema = yup.object().shape({
    email: yup.string()
      .email("Email inválido")
      .required("Obrigatório inserir email"),
    password: yup.string()
      .required("Obrigatório inserir senha"),
    userName: yup.string()
      .required("Obrigatório inserir nome"),
  })

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<UserData>({
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<UserData> = async data => {
    setSavingUser(true)

    await new UserService().createUser(data)
      .then(() => router.replace('/login'))
      .catch(err => showErrorMessage(err.response.data.description))

    setSavingUser(false)
  }

  return (
    <>
      <Head>
        <title>Vaccine App - Registrar Usuário</title>
      </Head>
      <Flex
        w="100%"
        maxW={[360, 360, 480]}
        mx="auto"
        px="8"
        direction="column"
      >
        <Heading mt="12">Criar uma conta</Heading>
        <Box mt={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isRequired
              id="userName"
              isInvalid={!!errors && !!errors["userName"]}
            >
              <FormLabel>Nome do Usuário</FormLabel>
              <Input
                {...register("userName")}
              />
              <FormErrorMessage>
                {errors.userName?.message}
              </FormErrorMessage>
            </FormControl>
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
                label="Registrar usuário"
                aria-label="Clicando neste botão você irá registrar o usuário"
              >
                <Button
                  type="submit"
                  isLoading={savingUser}
                  loadingText="Salvando"
                >
                  Registrar
              </Button>
              </Tooltip>
              <Tooltip
                label="Limpar campos"
                aria-label="Clicando neste botão você irá limpar os campos"
              >
                <Button
                  type="reset"
                  onClick={() => reset()}
                >
                  Limpar
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

export default Registro
