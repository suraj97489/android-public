import AndroidContext from "./AndroidContext";

import { useState } from "react";

const AndroidState = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notify, setNotify] = useState();

  const [addingcustomer, setAddingcustomer] = useState(true);
  const [custIndex, setCustIndex] = useState();

  const [providerId, setProviderId] = useState();

  // const [salonUsername, setSalonUsername] = useState("username");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  // const [alertProvider, setAlertProvider] = useState(false);
  // const [alertMessage, setAlertMessage] = useState();
  const [shopButtonText, setShopButtonText] = useState("shop is open");

  // not in website
  const [shopOnOffModal, setShopOnOffModal] = useState(false);

  return (
    <AndroidContext.Provider
      value={{
        modalVisible,
        setModalVisible,

        addingcustomer,
        setAddingcustomer,

        providerId,
        setProviderId,
        custIndex,
        setCustIndex,

        shopButtonText,
        setShopButtonText,
        buttonDisabled,
        setButtonDisabled,
        notify,
        setNotify,
        shopOnOffModal,
        setShopOnOffModal,
      }}
    >
      {props.children}
    </AndroidContext.Provider>
  );
};

export default AndroidState;
