export class ChangeDate {
    static ChangeDateFormat(date) {
        const dateArray = date.value.split('.').reverse();
        return dateArray.join('-');
    }

    static ChangeDateFormatFilter(date) {
        const dateArray = date.split('.').reverse();
        return dateArray.join('-');
    }
}