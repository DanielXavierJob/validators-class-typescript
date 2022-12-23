interface IValidates {
  validator: any;
  messages?: any;
  errorProvider?: (error: string) => any;
}

export class Validators {
  /**
   * function of call the validators
   * @param data
   * @param validates
   */
  validate(data: Array<{}>, validates: IValidates) {
    let valids: any = [];
    for (var i = 0; i < data.length; i++) {
      const info: any = data[i];
      const validated = this.valideOneInfo(
        info,
        validates.validator,
        validates.messages ? validates.messages : []
      );
      valids.push(...validated);
    }
    this.valideSendErrors(valids, validates.errorProvider);
  }
  /**
   * Function responsible for showing the error message in a toast
   * @param errors_list
   */
  valideSendErrors(errors_list: any, errorProvider?: any) {
    for (var msgs = 0; msgs < errors_list.length; msgs++) {
      const error = errors_list[msgs].message;
      if(errorProvider){
        errorProvider(error);
      }else{
        alert(error) //default
      }
    }
  }
  /**
   * Function responsible for validate one by one data
   * @param value 
   * @param validator 
   * @param messages 
   * @returns 
   */
  valideOneInfo(value: any, validator: any, messages = []) {
    let valids: any = [];
    for (var i = 0; i < Object.keys(value).length; i++) {
      const name = Object.keys(value)[i];
      const val = value[name];
      if (validator[name]) {
        const validated = this.valideOneValidator(
          val,
          validator[name],
          name,
          messages
        );
        valids.push(...validated);
      }
    }
    return valids;
  }
  /**
   * Function responsible by validate the field and set message error
   * @param value 
   * @param validator 
   * @param name 
   * @param messages 
   * @returns 
   */
  valideOneValidator(value: any, validator: any, name: any, messages = []) {
    let validators: any = [];
    if (Array.isArray(validator)) {
      for (var i = 0; i < validator.length; i++) {
        const valid = validator[i];
        if (this.valide(value, valid) == false) {
          let msg = "";
          if (messages.length != 0 && messages[name] != null) {
            if (messages[name][valid] != null) {
              msg = this.valideReplaceMessages(
                name,
                value,
                messages[name][valid]
              );
            } else {
              msg = this.valideMessages(name, valid);
            }
          } else {
            msg = this.valideMessages(name, valid);
          }
          validators.push({
            type: valid,
            name,
            message: msg,
          });
        }
      }
    } else {
      if (this.valide(value, validator) == false) {
        let msg = "";
        if (messages.length != 0 && messages[name] != null) {
          if (Array.isArray(messages[name])) {
            if (messages[name][validator] != null) {
              msg = this.valideReplaceMessages(
                name,
                value,
                messages[name][validator]
              );
            } else {
              msg = this.valideMessages(name, validator);
            }
          } else {
            msg = this.valideReplaceMessages(name, value, messages[name]);
          }
        } else {
          msg = this.valideMessages(name, validator);
        }
        validators.push({
          type: validator,
          name,
          message: msg,
        });
      }
    }
    return validators;
  }

  /**
   * This a validator, actually accept the required,number,string,array,object, and others validators...
   * @param value
   * @param type
   * @returns
   */
  valide(value: any, type: string) {
    if (type.includes("N>")) {
      const val_comparator = Number(type.split("N>")[1]);
      return typeof value == "number"
        ? value > val_comparator
        : typeof value == "string"
        ? value.length > val_comparator
        : false;
    } else if (type.includes("N<")) {
      const val_comparator = type.split("N<")[1];
      return value < val_comparator;
    } else if (type == "required") {
      return value != null;
    } else if (type == "number") {
      return typeof value == "number";
    } else if (type == "string") {
      return typeof value == "string";
    } else if (type == "array") {
      return Array.isArray(value);
    } else if (type == "object") {
      return value instanceof Object;
    }
    return false;
  }

  /**
   * Here replace string of messages if contains the keys
   * @param name
   * @param value
   * @param message
   * @returns
   */
  valideReplaceMessages(name: string, value: any, message: any) {
    if (message.includes("{name}")) {
      message = message.replaceAll("{name}", name);
    }
    if (message.includes("{value}")) {
      message = message.replaceAll("{value}", value);
    }
    return message;
  } 
  /**
   * Contains the errors strings defaults
   * @param name
   * @param type
   * @returns
   */
  valideMessages(name: string, type: string) {
    switch (type) {
      case "number":
        return `This value of field ${name} must be a number`;
      case "string":
        return `This value of field ${name} must be a string`;
      case "required":
        return `This value of field ${name} is required`;
      case "array":
        return `This value of field ${name} must be a Array`;
      case "object":
        return `This value of field ${name} must be a Object`;
      default:
        if (type.includes("N<")) {
          const val = type.split("N<")[1];
          return `This value of field ${name} needs must be less than ${val}`;
        } else if (type.includes("N>")) {
          const val = type.split("N>")[1];
          return `This value of field ${name} needs to be greater than ${val}`;
        } else {
          return `This type of field ${name} is not defined in class Validator, please insert in the arg Messages the text of error`;
        }
    }
  }
}
