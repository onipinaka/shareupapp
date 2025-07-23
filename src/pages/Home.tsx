
import PrimaryBtn from '../components/PrimaryBtn'


function Home() {
  return (
    <div className='flex w-full h-screen flex-col justify-center items-center gap-8 bg-green-100'>
        
        <PrimaryBtn navigateSite='/send' label='SEND'/>
        <PrimaryBtn navigateSite='/recieve' label='RECIEVE'/>
    
        
    </div>
  )
}

export default Home