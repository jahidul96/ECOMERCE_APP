import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Color } from "../../COLORS/Colors";
import { Input, Lodder } from "../../components/Reuse/Reuseable";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HEIGHT, WIDTH } from "../../utils/Dimension";
import { SliderCarousel } from "../../components/SliderCarousel";
import ProductCategorie from "../../components/ProductCategorie";
import Products from "../../components/Products";
import UseFetch from "../../api/useFetch";
import { ApiPoint } from "../../api/endPoint";
import TopSearchComp from "../../components/Reuse/TopSearchComp";
import { getUserFromAsync } from "../../utils/LocalStorage";
import { UserContext } from "../../context/UserContext";

const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const { loading, err, data } = UseFetch(`${ApiPoint}/product`);

  const goToCategories = (value) => {
    navigation.navigate("Categories", { value });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // do something
      getUserFromAsync()
        .then((data) => {
          // console.log("asyncstorage data", data);
          setUser(data);
        })
        .catch((err) => err);
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar barStyle={"light-content"} backgroundColor={Color.RED} />
      <TopSearchComp
        noBack={true}
        extraInputStyle={styles.extraInputStyle}
        name="person-circle"
        color={Color.WHITE}
      />

      <ScrollView style={styles.root}>
        <SliderCarousel />
        <ProductCategorie onPress={goToCategories} />
        <View style={styles.productWrapper}>
          <Text style={styles.titleText}>Featured Product's</Text>
          {loading ? (
            <Lodder />
          ) : err ? (
            <View style={styles.errorStyle}>
              <Text>Something went wrong!</Text>
              <Text>{err?.message}</Text>
            </View>
          ) : (
            <Products ProductsData={data?.products} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.GRAY,
  },
  topInputWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: WIDTH,
    paddingHorizontal: 15,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 999,
  },
  extraInputStyle: {
    width: "85%",
  },
  imageStyle: {
    flex: 1,
  },
  productWrapper: {
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 8,
  },
  loadingContainer: {
    marginTop: 30,
  },
  errorStyle: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
