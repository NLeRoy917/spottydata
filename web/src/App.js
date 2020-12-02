import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './Pages/Home';
import AnalysisSelect from './Pages/AnalysisSelect';
import Playlists from './Pages/Playlists';
import PlaylistAnalysis from './Pages/PlaylistAnalysis';
import SearchPage from './Pages/Search';
import About from './Pages/About';
import SongAnalysis from './Pages/SongAnalysis';
import FindMusic from './Pages/FindMusic';


const App = () => {

  return (
    <Router>
    <div className="App">
      <Switch>
        {/* <Route path="/about/" component={About}>
        </Route> */}
        <Route path="/playlists/" component={Playlists}>
        </Route>
        <Route path="/song-analysis/" component={SongAnalysis}>
        </Route>
        <Route path="/playlist-analysis/" component={PlaylistAnalysis}>
        </Route>
        <Route path="/analysis-select/" component={AnalysisSelect}>
        </Route>
        <Route path="/search/" component={SearchPage}>
        </Route>
        <Route path="/find-music/" component={FindMusic}>
        </Route>
        <Route path="/" exact component={Home}>
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
