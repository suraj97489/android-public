import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import AndroidContext from "./../context/AndroidContext";
import { Input } from "react-native-elements";
import SpinnerScreen from "../components/SpinnerScreen";

const Report = () => {
  const androidcontext = useContext(AndroidContext);
  let report = androidcontext.salon?.salonReport;
  const [searchTerm, setSearchTerm] = useState("");

  let filteredItems = report?.filter((item) => {
    if (searchTerm === "") {
      return item;
    } else if (item.custName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return item;
    } else if (
      item.providerName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return item;
    } else if (item.date.toLowerCase().includes(searchTerm.toLowerCase())) {
      return item;
    } else if (item.time.toLowerCase().includes(searchTerm.toLowerCase())) {
      return item;
    } else if (
      item.services.some((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return item;
    }
  });
  if (androidcontext.salon?.salonUsername === androidcontext.customer?.email) {
    return (
      <>
        <StatusBar style="auto" />
        <Input
          value={searchTerm}
          placeholder="search..."
          onChangeText={(text) => {
            setSearchTerm(text);
          }}
          containerStyle={styles.input_container}
          style={{ paddingLeft: 10 }}
        />
        <View style={styles.filter_result}>
          {searchTerm.length > 0 ? (
            <>
              <Text style={{ color: "white" }}>
                search result : {filteredItems?.length}
              </Text>
              <Text style={{ color: "white" }}>
                revenue :{" "}
                {filteredItems?.reduce((accumulte, report) => {
                  return accumulte + Number(report.customerPaid);
                }, 0)}
                Rs
              </Text>
            </>
          ) : null}
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item, i) => item.custName + i}
          renderItem={({ item }) => (
            <View style={styles.serviceContainer}>
              <View style={styles.NameMobileContainer}>
                <Text style={styles.CustName}>
                  {item.custName.toUpperCase()}
                </Text>
                <Text style={styles.CustMobile}>{item.custMobile}</Text>
              </View>

              {item.services?.map((service, i) => (
                <View key={i} style={styles.service_Name_And_Charges_Container}>
                  <Text style={styles.textServiceNameAndCharges}>
                    {service.name}
                  </Text>
                  <Text style={styles.textServiceNameAndCharges}>
                    {service.charges + " Rs"}
                  </Text>
                </View>
              ))}

              <View style={styles.Provider_Date_Time_container}>
                <Text>{item.providerName}</Text>
                <Text>{item.date}</Text>
                <Text>{item.time}</Text>
              </View>
            </View>
          )}
        />
      </>
    );
  } else {
    return <SpinnerScreen />;
  }
};

export default Report;

const styles = StyleSheet.create({
  input_container: {
    marginVertical: 15,
    width: "70%",
    alignSelf: "center",
  },
  filter_result: {
    backgroundColor: "black",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 40,
  },
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

    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textServiceNameAndCharges: {
    fontWeight: "bold",
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
