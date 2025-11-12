import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl text-foreground">
          Create Account
        </h1>
        <p className="max-w-sm text-lg text-muted-foreground">
          Fill in your details to get started and begin creating stunning designs.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-left block text-foreground">Full Name</Label>
            <Input 
              id="fullName" 
              placeholder="John Doe" 
              {...register('fullName')}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-white/40"
            />
            {errors.fullName && <p className="text-sm text-destructive text-left">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-left block text-foreground">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              {...register('email')}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-white/40"
            />
            {errors.email && <p className="text-sm text-destructive text-left">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-left block text-foreground">Phone</Label>
            <Input 
              id="phone" 
              placeholder="9876543210" 
              {...register('phone')}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-white/40"
            />
            {errors.phone && <p className="text-sm text-destructive text-left">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-left block text-foreground">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              {...register('password')}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-white/40"
            />
            {errors.password && <p className="text-sm text-destructive text-left">{errors.password.message}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full rounded-full bg-white text-black px-8 py-6 text-lg font-semibold hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default Register;