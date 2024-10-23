"use client"

import LoadingButton from "@/components/loadingButton"
import { PasswordInput } from "@/components/passwordInput"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpSchema, SignUpValues } from "@/lib/validation"
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { signUp } from "./actions"


export default function SignUpForm() {

  const [error, setError] = useState<string>("");

  const [isPending, startTransition] = useTransition()

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      username: '',
      password: ''
    }
  })

  const onsubmit = async (values: SignUpValues) => {
    setError('')
    startTransition(async () => {
      const { error } = await signUp(values)
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
                <Input disabled={isPending} placeholder="username" {...field} />
              </FormControl>

            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" flex items-center gap-1">Email <FormMessage /></FormLabel>
              <FormControl>
                <Input disabled={isPending} placeholder="email" {...field} />
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
        <p className=" h-10 w-full rounded-lg bg-[#f9a0a0] text-sm text-red-600 flex justify-center items-center" >{error}</p>
        }
       <LoadingButton className=" w-full" isPending={isPending} disabled={isPending}>Sign Up</LoadingButton>

      </form>
    </Form>
  )
}
