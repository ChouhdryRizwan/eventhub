"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, formatEventDate } from "@/lib/utils";

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  blocked: boolean;
  role: string;
  createdAt: string;
}

interface UsersTableProps {
  users: AdminUser[];
  currentUserId: string;
  busyId: number | null;
  onToggleBlocked: (user: AdminUser) => void;
}

export default function UsersTable({ users, currentUserId, busyId, onToggleBlocked }: UsersTableProps) {
  const [confirming, setConfirming] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto rounded-card border border-gray-200 bg-white">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th scope="col" className="px-4 py-3">User</th>
            <th scope="col" className="px-4 py-3">Role</th>
            <th scope="col" className="px-4 py-3">Joined</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => {
            const self = String(user.id) === currentUserId;
            const protectedUser = self || user.role === "admin";
            return (
              <tr key={user.id} className={cn(busyId === user.id && "opacity-60")}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">{user.full_name || user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", user.role === "admin" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-700")}>
                    {user.role === "admin" ? "Administrator" : "Member"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatEventDate(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", user.blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700")}>
                    {user.blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    {protectedUser ? (
                      <span className="text-xs text-gray-400">{self ? "You" : "—"}</span>
                    ) : confirming === user.id ? (
                      <div role="alertdialog" aria-label={`Confirm ${user.blocked ? "unblocking" : "blocking"} ${user.email}`} className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{user.blocked ? "Unblock?" : "Block?"}</span>
                        <Button size="sm" variant={user.blocked ? "primary" : "danger"} onClick={() => { setConfirming(null); onToggleBlocked(user); }}>
                          Yes
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>
                          No
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setConfirming(user.id)}>
                        {user.blocked ? "Unblock" : "Block"}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
