import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { acceptInvitation } from '../../redux/slice/team/teamSlice';
import { toast } from 'sonner';

const TeamInvitationPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        await dispatch(acceptInvitation(token)).unwrap();
        toast.success('Invitation accepted successfully!');
        navigate('/dashboard/teams');
      } catch (error) {
        toast.error(error.message || 'Failed to accept invitation');
        navigate('/dashboard/teams');
      }
    };

    if (token) {
      handleInvitation();
    }
  }, [token, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Processing invitation...</p>
      </div>
    </div>
  );
};

export default TeamInvitationPage;