import { doc, runTransaction } from "firebase/firestore";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";

import { db } from "../../../firebaseAndroid";
import colors from "../../../theme/colors";
import { useSelector, useDispatch } from "react-redux";
import { updateSalon } from "../../../features/salon/salonSlice";

const ServicesSection = () => {
  const salon = useSelector((state) => state.salon.salon);
  const dispatch = useDispatch();
  const [serviceIndex, setServiceIndex] = useState();
  const [updatedService, setUpdatedService] = useState({
    name: "",
    charges: "",
  });
  const [addingService, setAddingService] = useState(false);

  function ClickedOnEdit(i, service) {
    let totalCustomers = salon.serviceproviders
      .map((eachpro) => eachpro.customers.map((cust) => cust))
      .flat();

    if (totalCustomers.length > 0) {
      alert(
        "sorry!you can add,edit or delete services when there is not customer"
      );
    } else {
      setAddingService(false);
      setServiceIndex(i);
      setUpdatedService({ name: service.name, charges: service.charges });
    }
  }
  async function ClickedOnDeleteService(i) {
    setAddingService(false);
    const docRef = doc(db, "salon", salon.id);
    try {
      function deleteServiceFunc(salonValue) {
        return salonValue.services.filter((eachService, index) => index !== i);
      }
      function totalCustomersFunc(salonValue) {
        return salonValue.serviceproviders
          .map((eachpro) => eachpro.customers.map((cust) => cust))
          .flat();
      }

      let SalonAllCustomers = totalCustomersFunc(salon);

      if (SalonAllCustomers.length > 0) {
        alert(
          "sorry!you can add, edit or delete services when there is not customer"
        );
        return;
      } else {
        const payLoad = { ...salon, services: deleteServiceFunc(salon) };
        dispatch(updateSalon(payLoad));
      }

      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "document does not exist";
        }
        let newServicesarr = deleteServiceFunc(thisDoc.data());
        let totalCustomers = totalCustomersFunc(thisDoc.data());
        if (totalCustomers.length > 0) {
          alert(
            "sorry!you can add, edit or delete services when there is not customer"
          );
        } else {
          transaction.update(docRef, { services: newServicesarr });
        }
      });
    } catch (e) {
      console.error("something went wrong");
    }
  }
  function ClickedOnAddService() {
    let totalCustomers = salon.serviceproviders
      .map((eachpro) => eachpro.customers.map((cust) => cust))
      .flat();

    if (totalCustomers.length > 0) {
      alert(
        "sorry!you can add,edit or delete services when there is not customer"
      );
    } else {
      setAddingService(true);
      const payLoad = {
        ...salon,
        services: [...salon.services, { name: "", charges: "" }],
      };
      dispatch(updateSalon(payLoad));

      setServiceIndex(salon.services.length);
      setUpdatedService({ name: "", charges: "" });
    }
  }
  async function ClickedOnSaveService(i, service) {
    setAddingService(false);
    const docRef = doc(db, "salon", salon.id);
    function serviceArrUpdateFunc(salonValue) {
      return salonValue.services.map((service, index) => {
        if (index === i) {
          return updatedService;
        } else {
          return service;
        }
      });
    }
    const payLoad = { ...salon, services: serviceArrUpdateFunc(salon) };
    dispatch(updateSalon(payLoad));
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "doc does not exist";
        }
        let newServicesArray = serviceArrUpdateFunc(thisDoc.data());

        transaction.update(docRef, { services: newServicesArray });
      });
      setServiceIndex(null);
    } catch (e) {
      console.error("something went wrong");
    }
  }
  function ClickedOnCancelUpdating() {
    setServiceIndex(null);
    let serviceIndex = salon.services.length - 1;
    if (addingService) {
      let newArr = salon.services.filter((service, i) => i !== serviceIndex);
      let payLoad = { ...salon, services: newArr };
      dispatch(updateSalon(payLoad));
      setAddingService(false);
    }
  }
  return (
    <View style={styles.ServicesSection}>
      {salon?.services.map((service, i) => (
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
        // <Button
        //   containerStyle={{ margin: 25, borderRadius: 50 }}
        //   onPress={ClickedOnAddService}
        //   buttonStyle={{ borderRadius: 20 }}
        //   titleStyle={{ color: "white" }}
        //   title="ADD SERVICE"
        // />
        <Pressable style={styles.addService} onPress={ClickedOnAddService}>
          <Text style={{ fontWeight: "bold" }}>ADD SERVICE</Text>
        </Pressable>
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
  addService: {
    borderRadius: 10,
    margin: 10,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    padding: 9,
  },
});
