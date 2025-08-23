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

const FormSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof FormSchema>;

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          navigate({ to: '/protected' });
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

        <Button
          className="mt-3 h-12"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>

        <div className="text-center text-muted-foreground text-sm">
          Don't have an account? Sign up
        </div>
      </form>
    </Form>
  );
};

export default Login;
