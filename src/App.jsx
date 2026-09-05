import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import MyGraph from './pages/myGraph';
import Resume from './pages/cv';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/myGraph" element={<MyGraph />} />
        <Route path="/cv" element={<Resume />} />
      </Routes>
    </Router>
  );
}

export default App;
