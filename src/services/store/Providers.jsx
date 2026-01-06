import { Provider } from "react-redux";
import { Store } from "./Store";

export const Providers = ({ children }) => {
  return <Provider store={Store}>{children}</Provider>;
};
