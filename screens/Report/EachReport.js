import { StyleSheet, Text, View } from "react-native";
import React from "react";

const EachReport = ({ item }) => {
  return (
    <View style={styles.serviceContainer}>
      <View style={styles.NameMobileContainer}>
        <Text style={styles.CustName}>{item.custName.toUpperCase()}</Text>
        <Text style={styles.CustMobile}>{item.custMobile}</Text>
      </View>

      {item.services?.map((service, i) => (
        <View key={i} style={styles.service_Name_And_Charges_Container}>
          <Text style={styles.textServiceNameAndCharges}>{service.name}</Text>
          <Text style={styles.textServiceNameAndCharges}>
            {service.charges + " Rs"}
          </Text>
        </View>
      ))}

      {item.extra !== 0 && item.extra !== undefined ? (
        <View style={styles.service_Name_And_Charges_Container}>
          <Text style={styles.textServiceNameAndCharges}>extra charges</Text>
          <Text style={styles.textServiceNameAndCharges}>
            {item.extra + " Rs"}
          </Text>
        </View>
      ) : null}

      <View style={styles.totalWithCharges}>
        <Text style={styles.bolder}>total</Text>
        <Text style={styles.bolder}>
          {Number(item.customerPaid) + item.extra} Rs
        </Text>
      </View>

      <View style={styles.Provider_Date_Time_container}>
        <Text style={{ maxWidth: "35%" }}>{item.providerName}</Text>
        <Text>{item.date}</Text>
        <Text>{item.time}</Text>
      </View>
    </View>
  );
};

export default EachReport;

const styles = StyleSheet.create({
  serviceContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginVertical: 10,

    borderWidth: 1,
    alignSelf: "center",
  },
  NameMobileContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    width: "100%",
    height: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  CustName: {
    color: "white",
    fontWeight: "bold",
    marginRight: 10,
  },
  CustMobile: {
    color: "white",
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
  Provider_Date_Time_container: {
    // backgroundColor: "green",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
  },
});
