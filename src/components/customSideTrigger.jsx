import { RxHamburgerMenu } from "react-icons/rx";
import { useSidebar } from "./ui/sidebar";

const CustomerSideTrigger = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar}>
      <RxHamburgerMenu size={25} />
    </button>
  );
};

export default CustomerSideTrigger;
