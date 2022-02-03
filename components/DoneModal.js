import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDoneModal } from "../features/androidSlice";
import { Button } from "react-native-elements/dist/buttons/Button";
import colors from "../theme/colors";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../firebaseAndroid";

const DoneModal = () => {
  const dispatch = useDispatch();
  const salon = useSelector((state) => state.salon.salon);
  const doneModal = useSelector((state) => state.android.doneModal);
  const provider = useSelector((state) => state.android.doneProvider);
  const customer = useSelector((state) => state.android.doneCustomer);
  function closeDoneModal() {
    dispatch(updateDoneModal(false));
  }

  async function done() {
    const docRef = doc(db, "salon", salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }

        let newprovidersarray = thisDoc.data().serviceproviders.map((each) => {
          if (each.id === provider.id) {
            let time = new Date().getTime();
            each.customers = each.customers.filter((cust, i) => i !== 0);
            each.checkingTime = time + 1000 * 150;
            each.customerResponded = false;
            each.popUpTime = time + 1000 * 60;
            return each;
          } else {
            return each;
          }
        });

        let date = new Date().toDateString();
        let time = new Date().toLocaleTimeString();
        let serviceWithCharges = customer.service.map((eachServiceName) => {
          return thisDoc
            .data()
            ?.services.find((service) => service.name === eachServiceName);
        });

        let customerPaid = serviceWithCharges.reduce((accumulte, service) => {
          return accumulte + Number(service.charges);
        }, 0);

        let report = {
          custName: customer.name,
          custMobile: customer.mobile,
          providerName: provider.fname + " " + provider.lname,
          date: date,
          time: time,
          services: serviceWithCharges,
          providerId: provider.id,
          customerPaid: customerPaid,
          addedBy: customer.addedBy,
        };

        let salonReportUpdatedArray = [report, ...salon.salonReport];

        transaction.update(docRef, {
          serviceproviders: newprovidersarray,
          salonReport: salonReportUpdatedArray,
        });
      });
    } catch (e) {
      console.error("Something went wrong");
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={doneModal}
      onRequestClose={closeDoneModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>dfoihfdfjdg oghdoifdh ffhdfd fdfdf fdofgdhj</Text>
          <View style={styles.buttonsContainer}>
            <Button
              onPress={() => {
                done();
              }}
              title="save"
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
              onPress={closeDoneModal}
              title="cancel"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DoneModal;

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
