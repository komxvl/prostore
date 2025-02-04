import Image from "next/image";
import loader from '@/assets/loader.gif'
const LoadingPage = () => {
    return (
        <div style={{display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center'}}> 
        <Image width={150} height={150} src={loader} alt="loader" />
        </div>
     );
}
 
export default LoadingPage;