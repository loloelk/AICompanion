import { Button } from "./button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

export function PrintButton() {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Button onClick={handlePrint} variant="outline">
        <Printer className="w-4 h-4 mr-2" />
        Print Plan
      </Button>
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          {/* Print content will be rendered here */}
        </div>
      </div>
    </>
  );
}
