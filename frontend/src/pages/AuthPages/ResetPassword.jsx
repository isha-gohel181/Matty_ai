import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { resetPassword, selectAuthLoading, selectError, clearError } from '@/redux/slice/user/user.slice.js';
import CustomAlert from '@/components/CustomAlert/CustomAlert';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectError);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data) => {
    dispatch(resetPassword({ token, password: data.password })).then((result) => {
      if (resetPassword.fulfilled.match(result)) {
        setMessage('Password has been reset successfully. You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      }
    });
  };

  return (
    <>
      {error && <CustomAlert type="error" message={error} onClose={() => dispatch(clearError())} />}
      {message && <CustomAlert type="success" message={message} onClose={() => setMessage('')} />}
      <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Back to Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ResetPassword;