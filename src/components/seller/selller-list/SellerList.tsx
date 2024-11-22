import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { RequestStatus } from "@prisma/client";
import { ISeller } from "@/types/seller/seller";

export default function SellerList({
  sellers,
  onViewDetails,
}: {
  sellers: ISeller[];
  onViewDetails: (seller: ISeller) => void;
}) {
  const getStatusClasses = (status: RequestStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-500 text-white";
      case "Accepted":
        return "bg-green-600 hover:bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 hover:bg-red-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const isValidImageUrl = (url: string | null | undefined) => {
    if (!url) return false;
    // Check if it's a valid HTTP/HTTPS URL
    return /^https?:\/\//.test(url);
  };

  return (
    <ScrollArea className="h-[calc(100vh-300px)] pr-4">
      <div className="grid gap-4">
        {sellers.length === 0 ? (
          <Card className="text-center shadow-md">
            <CardContent className="pt-6">
              <div className="text-gray-500 text-lg font-medium">
                No sellers found in this category
              </div>
            </CardContent>
          </Card>
        ) : (
          sellers.map((seller) => {
            const statusClasses = getStatusClasses(seller.requestStatus);
            
            // Improved image URL validation
            const profilePicture = isValidImageUrl(seller.user.profilePicture)
              ? seller.user.profilePicture
              : "/default-avatar.png";

            return (
              <Card
                key={seller.id}
                className="p-6 border-l-4 border-transparent shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 items-center">
                    <Avatar>
                      <AvatarImage
                        src={profilePicture!}
                        alt={`${seller.businessName} profile`}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback to default if image fails to load
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                      <AvatarFallback delayMs={600}>
                        {seller.businessName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-xl text-blue-900 hover:text-blue-700">
                        {seller.businessName || "Unknown Business"}
                      </h3>
                      <p className="text-sm text-gray-600 hover:text-gray-800">
                        {seller.user.name || "Unknown User"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${statusClasses}`}
                    >
                      {seller.requestStatus || "Unknown"}
                    </span>
                    <Button
                      onClick={() => onViewDetails(seller)}
                      variant="secondary"
                      className="hover:shadow-sm bg-gray-800 hover:bg-gray-800 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}