import React, { Suspense } from 'react';
import './styles/app.css';
import Navbar from './Navbar';
import Home from './Home';
import Loader from 'react-loader-spinner'

const navbar_items: Array<NavbarItem> = [
  { id: 1, name: 'O MNIE' },
  { id: 2, name: 'ŻYCIORYS' },
  { id: 3, name: 'PROJEKTY' },
  { id: 4, name: 'KONTAKT' }
]

export interface NavbarItem {
  id: number,
  name: string
}

const App = (): JSX.Element => {
  return (
    <>
      <Navbar items={navbar_items} />
      <Home />
    </>
  )
}

export default App;
