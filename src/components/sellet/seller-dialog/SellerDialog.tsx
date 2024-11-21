import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Globe, FileText } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SellerDialogProps {
  selectedSeller: any; 
  onClose: () => void;
  form: any;
  onSubmit: (data: any) => void; 
}

export const SellerDialog: React.FC<SellerDialogProps> = ({ selectedSeller, onClose, form, onSubmit }) => {
  if (!selectedSeller) return null;

  return (
    <Dialog open={!!selectedSeller} onOpenChange={onClose}>
      <AnimatePresence>
        <DialogContent className="sm:max-w-[600px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    delay: 0.2,
                  }}
                >
                  <Avatar>
                    <AvatarImage
                      src={selectedSeller.user.profilePicture || "/default-avatar.png"}
                      alt={`${selectedSeller.businessName} profile`}
                    />
                    <AvatarFallback>{selectedSeller.businessName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </motion.div>
                {selectedSeller.businessName}
              </DialogTitle>
              <DialogDescription>
                Detailed information about the seller request
              </DialogDescription>
            </DialogHeader>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "tween",
                delay: 0.3,
              }}
            >
              <div>
                <h4 className="font-semibold mb-2">Business Details</h4>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p>
                    <Mail className="inline mr-2 h-4 w-4 text-gray-500" />
                    {selectedSeller.email}
                  </p>
                  <p>
                    <Phone className="inline mr-2 h-4 w-4 text-gray-500" />
                    {selectedSeller.phone}
                  </p>
                  <p>
                    <Globe className="inline mr-2 h-4 w-4 text-gray-500" />
                    {selectedSeller.website || "N/A"}
                  </p>
                  <p>
                    <FileText className="inline mr-2 h-4 w-4 text-gray-500" />
                    GSTIN: {selectedSeller.gstin}
                  </p>
                </motion.div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p>Name: {selectedSeller.user.name}</p>
                  <p>Registered: {new Date(selectedSeller.createdAt).toLocaleDateString()}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Update Seller Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={selectedSeller.requestStatus}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Accepted">Accepted</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Update Status
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </AnimatePresence>
    </Dialog>
  );
};
