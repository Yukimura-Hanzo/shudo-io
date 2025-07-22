//? ICON LIB
import { Calendar1Icon } from "lucide-react";
//? UI COMPONENTS
import FormattedDate from "./date";

export default function DateCard() {
  return (
    <div className="date-card-container border-3 m-4">
      <div className="date-card-content p-4">
        <div className="flex">
          <Calendar1Icon />
          <span className="mx-2"><FormattedDate /></span>
        </div>
      </div>
    </div>
  );
}