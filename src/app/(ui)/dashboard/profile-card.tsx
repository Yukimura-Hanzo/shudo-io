//? SHADCN UI
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileCard() {
  return (
    <div className="profile-card-container border-3 m-4">
      <div className="profile-card-content flex items-center justify-between w-full p-4">
        <span>
          <h2 className="text-xl font-semibold">
            Good Morning&#x1F596;, TXN
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Welcome back to your dashboard.
          </p>
        </span>
        <span>
          <Avatar>
            <AvatarImage src="/avatars/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </span>
      </div>
    </div>
  );
}