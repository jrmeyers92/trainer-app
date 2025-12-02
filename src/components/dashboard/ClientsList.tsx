// components/dashboard/ClientsList.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Client, getClientStatusColor } from "@/lib/types/database-helpers";
import { Mail, MoreVertical, Phone } from "lucide-react";
import Link from "next/link";

interface ClientsListProps {
  clients: Client[];
}

export default function ClientsList({ clients }: ClientsListProps) {
  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first client. You&apos;ll be able to
            create programs, track progress, and manage payments.
          </p>
          <Link href="/dashboard/clients/new">
            <Button>Add Your First Client</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Clients</h2>
          <Link href="/dashboard/clients">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {clients.slice(0, 5).map((client) => (
          <div
            key={client.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Avatar */}
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                  {client.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>

                {/* Client Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/clients/${client.id}`}>
                      <h3 className="font-semibold hover:text-blue-600 transition-colors">
                        {client.full_name}
                      </h3>
                    </Link>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getClientStatusColor(
                        client.status
                      )}`}
                    >
                      {client.status || "active"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    {client.email && (
                      <a
                        href={`mailto:${client.email}`}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        <Mail size={14} />
                        {client.email}
                      </a>
                    )}
                    {client.phone && (
                      <a
                        href={`tel:${client.phone}`}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        <Phone size={14} />
                        {client.phone}
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    {client.primary_goal && (
                      <span>
                        Goal: {client.primary_goal.replace(/_/g, " ")}
                      </span>
                    )}
                    {client.current_weight_lbs && (
                      <span>Weight: {client.current_weight_lbs} lbs</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {client.monthly_rate && (
                  <div className="text-right mr-4">
                    <p className="text-sm font-semibold">
                      ${client.monthly_rate}/mo
                    </p>
                    <p
                      className={`text-xs ${
                        client.payment_status === "current"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {client.payment_status || "current"}
                    </p>
                  </div>
                )}
                <Button variant="ghost" size="icon">
                  <MoreVertical size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {clients.length > 5 && (
        <div className="p-4 bg-gray-50 text-center border-t">
          <Link href="/dashboard/clients">
            <Button variant="ghost" size="sm">
              View all {clients.length} clients
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
