function formatDate(input_datestring) {
    const date = new Date(input_datestring);

    const options = {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate;
}

module.exports = {formatDate};