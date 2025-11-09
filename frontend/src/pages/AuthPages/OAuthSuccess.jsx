import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUserInfo } from '../../redux/slice/user/user.slice.js';

const OAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // Get user info directly (cookies are already set by OAuth callback)
        await dispatch(getLoggedInUserInfo()).unwrap();
        navigate('/dashboard/editor');
      } catch (error) {
        console.error('OAuth success handling failed:', error);
        navigate('/login');
      }
    };

    handleOAuthSuccess();
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;