import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CreateStreamForm from '../components/stream/CreateStreamForm';
import { useAuth } from '../context/AuthContext';

const CreateStreamPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Stream</h1>
        <CreateStreamForm />
      </div>
    </Layout>
  );
};

export default CreateStreamPage;
