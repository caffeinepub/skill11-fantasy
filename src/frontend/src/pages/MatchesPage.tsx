import MatchList from '../components/MatchList';

export default function MatchesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="relative rounded-2xl overflow-hidden mb-8 h-48 md:h-64 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1200x400.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cricket-green-900/80 to-energy-orange-900/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-black mb-2">SKILL11 FANTASY</h1>
            <p className="text-lg md:text-xl font-bold">Low-Entry Cricket Contests • ₹10-₹100</p>
          </div>
        </div>
      </div>

      <MatchList />
    </div>
  );
}
