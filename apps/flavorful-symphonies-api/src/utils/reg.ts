import { escapeRegExp } from 'lodash';
import { z } from 'zod';

export const jwtReg = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
export const idReg = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
export const phoneNumberReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g;

export function reg(str: string, flag: string | undefined = 'i') {
  return new RegExp(escapeRegExp(str), flag);
}

export const objectIdArg = z.string({ description: 'id' }).regex(idReg);
export const phoneNumberZod = z.string().min(8).max(8).regex(phoneNumberReg);
