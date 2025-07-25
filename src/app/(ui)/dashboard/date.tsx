const FormattedDate = ({ date }: { date?: Date }) => {

  //* Use provided date or current date
  const targetDate = date ?? new Date();

  const formatted = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(targetDate);

  //* Add a comma after the weekday & month
  const [weekday, day, month, year] = formatted.replace(",", "").split(" ");

  return (
    <time dateTime={targetDate.toISOString()}>
      {`${weekday}, ${day} ${month}, ${year}`}
    </time>
  ); 
}

export default FormattedDate;
