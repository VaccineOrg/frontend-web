import * as yup from "yup"
import Head from "next/head"
import { Input } from "@chakra-ui/input"
import { Tooltip } from "@chakra-ui/tooltip"
import { Button } from "@chakra-ui/button"
import { yupResolver } from "@hookform/resolvers/yup"
import { SubmitHandler, useForm } from "react-hook-form"
import { Box, Flex, Heading, Stack } from "@chakra-ui/layout"
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control"

import { showErrorMessage, showSuccessMessage } from "../components/Toast"

import UserService from "../services/UserService"

import { UserData } from "../types/User"

function Registro() {
  const service = new UserService()

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

  const onSubmit: SubmitHandler<UserData> = data => {
    service.createUser(data)
      .then(() => {
        reset()
        showSuccessMessage("Usuário registrado com sucesso")
      })
      .catch(err => showErrorMessage(err.response.data.description))
  }

  return (
    <>
      <Head>
        <title>Vaccine App - Registrar Usuário</title>
      </Head>
      <Flex
        w="100%"
        maxW="1160"
        mx="auto"
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
                  isLoading={false}
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
      </Flex>
    </>
  )
}

export default Registro
