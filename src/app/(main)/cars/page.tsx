import { CarFilters } from "./_components/carFilters";
import { getCarFilters } from "@/actions/carListing";
import { CarListings } from "./_components/carListing";

export const metadata = {
  title: "Cars | Autora",
  description: "Browse and search for your dream car",
  
};

export default async function CarsPage() {
  // Fetch filters data on the server
  const filtersData = await getCarFilters();

  return (
    <div className="container mx-auto px-4 md:py-4 py-8">
      <h1 className="text-6xl mb-4 font-bold">Browse Cars</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <CarFilters filters={filtersData.data} />
        </div>
        {/* Car Listings */}
        <div className="flex-1">
          <CarListings />
        </div>
      </div>
    </div>
  );
}