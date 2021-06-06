import { useState } from "react"

import * as yup from "yup"
import Head from "next/head"
import { useRouter } from "next/router"
import { Input } from "@chakra-ui/input"
import { Tooltip } from "@chakra-ui/tooltip"
import { Button } from "@chakra-ui/button"
import { yupResolver } from "@hookform/resolvers/yup"
import { SubmitHandler, useForm } from "react-hook-form"
import { Box, Flex, Heading, Stack } from "@chakra-ui/layout"
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control"

import { showErrorMessage, ToastComponent } from "../components/Toast"

import AuthService from "../services/AuthService"

import { UserData } from "../types/User"

function Login() {
  const router = useRouter()

  const [loggingInUser, setLoggingInUser] = useState<boolean>(false)

  const service = new AuthService()

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
  } = useForm<UserData>({
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<UserData> = async data => {
    setLoggingInUser(true)

    await service.loginUser(data)
      .then(() => router.replace('/consulta'))
      .catch(err => showErrorMessage(err.response.data.description))

    setLoggingInUser(false)
  }

  return (
    <>
      <Head>
        <title>Vaccine App - Login Usuário</title>
      </Head>
      <Flex
        w="100%"
        maxW="1160"
        mx="auto"
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

export default Login
