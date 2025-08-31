import Constants from "./constants";
import en from "./../commons/locales/en";
import vi from "./../commons/locales/vn";
import LocalizedStrings from "react-localization";

const Strings = new LocalizedStrings({
    en,
    vi
});

const currentLanguage = JSON.parse(localStorage.getItem(Constants.StorageKeys.LANGUAGE));

Strings.setLanguage((currentLanguage == null || currentLanguage === "" || currentLanguage === undefined) ? Constants.DefaultLanguage : currentLanguage);


export default Strings;
