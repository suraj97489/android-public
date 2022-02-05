import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDoneModal } from "../features/androidSlice";
import { Button } from "react-native-elements/dist/buttons/Button";
import colors from "../theme/colors";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../firebaseAndroid";
import { Input } from "react-native-elements";

const DoneModal = () => {
  const dispatch = useDispatch();
  const salon = useSelector((state) => state.salon.salon);
  const doneModal = useSelector((state) => state.android.doneModal);
  const provider = useSelector((state) => state.android.activeProvider);
  const customer = useSelector((state) => state.android.activeCustomer);
  const [extra, setExtra] = useState("");
  const [lessCharges, setLessCharges] = useState("");

  let serviceWithCharges = customer?.service.map((eachServiceName) => {
    return salon?.services.find((service) => service.name === eachServiceName);
  });

  let customerPaid = serviceWithCharges?.reduce((accumulte, service) => {
    return accumulte + Number(service.charges);
  }, 0);

  function closeDoneModal() {
    dispatch(updateDoneModal(false));
    setExtra("");
    setLessCharges("");
  }

  async function done() {
    const docRef = doc(db, "salon", salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }

        let newprovidersarray = salon.serviceproviders.map((each) => {
          if (each.id === provider.id) {
            let time = new Date().getTime();
            let customers = each.customers.filter((cust, i) => i !== 0);
            let checkingTime = time + 1000 * 150;
            let customerResponded = false;
            let popUpTime = time + 1000 * 60;
            return {
              ...each,
              customers,
              checkingTime,
              customerResponded,
              popUpTime,
            };
          } else {
            return each;
          }
        });

        let date = new Date().toDateString();
        let time = new Date().toLocaleTimeString();

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
          extra: extra === "" ? 0 : Number(extra),
          lessCharges: lessCharges === "" ? 0 : Number(lessCharges),
        };

        let salonReportUpdatedArray = [report, ...salon.salonReport];

        transaction.update(docRef, {
          serviceproviders: newprovidersarray,
          salonReport: salonReportUpdatedArray,
        });
      });
      setExtra("");
      setLessCharges("");
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
          {serviceWithCharges?.map((service, i) => (
            <View key={i} style={styles.service_Name_And_Charges_Container}>
              <Text style={styles.textServiceNameAndCharges}>
                {service.name}
              </Text>
              <Text style={styles.textServiceNameAndCharges}>
                {service.charges + " Rs"}
              </Text>
            </View>
          ))}

          <View style={styles.service_Name_And_Charges_Container}>
            <Text style={styles.textServiceNameAndCharges}>
              extra charges(optional)
            </Text>
            <Input
              value={extra}
              onChangeText={(text) => {
                let number = Number(text);
                let boolean = isNaN(number);
                if (!boolean) {
                  let removedSpaces = text.replace(/ /g, "");
                  setExtra(removedSpaces);
                }
              }}
              style={{ width: "30%", paddingLeft: 5 }}
              containerStyle={{ width: "30%" }}
            />
          </View>
          <View style={styles.service_Name_And_Charges_Container}>
            <Text style={styles.textServiceNameAndCharges}>
              less charges(optional)
            </Text>
            <Input
              value={lessCharges}
              onChangeText={(text) => {
                let number = Number(text);
                let boolean = isNaN(number);
                if (!boolean) {
                  let removedSpaces = text.replace(/ /g, "");
                  setLessCharges(removedSpaces);
                }
              }}
              style={{ width: "30%", paddingLeft: 5 }}
              containerStyle={{ width: "30%" }}
            />
          </View>

          <View style={styles.totalWithCharges}>
            <Text style={styles.bolder}>total</Text>
            <Text style={styles.bolder}>
              {" "}
              {Number(customerPaid) + Number(extra) - Number(lessCharges)}
              Rs
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              onPress={() => {
                done();
                dispatch(updateDoneModal(false));
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
  service_Name_And_Charges_Container: {
    flexDirection: "row",
    width: "100%",
    // borderWidth: 1,
    // borderColor: "red",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textServiceNameAndCharges: {
    fontWeight: "bold",
  },
  totalWithCharges: {
    flexDirection: "row",
    width: "95%",
    justifyContent: "space-between",
    padding: 10,
    borderTopColor: "black",
    borderTopWidth: 2,
  },
  bolder: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
