import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StreamList from '../components/stream/StreamList';

const StreamsPage = () => {
  const { status } = useParams<{ status?: 'active' | 'completed' }>();
  
  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-6">
          {status === 'active' ? 'Live Streams' : status === 'completed' ? 'Past Streams' : 'All Streams'}
        </h1>
        <StreamList status={status as 'active' | 'completed' | undefined} />
      </div>
    </Layout>
  );
};

export default StreamsPage;
