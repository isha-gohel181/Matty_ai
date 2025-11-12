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
        // Redirect immediately without showing success message
        navigate('/dashboard/editor');
      } catch (error) {
        console.error('OAuth success handling failed:', error);
        navigate('/login');
      }
    };

    handleOAuthSuccess();
  }, [dispatch, navigate]);

  // Return null to avoid showing anything
  return null;
};

export default OAuthSuccess;