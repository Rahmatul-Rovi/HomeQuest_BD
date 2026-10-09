type ListingDetail = {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: "RENT" | "SALE";
  category: string;
  bedroom: number | null;
  bathroom: number | null;
  areaSize: number | null;
  bachelorAllowed: boolean;
  address: string;
  images: string[];
  owner: { id: string; name: string; verified: boolean; email: string };
};
