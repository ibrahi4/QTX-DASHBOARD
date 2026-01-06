import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  // ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";

const ResponsiveModalCustom = ({
  side = "bottom",
  open,
  setOpen,
  children,
}) => {
  return (
    <ResponsiveModal  open={open} onOpenChange={setOpen}>
      {/* <ResponsiveModalTrigger asChild>
        <Button variant="outline">{side}</Button>
      </ResponsiveModalTrigger> */}
      <ResponsiveModalContent  side={side}>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle></ResponsiveModalTitle>
          <ResponsiveModalDescription></ResponsiveModalDescription>
          {children}
        </ResponsiveModalHeader>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default ResponsiveModalCustom;
