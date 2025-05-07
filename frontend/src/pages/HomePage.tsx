import Layout from '../components/layout/Layout';
import StreamList from '../components/stream/StreamList';

const HomePage = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Live Now</h2>
          <StreamList status="active" />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Streams</h2>
          <StreamList status="completed" />
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
