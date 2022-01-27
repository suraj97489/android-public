import { doc, runTransaction, setDoc } from "firebase/firestore";
import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { Button } from "react-native-elements";
import { db } from "../firebaseAndroid";
import AndroidContext from "./../context/AndroidContext";

const ShopOnOffConfirm = () => {
  const androidcontext = useContext(AndroidContext);

  async function shopOpenCloseHandler(e) {
    closeshopOnOffModal();
    const docRef = doc(db, "salon", androidcontext.salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }
        transaction.update(docRef, {
          shopOpen:
            androidcontext.shopButtonText === "shop is open" ? false : true,
        });
      });
      if (androidcontext.shopButtonText === "shop is open") {
        androidcontext.setShopButtonText("shop is closed");
      } else {
        androidcontext.setShopButtonText("shop is open");
      }
    } catch (e) {
      console.error("something went wrong");
    }
  }

  function closeshopOnOffModal() {
    androidcontext.setShopOnOffModal(false);
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={androidcontext.shopOnOffModal}
      onRequestClose={closeshopOnOffModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>
            {androidcontext.shopButtonText === "shop is open"
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
