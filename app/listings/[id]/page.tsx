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

const CATEGORY_LABELS: Record<string, string> = {
  FULL_FLAT: "Full Flat",
  MESS: "Mess",
  SEAT: "Seat",
  SUBLET: "Sublet",
  FLAT_SALE: "Flat for Sale",
  LAND_SALE: "Land for Sale",
};

export default function ListingDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const { isWishlisted, toggleWishlist } = useWishlistStore();
