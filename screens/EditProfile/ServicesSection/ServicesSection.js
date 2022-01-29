import { doc, runTransaction } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";

import SalonContext from "../../../context/SalonContext";
import { db } from "../../../firebaseAndroid";
import colors from "../../../theme/colors";

const ServicesSection = () => {
  const saloncontext = useContext(SalonContext);
  const [serviceIndex, setServiceIndex] = useState();
  const [updatedService, setUpdatedService] = useState({
    name: "",
    charges: "",
  });
  const [addingService, setAddingService] = useState(false);

  function ClickedOnEdit(i, service) {
    setAddingService(false);
    setServiceIndex(i);
    setUpdatedService({ name: service.name, charges: service.charges });
  }
  async function ClickedOnDeleteService(i) {
    setAddingService(false);
    const docRef = doc(db, "salon", saloncontext.salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "document does not exist";
        }
        let newServicesarr = thisDoc
          .data()
          .services.filter((service, index) => index !== i);

        transaction.update(docRef, { services: newServicesarr });
      });
    } catch (e) {
      console.error("something went wrong");
    }
  }
  function ClickedOnAddService() {
    setAddingService(true);
    saloncontext.setSalon((salon) => {
      return {
        ...salon,
        services: [...salon.services, { name: "", charges: "" }],
      };
    });

    setServiceIndex(saloncontext.salon.services.length);
    setUpdatedService({ name: "", charges: "" });
  }
  async function ClickedOnSaveService(i, service) {
    setAddingService(false);
    const docRef = doc(db, "salon", saloncontext.salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "doc does not exist";
        }
        let newServicesArray = saloncontext.salon.services.map(
          (service, index) => {
            if (index === i) {
              return updatedService;
            } else {
              return service;
            }
          }
        );
        transaction.update(docRef, { services: newServicesArray });
      });
      setServiceIndex(null);
    } catch (e) {
      console.error("something went wrong");
    }
  }
  function ClickedOnCancelUpdating() {
    setServiceIndex(null);
    if (addingService) {
      saloncontext.salon.services.pop();
      setAddingService(false);
    }
  }
  return (
    <View style={styles.ServicesSection}>
      {saloncontext.salon?.services.map((service, i) => (
        <View
          key={i}
          style={[
            styles.serviceContainer,
            { borderBottomColor: colors.secondary },
          ]}
        >
          <View style={styles.nameAndChargesContainer}>
            {serviceIndex === i ? (
              <>
                <Input
                  autoFocus
                  onChangeText={(text) => {
                    setUpdatedService({ ...updatedService, name: text });
                  }}
                  containerStyle={{ width: "70%" }}
                  style={{ color: "white" }}
                  value={updatedService.name}
                />
                <Input
                  onChangeText={(text) => {
                    setUpdatedService({
                      ...updatedService,
                      charges: isNaN(Number(text))
                        ? updatedService.charges
                        : text,
                    });
                  }}
                  keyboardType="number-pad"
                  containerStyle={{ width: "25%" }}
                  style={{ color: "white" }}
                  value={updatedService.charges}
                />
              </>
            ) : (
              <>
                <Text style={styles.serviceName}>{service?.name}</Text>
                <Text style={styles.serviceCharges}>{service?.charges}Rs</Text>
              </>
            )}
          </View>
          <View style={styles.buttonsContainer}>
            {serviceIndex === i ? (
              <>
                {updatedService.name !== "" &&
                  updatedService.charges !== "" && (
                    <Button
                      containerStyle={[styles.buttons]}
                      onPress={() => ClickedOnSaveService(i, service)}
                      title="save"
                      buttonStyle={{ padding: 0 }}
                    />
                  )}
                <Button
                  onPress={ClickedOnCancelUpdating}
                  containerStyle={[styles.buttons, { opacity: 0.8 }]}
                  title="cancel"
                  buttonStyle={{ backgroundColor: "white", padding: 0 }}
                  titleStyle={{ color: "black" }}
                />
              </>
            ) : (
              <>
                {!addingService && (
                  <>
                    <Button
                      containerStyle={[styles.buttons]}
                      onPress={() => ClickedOnEdit(i, service)}
                      title="edit"
                      buttonStyle={{ padding: 0 }}
                    />
                    <Button
                      onPress={() => ClickedOnDeleteService(i)}
                      containerStyle={[styles.buttons, { opacity: 0.8 }]}
                      title="delete"
                      buttonStyle={{
                        backgroundColor: "white",
                        padding: 0,
                      }}
                      titleStyle={{ color: "black" }}
                    />
                  </>
                )}
              </>
            )}
          </View>
        </View>
      ))}

      {!addingService && (
        <Button
          containerStyle={{ margin: 25, borderRadius: 50 }}
          onPress={ClickedOnAddService}
          buttonStyle={{ borderRadius: 20 }}
          titleStyle={{ color: "white" }}
          title="ADD SERVICE"
        />
      )}
    </View>
  );
};

export default ServicesSection;

const styles = StyleSheet.create({
  ServicesSection: { backgroundColor: "black" },
  serviceContainer: {
    backgroundColor: "black",
    borderBottomColor: "white",
    borderWidth: 0.5,
    padding: 10,
    paddingVertical: 20,
    marginHorizontal: 10,
  },
  nameAndChargesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  serviceName: {
    color: "white",
    // backgroundColor: "blue",
    maxWidth: "80%",
  },
  serviceCharges: { color: "white" },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    // backgroundColor: "yellow",
  },
  buttons: { width: 100, margin: 10 },
});
