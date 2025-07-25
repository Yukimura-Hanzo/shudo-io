//? UI COMPONENTS
import BudgetCard from "@/app/(ui)/dashboard/financial-log-app/budget-card";
import DateCard from "@/app/(ui)/dashboard/date-card";
import ProfileCard from "@/app/(ui)/dashboard/profile-card";
import TodosCard from "@/app/(ui)/dashboard/todo-app/todos-card";

export default function DashboardOverview() {
  return (
    <>
      <ProfileCard />
      <DateCard />
      <TodosCard />
      {/* <BudgetCard /> */}
    </>
  );
}