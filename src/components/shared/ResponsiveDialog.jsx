import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { X } from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";

export function ResponsiveDialog({ open, setOpen, children }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="outline"> </Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[800px] gap-1 ">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* <DrawerTrigger asChild>
        <Button variant="outline"> </Button>
      </DrawerTrigger> */}

      <DrawerContent>
        <DrawerHeader className="text-left m-0 p-0">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        {children}
        {/* <DrawerFooter className="pt-2">
          
        </DrawerFooter> */}
        <DrawerClose asChild>
          <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4  cursor-pointer" />
            <span className="sr-only">Close</span>
          </div>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
