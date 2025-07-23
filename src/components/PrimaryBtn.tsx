
import {  useNavigate } from 'react-router-dom'

const PrimaryBtn = ({label, navigateSite}:{label:string, navigateSite:string}) => {

    const navigate = useNavigate();

  const goto = () => {
    navigate(navigateSite);
  }

  return (
    <button className='bg-green-300 p-8 rounded-4xl text-4xl font-semibold active:bg-green-400 ' onClick={goto}>{label}</button>
  )
}

export default PrimaryBtn