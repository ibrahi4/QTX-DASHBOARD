import { useState } from "react";
import { Pencil, Trash2, Eye, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ArabicTable({ headData, children, className }) {
  return (
    <div className={`container mx-auto p-4 ${className} `}>
      <div className="border-b ">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow className="w-full hover:dark:bg-gray-800">
              {headData.map((head, idx) => (
                <TableHead
                  key={idx}
                  className="font-bold text-center dark:text-white whitespace-nowrap"
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{children}</TableBody>
        </Table>
      </div>
    </div>
  );
}
