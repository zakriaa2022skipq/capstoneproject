import './App.css';

function Header() {
  return <div>`Header component`</div>;
}
function App() {
  return (
    <div className="App">
      <h1>Vite + React</h1>
      <Header />
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
