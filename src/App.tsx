import ninjaOneLogo from "/NinjaOneLogo.svg";
import "./App.css";

console.log(import.meta.env.VITE_BASE_SERVICES_URI);

function App() {
  return (
    <>
      <header>
        <img src={ninjaOneLogo} className="logo" alt="Ninja One Logo" />
      </header>
    </>
  );
}

export default App;
