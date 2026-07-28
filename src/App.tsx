import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import type { ThirdSpace } from './lib/supabase';
import { MOCK_SPOTS } from './lib/mockData';
import { MainPage } from './components/MainPage';
import { DetailPage } from './components/DetailPage';

// Wrapper component to extract :id route param for DetailPage
function DetailPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const spot = MOCK_SPOTS.find((s) => s.id === id);

  if (!spot) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-[#1b2a22]">Study Spot Not Found</h2>
        <p className="text-sm text-[#586b61]">The spot you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-[#567b66] text-white font-bold rounded-xl shadow"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return <DetailPage spot={spot} onBack={() => navigate('/')} />;
}

// Main Home Route Wrapper
function MainPageWrapper() {
  const navigate = useNavigate();

  const handleSelectSpot = (spot: ThirdSpace) => {
    navigate(`/spot/${spot.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainPage
      spots={MOCK_SPOTS}
      onSelectSpot={handleSelectSpot}
      onSelectCategory={() => {}}
    />
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f8f7f4]">
        <Routes>
          <Route path="/" element={<MainPageWrapper />} />
          <Route path="/spot/:id" element={<DetailPageWrapper />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
