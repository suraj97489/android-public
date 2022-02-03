import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDeleteCustomerModal } from "../features/androidSlice";
import { Button } from "react-native-elements";
import colors from "../theme/colors";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../firebaseAndroid";

const DeleteCustomerModal = () => {
  const dispatch = useDispatch();
  const salon = useSelector((state) => state.salon.salon);
  const index = useSelector((state) => state.android.custIndex);
  const provider = useSelector((state) => state.android.activeProvider);
  const customer = useSelector((state) => state.android.activeCustomer);

  const deleteCustomerModal = useSelector(
    (state) => state.android.deleteCustomerModal
  );
  function closeDeleteCustomerModal() {
    dispatch(updateDeleteCustomerModal(false));
  }
  async function deleteCustomer() {
    const docRef = doc(db, "salon", salon.id);
    try {
      let newprovidersarray;
      await runTransaction(db, async (transaction) => {
        let thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }
        newprovidersarray = thisDoc.data().serviceproviders.map((each) => {
          if (each.id === provider.id) {
            let custArray = provider.customers.filter((cust, i) => i !== index);
            return { ...provider, customers: custArray };
          } else {
            return each;
          }
        });

        transaction.update(docRef, { serviceproviders: newprovidersarray });
      });
    } catch (e) {
      console.error("something went wrong");
    }
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={deleteCustomerModal}
      onRequestClose={closeDeleteCustomerModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>are you sure you want to delete?</Text>
          <View style={styles.buttonsContainer}>
            <Button
              onPress={() => {
                dispatch(updateDeleteCustomerModal(false));
                deleteCustomer();
              }}
              title="yes"
              titleStyle={{ color: "black" }}
              buttonStyle={{
                paddingVertical: 0,
                paddingHorizontal: 10,
                margin: 3,
                backgroundColor: colors.secondary,
              }}
            />
            <Button
              buttonStyle={{
                backgroundColor: "wheat",
                margin: 3,
                paddingVertical: 0,
                paddingHorizontal: 3,
              }}
              titleStyle={{ color: "black" }}
              onPress={closeDeleteCustomerModal}
              title="cancel"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteCustomerModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    width: "80%",

    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
