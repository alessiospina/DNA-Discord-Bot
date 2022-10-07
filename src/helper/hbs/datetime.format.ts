/* eslint-disable prettier/prettier */
import moment from "moment";

export function dateFormat(date, format) {
    const mmnt = moment(date);
    return mmnt.format(format);
}