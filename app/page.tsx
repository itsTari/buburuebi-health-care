import CtaSlider from "./components/CtaSlider";
import Feedback from "./components/Feedback";
import HomePage from "./components/HomePage";
import Services from "./components/Services";

const  Home = () => {
  return (
   <>
      <HomePage /> 
      <CtaSlider /> 
      <Services />
      <Feedback/>
   </>
  );
}

export default Home;
