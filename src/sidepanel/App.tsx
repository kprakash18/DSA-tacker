import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StatsBar from "./components/StatsBar";
import ProblemList from "./components/ProblemList";

function App() {
  return (
    <main className="flex h-screen flex-col bg-gray-50">
      <Header />

      <div className="border-b bg-white p-4">
        <SearchBar />
      </div>

      <div className="border-b bg-white p-4">
        <StatsBar />
      </div>

      <section className="flex-1 overflow-y-auto p-4">
        <ProblemList />
      </section>
    </main>
  );
}

export default App;