import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import type { ThirdSpace } from './lib/supabase';
import { supabase } from './lib/supabase';
import { MOCK_SPOTS } from './lib/mockData';
import { MainPage } from './components/MainPage';
import { DetailPage } from './components/DetailPage';

// Wrapper component to extract :id route param for DetailPage
function DetailPageWrapper({ spots }: { spots: ThirdSpace[] }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const spot = spots.find((s) => s.id === id);

  if (!spot) {
    return (
      <div className="min-h-screen bg-[#e8f5d6] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-[#1b2a22]">Study Spot Not Found</h2>
        <p className="text-sm text-[#45690b]">The spot you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-[#1b5e39] text-white font-bold rounded-xl shadow hover:bg-[#154b2d] transition"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return <DetailPage spot={spot} onBack={() => navigate('/')} />;
}

// Main Home Route Wrapper
function MainPageWrapper({ spots }: { spots: ThirdSpace[] }) {
  const navigate = useNavigate();

  const handleSelectSpot = (spot: ThirdSpace) => {
    navigate(`/spot/${spot.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainPage
      spots={spots}
      onSelectSpot={handleSelectSpot}
      onSelectCategory={() => {}}
    />
  );
}

export function App() {
  const [spots, setSpots] = useState<ThirdSpace[]>(MOCK_SPOTS);
  const [loading, setLoading] = useState(false);

  // Fetch spots from Supabase with fallback to MOCK_SPOTS
  useEffect(() => {
    async function fetchSpotsFromSupabase() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('third_spaces').select('*');

        if (error) {
          console.warn('Supabase query warning (using local Manila spots dataset):', error.message);
          return;
        }

        if (data && data.length > 0) {
          // Merge Supabase spots with mock spots if needed
          setSpots(data as ThirdSpace[]);
        }
      } catch (err) {
        console.warn('Supabase connection offline or not yet configured (using local dataset):', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSpotsFromSupabase();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#e8f5d6]">
        {loading && (
          <div className="fixed top-2 right-2 bg-[#1b5e39] text-white text-[10px] font-bold px-3 py-1 rounded-full z-50 animate-pulse shadow">
            Syncing with Supabase...
          </div>
        )}
        <Routes>
          <Route path="/" element={<MainPageWrapper spots={spots} />} />
          <Route path="/spot/:id" element={<DetailPageWrapper spots={spots} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
