import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import SellerList from "@/components/sellet/selller-list/SellerList"; 
import { ISeller } from "@/types/seller/seller";
import { RequestStatus, Seller } from "@prisma/client";

interface SellerTabsProps {
  tabs: any[];
  sellers: ISeller[];
  handleStatusUpdate: (id: string, status: RequestStatus) => Promise<void>;
  setSelectedSeller: (seller: ISeller | null) => Promise<void>|void;
}

export default function SellerTabs({
  tabs,
  sellers,
  handleStatusUpdate,
  setSelectedSeller,
}: SellerTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      {/* Tabs List */}
      <TabsList className="w-full mt-8 bg-white border border-gray-200 rounded-2xl flex justify-between">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative w-full rounded-xl hover:bg-gray-100 data-[state=active]:bg-gray-100"
          >
            <motion.div
              layoutId="active-tab-bg"
              className="absolute inset-0 bg-gray-100 rounded-xl"
            />
            <div className="relative z-10 flex items-center justify-center w-full py-2 space-x-2">
              <tab.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{tab.label}</span>
              <motion.span
                key={`count-${tab.value}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {tab.count}
              </motion.span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>


      <AnimatePresence mode="wait">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            <motion.div
              key={`content-${tab.value}`}
              initial={{
                opacity: 0,
                x: 50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -50,
              }}
              transition={{
                type: "tween",
                duration: 0.3,
              }}
            >
              <SellerList
                sellers={
                  tab.value === "all"
                    ? sellers
                    : sellers.filter((s) => s.requestStatus === tab.value)
                }
                onViewDetails={setSelectedSeller}
              />
            </motion.div>
          </TabsContent>
        ))}
      </AnimatePresence>
    </Tabs>
  );
}
