import * as isMobilePhoneFromValidator from 'validator/lib/isMobilePhone';
import {find} from 'ramda';
import * as Select from 'react-select';

type MobilePhoneLocale = 'ar-DZ' | 'ar-SA' | 'ar-SY' | 'cs-CZ' | 'de-DE' | 'da-DK' | 'el-GR' | 'en-AU' | 'en-GB' | 'en-HK' | 'en-IN' | 'en-NZ' | 'en-US' | 'en-CA' | 'en-ZA' | 'en-ZM' | 'es-ES' | 'fi-FI' | 'fr-FR' | 'hu-HU' | 'it-IT' | 'ja-JP' | 'ms-MY' | 'nb-NO' | 'nn-NO' | 'pl-PL' | 'pt-PT' | 'ru-RU' | 'sr-RS' | 'tr-TR' | 'vi-VN' | 'zh-CN' | 'zh-TW';

export const isNotEmptyInput = (val: Select.Option | string | number) => {
  if (typeof (val as Select.Option).value !== 'undefined') {
    return !!(val as Select.Option).value;
  } else {
    return !!val;
  }
};

export const isNationalInsuranceNumber = (val = '') =>
  val ?
    /^[A-Z]{2}[0-9]{6}(A|B|C|D|F)$/.test(val) :
    true;

export const isPinCode = (val = '') =>
  val ?
    /^[0-9]+$/.test(val) :
    true;

export const isMobilePhone = (val = '') => {
  const locales: MobilePhoneLocale[] = ['ru-RU'];
  const value = val.replace(/(\s|-)/g, '');

  return val ?
    !!find(
      (locale: MobilePhoneLocale) => isMobilePhoneFromValidator(value, locale)
    )(locales) :
    true;
};

export const isMobilePhoneSimpleCheck = (val = '') => {
  return val ?
      /^\+?([-\s]*\d){9,12}$/.test(val) :
      true;
};

export const anyTypeGuard = <T>(dataToCheck: any, condition: (data: any) => boolean): dataToCheck is T => {
  return condition(dataToCheck);
};
