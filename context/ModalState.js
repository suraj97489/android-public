import { useState } from "react";
import ModalContext from "./ModalContext";

const ModalState = (props) => {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [services, setServices] = useState();
  const [selectedServices, setSelectedServices] = useState([]);
  function resetSpModaldata() {
    let updatedServices = services.map((service) => ({
      ...service,
      checked: false,
    }));
    setServices(updatedServices);
    setCustomerMobile("");
    setCustomerName("");
    setSelectedServices([]);
  }
  return (
    <ModalContext.Provider
      value={{
        customerMobile,
        setCustomerMobile,
        customerName,
        setCustomerName,
        services,
        setServices,
        selectedServices,
        setSelectedServices,
        resetSpModaldata,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalState;
