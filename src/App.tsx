import { useState } from 'react';
import { MainPage } from './components/MainPage';
import { DetailPage } from './components/DetailPage';
import { MOCK_SPOTS } from './lib/mockData';
import type { ThirdSpace } from './lib/supabase';

export function App() {
  const [selectedSpot, setSelectedSpot] = useState<ThirdSpace | null>(null);

  return (
    <div>
      {selectedSpot ? (
        <DetailPage spot={selectedSpot} onBack={() => setSelectedSpot(null)} />
      ) : (
        <MainPage
          spots={MOCK_SPOTS}
          onSelectSpot={(spot) => setSelectedSpot(spot)}
          onSelectCategory={() => {}}
        />
      )}
    </div>
  );
}

export default App;
