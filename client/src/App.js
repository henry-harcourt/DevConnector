import React, { Fragment } from 'react'
import './App.css'
import Navbar from './components/layouts/Navbar'
import Landing from './components/layouts/Landing'

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <Landing />
    </Fragment>
  );
}

export default App;
