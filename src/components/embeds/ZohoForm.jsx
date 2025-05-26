import axios from "axios";
const ZohoForm = () => {
  // $Id: $
  function zf_ValidateAndSubmit() {
    if (zf_CheckMandatory()) {
      if (zf_ValidCheck()) {
        if (isSalesIQIntegrationEnabled) {
          zf_addDataToSalesIQ();
        }
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  function zf_CheckMandatory() {
    for (let i = 0; i < zf_MandArray.length; i++) {
      var fieldObj = document.forms.form[zf_MandArray[i]];
      if (fieldObj) {
        if (fieldObj.nodeName != null) {
          if (fieldObj.nodeName == "OBJECT") {
            if (!zf_MandatoryCheckSignature(fieldObj)) {
              zf_ShowErrorMsg(zf_MandArray[i]);
              return false;
            }
          } else if (fieldObj.value.replace(/^\s+|\s+$/g, "").length == 0) {
            if (fieldObj.type == "file") {
              fieldObj.focus();
              zf_ShowErrorMsg(zf_MandArray[i]);
              return false;
            }
            fieldObj.focus();
            zf_ShowErrorMsg(zf_MandArray[i]);
            return false;
          } else if (fieldObj.nodeName == "SELECT") {
            // No I18N
            if (fieldObj.options[fieldObj.selectedIndex].value == "-Select-") {
              fieldObj.focus();
              zf_ShowErrorMsg(zf_MandArray[i]);
              return false;
            }
          } else if (fieldObj.type == "checkbox" || fieldObj.type == "radio") {
            if (fieldObj.checked == false) {
              fieldObj.focus();
              zf_ShowErrorMsg(zf_MandArray[i]);
              return false;
            }
          }
        } else {
          var checkedValsCount = 0;
          var inpChoiceElems = fieldObj;
          for (var ii = 0; ii < inpChoiceElems.length; ii++) {
            if (inpChoiceElems[ii].checked === true) {
              checkedValsCount++;
            }
          }
          if (checkedValsCount == 0) {
            inpChoiceElems[0].focus();
            zf_ShowErrorMsg(zf_MandArray[i]);
            return false;
          }
        }
      }
    }
    return true;
  }
  function zf_ValidCheck() {
    var isValid = true;
    for (let ind = 0; ind < zf_FieldArray.length; ind++) {
      var fieldObj = document.forms.form[zf_FieldArray[ind]];
      if (fieldObj) {
        if (fieldObj.nodeName != null) {
          var checkType = fieldObj.getAttribute("checktype");
          if (checkType == "c2") {
            // No I18N
            if (!zf_ValidateNumber(fieldObj)) {
              isValid = false;
              fieldObj.focus();
              zf_ShowErrorMsg(zf_FieldArray[ind]);
              return false;
            }
          } else if (checkType == "c3") {
            // No I18N
            if (
              !zf_ValidateCurrency(fieldObj) ||
              !zf_ValidateDecimalLength(fieldObj, 10)
            ) {
              isValid = false;
              fieldObj.focus();
              zf_ShowErrorMsg(zf_FieldArray[ind]);
              return false;
            }
          } else if (checkType == "c4") {
            // No I18N
            if (!zf_ValidateDateFormat(fieldObj)) {
              isValid = false;
              fieldObj.focus();
              zf_ShowErrorMsg(zf_FieldArray[ind]);
              return false;
            }
          } else if (checkType == "c5") {
            // No I18N
            if (!zf_ValidateEmailID(fieldObj)) {
              isValid = false;
              fieldObj.focus();
              zf_ShowErrorMsg(zf_FieldArray[ind]);
              return false;
            }
          } else if (checkType == "c6") {
            // No I18N
            if (!zf_ValidateLiveUrl(fieldObj)) {
              isValid = false;
              fieldObj.focus();
              zf_ShowErrorMsg(zf_FieldArray[ind]);
              return false;
            }
          } else if (checkType == "c7") {
            // No I18N
            if (!zf_ValidatePhone(fieldObj)) {
              isValid = false;
              fieldObj.focus();
              zf_ShowErrorMsg(zf_FieldArray[ind]);
              return false;
            }
          } else if (checkType == "c8") {
            // No I18N
            zf_ValidateSignature(fieldObj);
          }
        }
      }
    }
    return isValid;
  }
  function zf_ShowErrorMsg(uniqName) {
    var fldLinkName;
    for (let errInd = 0; errInd < zf_FieldArray.length; errInd++) {
      fldLinkName = zf_FieldArray[errInd].split("_")[0];
      document.getElementById(fldLinkName + "_error").style.display = "none";
    }
    var linkName = uniqName.split("_")[0];
    document.getElementById(linkName + "_error").style.display = "block";
  }
  function zf_ValidateNumber(elem) {
    var validChars = "-0123456789";
    var numValue = elem.value.replace(/^\s+|\s+$/g, "");
    if (numValue != null && !numValue == "") {
      var strChar;
      var result = true;
      if (numValue.charAt(0) == "-" && numValue.length == 1) {
        return false;
      }
      for (let i = 0; i < numValue.length && result == true; i++) {
        strChar = numValue.charAt(i);
        if (strChar == "-" && i != 0) {
          return false;
        }
        if (validChars.indexOf(strChar) == -1) {
          result = false;
        }
      }
      return result;
    } else {
      return true;
    }
  }
  function zf_ValidateDateFormat(inpElem) {
    var dateValue = inpElem.value.replace(/^\s+|\s+$/g, "");
    if (dateValue == "") {
      return true;
    } else {
      return zf_DateRegex.test(dateValue);
    }
  }
  function zf_ValidateCurrency(elem) {
    var validChars = "0123456789.";
    var numValue = elem.value.replace(/^\s+|\s+$/g, "");
    if (numValue.charAt(0) == "-") {
      numValue = numValue.substring(1, numValue.length);
    }
    if (numValue != null && !numValue == "") {
      var strChar;
      var result = true;
      for (let i = 0; i < numValue.length && result == true; i++) {
        strChar = numValue.charAt(i);
        if (validChars.indexOf(strChar) == -1) {
          result = false;
        }
      }
      return result;
    } else {
      return true;
    }
  }
  function zf_ValidateDecimalLength(elem, decimalLen) {
    var numValue = elem.value;
    if (numValue.indexOf(".") >= 0) {
      var decimalLength = numValue.substring(numValue.indexOf(".") + 1).length;
      if (decimalLength > decimalLen) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
  function zf_ValidateEmailID(elem) {
    var check = 0;
    var emailValue = elem.value;
    if (emailValue != null && !emailValue == "") {
      var emailArray = emailValue.split(",");
      for (let i = 0; i < emailArray.length; i++) {
        var emailExp =
          /^[\w]([\w\-.+&'/]*)@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,22}$/;
        if (!emailExp.test(emailArray[i].replace(/^\s+|\s+$/g, ""))) {
          check = 1;
        }
      }
      if (check == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  function zf_ValidateLiveUrl(elem) {
    var urlValue = elem.value;
    if (urlValue !== null && typeof urlValue !== "undefined") {
      urlValue = urlValue.replace(/^\s+|\s+$/g, "");
      if (urlValue !== "") {
        var urlregex = new RegExp(
          "^((((h|H)(t|T)|(f|F))(t|T)(p|P)((s|S)?)://[-.\\w]*)|(((w|W){3}\\.)[-.\\w]+)|((\\w+)([-\\w]*)(\\.([-\\w]+))+))(/?)([-\\w.?,:'/\\\\+=&;%$#@()!~]*)?$"
        ); // Same regex as website_field_url in security-regex.xml. But single backslash is replaced with two backslashes.
        return urlregex.test(urlValue);
      }
    }
    return true;
  }
  function zf_ValidatePhone(inpElem) {
    var ZFPhoneRegex = {
      PHONE_INTE_ALL_REG: /^[+]{0,1}[()0-9-. ]+$/,
      PHONE_INTE_NUMERIC_REG: /^[0-9]+$/,
      PHONE_INTE_CONT_CODE_ENABLED_REG: /^[(0-9-.][()0-9-. ]*$/,
      PHONE_USA_REG: /^[0-9]+$/,
      PHONE_CONT_CODE_REG: /^[+][0-9]{1,4}$/,
    };
    var phoneFormat = parseInt(inpElem.getAttribute("phoneFormat"));
    var fieldInpVal = inpElem.value.replace(/^\s+|\s+$/g, "");
    var toReturn = true;
    if (phoneFormat === 1) {
      if (inpElem.getAttribute("valType") == "code") {
        var codeRexp = ZFPhoneRegex.PHONE_CONT_CODE_REG;
        if (fieldInpVal != "" && !codeRexp.test(fieldInpVal)) {
          return false;
        }
      } else {
        var IRexp = ZFPhoneRegex.PHONE_INTE_ALL_REG;
        if (inpElem.getAttribute("phoneFormatType") == "2") {
          IRexp = ZFPhoneRegex.PHONE_INTE_NUMERIC_REG;
        }
        if (fieldInpVal != "" && !IRexp.test(fieldInpVal)) {
          toReturn = false;
          return toReturn;
        }
      }
      return toReturn;
    } else if (phoneFormat === 2) {
      var InpMaxlength = inpElem.getAttribute("maxLength");
      var USARexp = ZFPhoneRegex.PHONE_USA_REG;
      if (
        fieldInpVal != "" &&
        USARexp.test(fieldInpVal) &&
        fieldInpVal.length == InpMaxlength
      ) {
        toReturn = true;
      } else if (fieldInpVal == "") {
        toReturn = true;
      } else {
        toReturn = false;
      }
      return toReturn;
    }
  }

  function zf_ValidateSignature(objElem) {
    var linkName = objElem.getAttribute("compname");
    var canvasElem = document.getElementById("drawingCanvas-" + linkName);
    var isValidSign = zf_IsSignaturePresent(objElem, linkName, canvasElem);
    var hiddenSignInputElem = document.getElementById(
      "hiddenSignInput-" + linkName
    );
    if (isValidSign) {
      hiddenSignInputElem.value = canvasElem.toDataURL();
    } else {
      hiddenSignInputElem.value = ""; // No I18N
    }
    return isValidSign;
  }

  function zf_MandatoryCheckSignature(objElem) {
    var linkName = objElem.getAttribute("compname");
    var canvasElem = document.getElementById("drawingCanvas-" + linkName);
    var isValid = zf_IsSignaturePresent(objElem, linkName, canvasElem);
    return isValid;
  }

  function zf_IsSignaturePresent(objElem, linkName, canvasElem) {
    var context = canvasElem.getContext("2d"); // No I18N
    var canvasWidth = canvasElem.width;
    var canvasHeight = canvasElem.height;
    var canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    var signLen = canvasData.data.length;
    var flag = false;
    for (var index = 0; index < signLen; index++) {
      if (!canvasData.data[index]) {
        flag = false;
      } else if (canvasData.data[index]) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  function zf_FocusNext(elem, event) {
    if (event.keyCode == 9 || event.keyCode == 16) {
      return;
    }
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      return;
    }
    var compname = elem.getAttribute("compname");
    var inpElemName = elem.getAttribute("name");
    if (inpElemName == compname + "_countrycode") {
      if (elem.value.length == 3) {
        document.getElementsByName(compname + "_first")[0].focus();
      }
    } else if (inpElemName == compname + "_first") {
      if (elem.value.length == 3) {
        document.getElementsByName(compname + "_second")[0].focus();
      }
    }
  }

  var zf_DateRegex = new RegExp(
    "^(([0][1-9])|([1-2][0-9])|([3][0-1]))[-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-](?:(?:19|20)[0-9]{2})$"
  );
  var zf_MandArray = ["Email"];
  var zf_FieldArray = ["Email"];
  var isSalesIQIntegrationEnabled = false;
  var salesIQFieldsArray = [];

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await axios.post(
        "https://forms.zohopublic.com/christopheralesan/form/EmailSubscription/formperma/iIziGVIiJbQ62fwYBrMgFDq_A4WLSmZevQ8XYs8MzyE/htmlRecords/submit",
        formData
      );

      console.log({ response });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        acceptCharset="UTF-8"
        encType="multipart/form-data"
        id="form"
      >
        <input type="hidden" name="zf_referrer_name" defaultValue="" />
        {/* <!-- To Track referrals , place the referrer name within the " " in the above hidden input field --> */}
        <input type="hidden" name="zf_redirect_url" defaultValue="" />
        {/* <!-- To redirect to a specific page after record submission , place the respective url within the " " in the above hidden input field --> */}
        <input type="hidden" name="zc_gad" defaultValue="" />
        {/* <!-- If GCLID is enabled in Zoho CRM Integration, click details of AdWords Ads will be pushed to Zoho CRM --> */}
        <div className="flex flex-col gap-[16px] ">
          {/* <!---------template Header Starts Here----------> */}
          <h2 className="text-lg lg:text-2xl text-semibold text-white">
            Subscribete al newsletter
          </h2>
          {/* <!---------template Header Ends Here----------> */}
          {/* <!---------template Container Starts Here----------> */}
          <div>
            <div className="flex-col md:flex-row flex w-full md:overflow-hidden rounded-[8px] gap-[16px]">
              <input
                fieldtype={9}
                type="text"
                maxLength="255"
                name="Email"
                checktype="c5"
                defaultValue=""
                placeholder="Email"
                className="h-[36px] w-full rounded-[8px] md:rounded-0 px-[12px]"
              />

              <button className="zf-submitColor h-[36px] px-[16px] bg-red-500 text-white text-base font-semibold rounded-[8px] md:rounded-0 w-full md:w-auto">
                Subscribirse
              </button>
            </div>

            <p
              id="Email_error"
              className="zf-errorMessage text-red-500"
              style={{ display: "none" }}
            >
              Correo invalido
            </p>
          </div>

          <small className="text-sm text-slate-300">
            La mejor manera de enterarse de que se está cocinando o cualquier
            novedad relacionada a este proyecto. No hay marketing ni
            promociones, asi que tranquil@, no tendrás spam.
          </small>
        </div>
      </form>
    </>
  );
};

export default ZohoForm;
