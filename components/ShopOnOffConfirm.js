import { doc, runTransaction } from "firebase/firestore";
import React, { useContext } from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { Button } from "react-native-elements";
import { db } from "../firebaseAndroid";

import { useDispatch, useSelector } from "react-redux";
import {
  updateShopButtonText,
  updateShopOnoffModal,
} from "../features/androidSlice";

const ShopOnOffConfirm = () => {
  const salon = useSelector((state) => state.salon.salon);
  const shopButtonText = useSelector((state) => state.android.shopButtonText);
  const shopOnOffModal = useSelector((state) => state.android.shopOnOffModal);
  const dispatch = useDispatch();

  async function shopOpenCloseHandler(e) {
    closeshopOnOffModal();
    const docRef = doc(db, "salon", salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }
        transaction.update(docRef, {
          shopOpen: shopButtonText === "shop is open" ? false : true,
        });
      });
      if (shopButtonText === "shop is open") {
        dispatch(updateShopButtonText("shop is closed"));
      } else {
        dispatch(updateShopButtonText("shop is open"));
      }
    } catch (e) {
      console.error("something went wrong");
    }
  }

  function closeshopOnOffModal() {
    dispatch(updateShopOnoffModal(false));
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={shopOnOffModal}
      onRequestClose={closeshopOnOffModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>
            {shopButtonText === "shop is open"
              ? "are you sure you want to close shop?"
              : "are you sure you want to open shop?"}
          </Text>
          <View style={styles.buttonsContainer}>
            <Button
              onPress={shopOpenCloseHandler}
              title="yes"
              buttonStyle={{
                paddingVertical: 0,
                paddingHorizontal: 7,
                margin: 3,
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
              onPress={closeshopOnOffModal}
              title="cancel"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ShopOnOffConfirm;

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
