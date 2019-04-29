import { StyleSheet } from "react-native";

primaryColor = "#C1464E"

export default (styles = StyleSheet.create({
  backgroundTheme: {
    //backgroundColor: "#e4e3eb",
    backgroundColor:"#ffffff",
    color: "#000"
  },
  primaryColor: {
    backgroundColor: primaryColor
  },
  darkenedPrimaryColor: {
    backgroundColor: "#943036"
  },
  primaryColorImageTint: {
    tintColor: primaryColor
  },
  primaryBorderColor: {
    borderColor: primaryColor
  },
  primaryColorText: {
    color: primaryColor
  }
}));
