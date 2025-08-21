import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authClient } from '~/clients/auth-client';

const FormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The two passwords do not match.',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof FormSchema>;

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          navigate({ to: '/' });
        },
      }
    );
    if (error) {
      toast.error(error.message ?? JSON.stringify(error));
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input className="mt-1" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="mt-1" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative flex w-full items-center justify-end">
                  <Input
                    className="mt-1"
                    type={isPasswordVisible ? 'text' : 'password'}
                    {...field}
                  />
                  <Button
                    className="absolute mr-2 h-7 w-7 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPasswordVisible(!isPasswordVisible);
                    }}
                    size="icon"
                    tabIndex={-1}
                    type="button"
                    variant="ghost"
                  >
                    {isPasswordVisible ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative flex w-full items-center justify-end">
                  <Input
                    className="mt-1"
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    {...field}
                  />
                  <Button
                    className="absolute mr-2 h-7 w-7 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
                    }}
                    size="icon"
                    tabIndex={-1}
                    type="button"
                    variant="ghost"
                  >
                    {isConfirmPasswordVisible ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="mt-3 h-12"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Register;
