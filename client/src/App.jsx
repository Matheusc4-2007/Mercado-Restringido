import { useState } from 'react';
import './App.css'
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { FormLog } from './components/FormLog';

/*Fondos*/

import bg1 from './assets/bg-landing-6.png'
import bg2 from './assets/bg-landing-3.png'
import bg3 from './assets/bg-landing-4.jpg'
import bg4 from './assets/bg-landing-5.png'
import bg5 from './assets/bg-landing-2.png'



function App() {
  let [page, setPage] = useState("home");
  let [bg, setBg] = useState(0);

  // para cambiar los fondos
  const backgrounds = [{
      id: 0,
      url: bg1,
      subtittle: "gran catálogo en ropas"
    },
    {
      id: 1,
      url: bg2,
      subtittle: "todos tus productos favoritos"
    },
    {
      id: 2,
      url: bg3,
      subtittle: "lo último en tecnología"
    },
    {
      id: 3,
      url: bg4,
      subtittle: "articulos para tu hogar"
    },
    {
      id: 4,
      url: bg5,
      subtittle: "todo en cosmeticos y cuidado personal"
    },
  ]

  switch (page) {
    case 'home':
      return (
        <>
        <NavBar page={page} setPage={setPage}/>
        <Home bg={bg} setBg={setBg} backgrounds={backgrounds} page={page} setPage={setPage}/>
        </>
      )
    case 'catalog':
      return (
        <>
        <NavBar page={page} setPage={setPage}/>
        </>
      )
    case 'cart':
      return (
        <>
        <NavBar page={page} setPage={setPage}/>
        </>
      )
    case 'login':
      return (
        <>
        <NavBar page={page} setPage={setPage}/>
        <FormLog/>
        </>
      )
  }
}

export default App
