function formatDate(input_datestring) {
    const date = new Date(input_datestring);
    const now = new Date();

    const oneDay = 1000 * 60 * 60 * 24;
    const differenceInDays = Math.floor((now - date) / oneDay);

    const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }

    if (differenceInDays == 0) {

    } else if (differenceInDays > 0 && differenceInDays <= 7) {
        options.weekday = 'short';
    } else {
        options.day = 'numeric';
        options.month = 'short',
        options.year = 'numeric';
    }

    let formattedDate = date.toLocaleString('en-US', options);

    if (formattedDate.length > 12) {
        formattedDate = formattedDate.replace(",", "");
    }
    
    return formattedDate;
}

module.exports = { formatDate };