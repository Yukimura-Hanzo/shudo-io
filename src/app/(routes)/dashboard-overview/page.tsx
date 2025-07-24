//? UI COMPONENTS
import DateCard from "@/app/(ui)/dashboard/date-card";
import ProfileCard from "@/app/(ui)/dashboard/profile-card";
import TodosCard from "@/app/(ui)/dashboard/todo/todos-card";

export default function DashboardOverview() {
  return (
    <>
      <ProfileCard />
      <DateCard />
      {/* @ts-expect-error - TodosCard component expects a todos prop initializing with hardcoded todos inside the component anyway, you don't need the todos prop at all */}
      <TodosCard />
    </>
  );
}