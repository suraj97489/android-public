import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Input } from "react-native-elements";
import SpinnerScreen from "../../components/SpinnerScreen";

import { useSelector } from "react-redux";
import EachReport from "./EachReport";

const Report = () => {
  const salon = useSelector((state) => state.salon.salon);
  const customer = useSelector((state) => state.customer.customer);

  let report = salon?.salonReport;
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
  if (salon?.salonUsername === customer?.email) {
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
          renderItem={({ item }) => <EachReport item={item} />}
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
});
