import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerUser, selectAuthLoading, selectError, clearError } from '@/redux/slice/user/user.slice.js';
import CustomAlert from '@/components/CustomAlert/CustomAlert';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Clear errors when the component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(registerUser(data)).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        navigate('/dashboard/editor');
      }
    });
  };
  
  return (
    <>
      {error && <CustomAlert type="error" message={error} onClose={() => dispatch(clearError())} />}
      <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>Fill in your details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="John Doe" {...register('fullName')} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="9876543210" {...register('phone')} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Register;