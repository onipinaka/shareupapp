import { createBrowserRouter } from 'react-router-dom'
import Mainlayout from '../layout/Mainlayout.tsx'

import Recieve from '../pages/Recieve.tsx'
import Send from '../pages/Send.tsx'
import Home from '../pages/Home.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Mainlayout/>,
    children: [
        {path: "", element: <Home/>}, 
      {path: "send", element: <Send/>},
      {path: "recieve", element: <Recieve/>}
    ]

  }
])



export default router
