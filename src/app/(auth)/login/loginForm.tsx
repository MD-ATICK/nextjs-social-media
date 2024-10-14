"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import LoadingButton from "@/components/ui/loadingButton"
import { PasswordInput } from "@/components/ui/passwordInput"
import { loginSchema, LoginValues } from "@/lib/validation"
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { login } from "./actions"


export default function LoginForm() {

  const [error, setError] = useState<string>("");

  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onsubmit = async (values: LoginValues) => {
    setError('')
    console.log(values)
    startTransition(async () => {
      const { error } = await login(values)
      if (error) {
        setError(error)
      }
    })
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className=" space-y-4 my-4">

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" flex items-center gap-1">UserName <FormMessage /></FormLabel>
              <FormControl>
                <Input disabled={isPending} placeholder="username or email" {...field} />
              </FormControl>

            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" flex items-center gap-1">Password <FormMessage /></FormLabel>
              <FormControl>
                <PasswordInput disabled={isPending} placeholder="password" {...field} />
              </FormControl>

            </FormItem>
          )}
        />
        {
          error &&
        <p className=" h-10 w-full rounded-lg bg-[#f2a8a8] text-sm text-red-600 flex justify-center items-center" >{error}</p>
        }
       <LoadingButton className=" w-full" disabled={isPending}>Login</LoadingButton>

      </form>
    </Form>
  )
}
