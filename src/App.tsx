import "./App.css";
import Hero from "./components/Hero";
import Features from "./components/FeaturesTemp";
import Navbar from "./components/Navbar";
import Assistant from "./components/Assistant";
function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Features />
      <Assistant />
    </div>

  );
}

export default App;